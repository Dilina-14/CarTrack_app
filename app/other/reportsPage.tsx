import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { Funnel, MagnifyingGlass } from "phosphor-react-native";
import { colors } from '@/constants/theme';
import { useRouter } from "expo-router";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "@/firebaseAuth"; 

// Define proper types for the report items
interface ReportItem {
  id: string;
  title: string;
  date: string;
  liked: boolean;
  likeCount: number;
}

// Define the Firestore document structure
interface ReportDocument {
  id: string;
  title: string;
  date: string;
  likeCount: number;
  likedBy: string[];
}

const ReportsPage = () => {
  const router = useRouter();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [reminders, setReminders] = useState<ReportItem[]>([]);
  const [filteredReminders, setFilteredReminders] = useState<ReportItem[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigation = useNavigation();
  const auth = getAuth();

  // Get current user ID from Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        setUserId(uid);
        console.log("Current authenticated user ID:", uid);
      } else {
        // User is signed out, generate a temporary ID for demo purposes
        // In a real app, you might want to redirect to login instead
        const generateTempId = async () => {
          try {
            let tempId = await AsyncStorage.getItem('tempUserId');
            if (!tempId) {
              tempId = 'temp_' + Date.now().toString();
              await AsyncStorage.setItem('tempUserId', tempId);
            }
            setUserId(tempId);
            console.log("Using temporary user ID:", tempId);
          } catch (error) {
            console.error('Error generating temporary userId:', error);
          }
        };
        generateTempId();
      }
    });

    // Clean up the auth listener
    return () => unsubscribe();
  }, []);

  // Load reports from Firebase and listen for real-time updates
  useEffect(() => {
    if (!userId) return;

    const reportsRef = collection(db, 'vehicleReports');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(reportsRef, (snapshot) => {
      const reportsData: ReportItem[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data() as ReportDocument;
        
        // Check if THIS user has liked the report
        const likedByCurrentUser = data.likedBy && data.likedBy.includes(userId);
        
        reportsData.push({
          id: doc.id,
          title: data.title,
          date: data.date,
          liked: likedByCurrentUser || false,
          likeCount: data.likeCount || 0
        });
      });
      
      setReminders(reportsData);
      setFilteredReminders(reportsData);
    }, (error) => {
      console.error("Error getting reports:", error);
    });

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [userId]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReminders(reminders);
    } else {
      const filtered = reminders.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReminders(filtered);
    }
  }, [searchQuery, reminders]);

  // Initialize Firebase with sample data (only run once)
  useEffect(() => {
    const initializeFirebaseData = async () => {
      try {
        // Check if data already exists
        const reportsRef = collection(db, 'vehicleReports');
        const sampleReportRef = doc(reportsRef, '1');
        const sampleReportDoc = await getDoc(sampleReportRef);
        
        if (!sampleReportDoc.exists()) {
          // Initialize with sample data if it doesn't exist
          const initialReports: ReportDocument[] = [
            { id: '1', title: 'Honda Vezel', date: '20/10/2024', likeCount: 0, likedBy: [] },
            { id: '2', title: 'Toyota Yaris', date: '01/10/2025', likeCount: 0, likedBy: [] },
            { id: '3', title: 'Mazda 6', date: '01/10/2025', likeCount: 0, likedBy: [] },
          ];
          
          for (const report of initialReports) {
            await setDoc(doc(reportsRef, report.id), report);
          }
          console.log("Sample data initialized in Firestore");
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };
    
    initializeFirebaseData();
  }, []);

  // Handle like button click - update Firebase
  const handleLike = async (id: string, isCurrentlyLiked: boolean) => {
    if (!userId) {
      console.log("Cannot like: No user ID available");
      // You might want to redirect to login here
      return;
    }
    
    try {
      const reportRef = doc(db, 'vehicleReports', id);
      const reportDoc = await getDoc(reportRef);
      
      if (!reportDoc.exists()) {
        console.error("Report document not found:", id);
        return;
      }
      
      const reportData = reportDoc.data() as ReportDocument;
      const userLikedArray = reportData.likedBy || [];
      const userHasLiked = userLikedArray.includes(userId);
      
      // If the UI state and actual Firestore state don't match, sync them
      if (userHasLiked !== isCurrentlyLiked) {
        console.warn("UI like state out of sync with Firestore. Syncing...");
        isCurrentlyLiked = userHasLiked;
      }
      
      if (isCurrentlyLiked) {
        // User is unliking the report
        await updateDoc(reportRef, {
          likeCount: increment(-1),
          likedBy: arrayRemove(userId)
        });
        console.log(`User ${userId} removed like from report ${id}`);
      } else {
        // User is liking the report
        await updateDoc(reportRef, {
          likeCount: increment(1),
          likedBy: arrayUnion(userId)
        });
        console.log(`User ${userId} added like to report ${id}`);
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // Function to clear user ID (for testing)
  const clearUserIdForTesting = async () => {
    try {
      await AsyncStorage.removeItem('tempUserId');
      alert('User ID cleared! Restart the app to get a new ID.');
    } catch (error) {
      console.error('Error clearing user ID:', error);
    }
  };

  // Filter modal component
  const FilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter Options</Text>
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => a.title.localeCompare(b.title)));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Sort by Name (A-Z)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => b.title.localeCompare(a.title)));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Sort by Name (Z-A)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
                const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
                return dateA - dateB;
              }));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Oldest First</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
                const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
                return dateB - dateA;
              }));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Newest First</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => b.likeCount - a.likeCount));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Most Liked</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={() => setFilterModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          
        </View>
        <Text style={styles.header}>Vehicle Model Reports</Text>

        <View style={styles.searchBarContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Funnel size={24} color="white" weight="bold" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="gray"
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <MagnifyingGlass size={20} color="black" />
          </View>
        </View>

        <ScrollView style={styles.remindersList}>
          {filteredReminders.map((item) => (
            <View key={item.id} style={styles.reminderItem}>
              <TouchableOpacity
                style={styles.reminderContent}
                onPress={() => {
                  if (item.id === '1') {
                    router.push("/(reports)/hondaVezel"); // Navigate to Honda Vezel screen
                  } else if (item.id === '2') {
                    router.push("/(reports)/toyotaYarisScreen"); // Navigate to Toyota Yaris screen
                  } else if (item.id === '3') {
                    router.push("/(reports)/mazda6Screen"); // Navigate to Mazda 6 screen
                  }
                }}
              >
                <View style={styles.bellIconContainer}>
                  <Ionicons name="document-outline" size={30} color="#fff" />
                </View>
                <View style={styles.reminderTextContainer}>
                  <Text style={styles.reminderTitle}>{item.title}</Text>
                  <Text style={styles.reminderDate}>Uploaded Date - {item.date}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.likeButton} 
                onPress={() => handleLike(item.id, item.liked)}
              >
                <Ionicons 
                  name={item.liked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={item.liked ? "red" : "#fff"} 
                />
                <Text style={styles.heartCount}>{item.likeCount}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <FilterModal />
      </View>
    </ScreenWrapper>
  );
};

export default ReportsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    position: 'relative',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    color: '#C3FF65',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  userIdText: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  testButton: {
    backgroundColor: '#333',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  remindersList: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  reminderItem: {
    backgroundColor: '#0c0c0c',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  bellIconContainer: {
    backgroundColor: '#1570EF',
    padding: 16,
    borderRadius: 8.58,
    marginRight: 12,
  },
  reminderTextContainer: {
    paddingVertical: 15,
    flex: 1,
  },
  heartCount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  reminderTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  reminderDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  likeButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    padding: 10,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    color: '#C3FF65',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterOptionButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});