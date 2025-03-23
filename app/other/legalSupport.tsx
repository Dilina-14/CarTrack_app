import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { Funnel, MagnifyingGlass } from "phosphor-react-native";
import { useRouter } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import { ref, getDownloadURL, listAll, getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebaseAuth';
import { getAuth } from 'firebase/auth';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Define types for document
interface DocumentItem {
  id: string;
  title: string;
  date: string;
  url?: string;
}

const LegalSupportScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentItem[]>([]);

  // Request media library permissions
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (!permissionResponse || !permissionResponse.granted) {
      requestPermission();
    }
  }, [permissionResponse]);

  // Fetch documents from Firebase on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filter documents based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    } else {
      setFilteredDocuments(documents);
    }
  }, [searchQuery, documents]);

  // Fetch documents from Firebase
  const fetchDocuments = async () => {
    try {
      const storageRef = ref(storage, 'legal-documents');
      const result = await listAll(storageRef);

      console.log("Firebase Storage result:", result); // Log the result

      const docsPromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const name = itemRef.name;
        const uploadDate = new Date().toLocaleDateString();

        console.log("File URL:", url); // Log the file URL
        console.log("File Name:", name); // Log the file name

        return {
          id: name,
          title: name.replace('.pdf', ''),
          date: uploadDate,
          url: url,
        };
      });

      const fetchedDocs = await Promise.all(docsPromises);

      if (fetchedDocs.length > 0) {
        setDocuments(fetchedDocs);
        setFilteredDocuments(fetchedDocs);
      } else {
        console.log("No documents found in Firebase. Using sample documents.");
        setDocuments([
          { id: '1', title: '6A_6B_MAT8', date: '15/01/2025' },
          { id: '2', title: 'mta2_1', date: '03/11/2024' },
        ]);
        setFilteredDocuments([
          { id: '1', title: '6A_6B_MAT8', date: '15/01/2025' },
          { id: '2', title: 'mta2_1', date: '03/11/2024' },
        ]);
      }
    } catch (error) {
      console.error("Error fetching documents: ", error);
      Alert.alert("Error", "Failed to load documents from Firebase");
    }
  };

  const handleDocumentPress = (id: string, title: string) => {
    router.push({
      pathname: "/other/legalSupport",
      params: { id, title }
    });
  };

  const downloadDocument = async (document: DocumentItem) => {
    try {
      const { url, title } = document;

      if (!url) {
        Alert.alert("Error", "Document URL not available");
        return;
      }

      // Check media library permissions
      if (!permissionResponse || !permissionResponse.granted) {
        Alert.alert("Permission Denied", "We need storage permission to save files to your device.");
        return;
      }

      // Show downloading indicator
      Alert.alert("Downloading", `${title} is being downloaded...`);

      // Create a temporary file path in the cache directory
      const fileUri = `${FileSystem.cacheDirectory}${title}.pdf`;

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(url, fileUri);

      if (!downloadResult || !downloadResult.uri) {
        throw new Error("Download failed");
      }

      // Save the file to the device's Downloads folder
      if (Platform.OS === 'android') {
        try {
          const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
          let album = await MediaLibrary.getAlbumAsync("Downloads");

          if (!album) {
            // If the Downloads album doesn't exist, create it
            album = await MediaLibrary.createAlbumAsync("Downloads", asset, false);
          } else {
            // Add the file to the existing Downloads album
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          }

          // Notify the user
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Download Successful",
              body: `${title} has been saved to your Downloads folder.`,
            },
            trigger: null,
          });

          Alert.alert(
            "Download Complete",
            `${title} has been saved to your Downloads folder.`
          );
        } catch (mediaError) {
          console.error("MediaLibrary error:", mediaError);

          // Fallback: Share the file if saving to Downloads fails
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(downloadResult.uri, {
              mimeType: 'application/pdf',
              dialogTitle: `Share ${title}`,
            });

            Alert.alert(
              "Download Complete",
              `${title} could not be saved directly to Downloads. Please save it manually from the share menu.`
            );
          } else {
            Alert.alert(
              "Download Error",
              "Could not save or share the file. Please try again."
            );
          }
        }
      } else {
        // For iOS, share the file so the user can save it manually
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri, {
            UTI: 'com.adobe.pdf',
            mimeType: 'application/pdf',
          });
        } else {
          Alert.alert(
            "Download Complete",
            `${title} has been downloaded but cannot be shared. Please try again.`
          );
        }
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(
        "Download Failed",
        "There was an error downloading the document."
      );
    }
  };

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
          <TouchableOpacity onPress={() => {
            setFilteredDocuments([...documents].sort((a, b) => a.title.localeCompare(b.title)));
            setFilterModalVisible(false);
          }}>
            <Text style={styles.filterOption}>Sort by Name (A-Z)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setFilteredDocuments([...documents].sort((a, b) => b.title.localeCompare(a.title)));
            setFilterModalVisible(false);
          }}>
            <Text style={styles.filterOption}>Sort by Name (Z-A)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setFilteredDocuments([...documents].sort((a, b) => {
              const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
              const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
              return dateA - dateB;
            }));
            setFilterModalVisible(false);
          }}>
            <Text style={styles.filterOption}>Oldest First</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setFilteredDocuments([...documents].sort((a, b) => {
              const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
              const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
              return dateB - dateA;
            }));
            setFilterModalVisible(false);
          }}>
            <Text style={styles.filterOption}>Newest First</Text>
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
        <View style={styles.headerContainer}></View>
        <Text style={styles.header}>Legal and Regulatory Documents</Text>

        <View style={styles.searchBarContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Funnel size={24} color="white" weight="bold" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search documents"
              placeholderTextColor="gray"
              style={styles.input}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <MagnifyingGlass size={20} color="black" />
          </View>
        </View>

        <ScrollView style={styles.documentsList}>
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((item) => (
              <View key={item.id} style={styles.documentItem}>
                <TouchableOpacity
                  style={styles.documentContent}
                  onPress={() => handleDocumentPress(item.id, item.title)}
                >
                  <View style={styles.documentIconContainer}>
                    <Ionicons name="document-text-outline" size={30} color="#fff" />
                  </View>
                  <View style={styles.documentTextContainer}>
                    <Text style={styles.documentTitle}>{item.title}</Text>
                    <Text style={styles.documentDate}>Uploaded Date - {item.date}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadButton}
                  onPress={() => downloadDocument(item)}
                >
                  <Ionicons name="download-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noDocumentsContainer}>
              <Text style={styles.noDocumentsText}>No documents found</Text>
            </View>
          )}
        </ScrollView>

        <FilterModal />
      </View>
    </ScreenWrapper>
  );
};

export default LegalSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    position: 'relative',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 18,
    color: '#C3FF65',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  documentsList: {
    paddingHorizontal: 20,
    marginTop: 20
  },
  documentItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1f1f1f',
  },
  documentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  documentIconContainer: {
    backgroundColor: '#EFE015',
    padding: 16,
    borderRadius: 8.58,
    marginRight: 12,
  },
  documentTextContainer: {
    paddingVertical: 15,
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  documentDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  downloadButton: {
    backgroundColor: '#EFE015',
    padding: 12,
    borderRadius: 8,
    marginRight: 5,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#121212',
    padding: 10,
    paddingHorizontal: 20,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1570EF",
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  filterOption: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 12,
    width: '100%',
    textAlign: 'center',
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
  noDocumentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  noDocumentsText: {
    color: '#aaa',
    fontSize: 16,
  },
});