import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from "react-native";
import { auth, db, storage } from "@/firebaseAuth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDoc, doc, setDoc } from "firebase/firestore";

const Profile = () => {
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [userName, setUserName] = useState("Vidusha.W");

  // Update dimensions on orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
      setScreenHeight(window.height);
    });
    return () => subscription?.remove();
  }, []);

  // Fetch the user's profile image on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          console.log("Fetching profile for user:", user.uid);
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.profileImage) {
              setProfileImage(userData.profileImage);
              console.log("Profile image loaded from Firestore");
            }
            if (userData.userName) {
              setUserName(userData.userName);
            }
          } else {
            console.log("No user document exists yet");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        console.log("No authenticated user found during profile fetch");
      }
    };

    fetchUserProfile();
  }, []);

  // Image picker function
  const pickImage = async () => {
    try {
      // Check if user is authenticated
      const user = auth.currentUser;
      if (!user) {
        console.error("No authenticated user found");
        Alert.alert("Authentication Error", "Please login again before updating your profile");
        return;
      }
      console.log("Authenticated user ID:", user.uid);

      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Sorry, we need camera roll permissions to change your profile picture!");
        return;
      }

      // Launch image picker
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        // Update UI immediately with local image
        setProfileImage(imageUri);
        console.log("Local image selected:", imageUri);

        console.log("Starting upload for user:", user.uid);
        
        // Convert image to blob for upload
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        // Create a unique filename
        const fileName = `profile_${new Date().getTime()}`;
        const storagePath = `profileImages/${user.uid}/${fileName}`;
        console.log("Uploading to path:", storagePath);
        
        // Create storage reference and upload
        const storageRef = ref(storage, storagePath);
        
        // Upload image
        console.log("Starting upload task...");
        await uploadBytes(storageRef, blob);
        console.log("Upload completed successfully");
        
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Download URL obtained:", downloadURL);

        // Save the download URL to Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { 
          profileImage: downloadURL,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        console.log("Firestore update completed");

        // Update the local state with the remote URL
        setProfileImage(downloadURL);
        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error: any) {
      console.error("Detailed error:", error);
      
      // More user-friendly error messages
      if (error.code === 'storage/unauthorized') {
        Alert.alert("Permission Error", "Storage permission denied. Please try logging out and back in.");
      } else if (error.code === 'permission-denied') {
        Alert.alert("Database Error", "Database permission denied. Please try logging out and back in.");
      } else {
        Alert.alert("Update Failed", "There was a problem updating your profile picture. Please try again.");
      }
    }
  };

  // Calculate responsive values
  const avatarSize = screenWidth * 0.4 > 200 ? 200 : screenWidth * 0.4;
  const menuWidth = screenWidth * 0.9 > 368 ? 368 : screenWidth * 0.9;
  const fontSize = screenWidth * 0.04 > 16 ? 16 : screenWidth * 0.04;
  const headerFontSize = screenWidth * 0.07 > 30 ? 30 : screenWidth * 0.07;

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Logout Failed", "There was a problem signing out. Please try again.");
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.profileInfo}>
            <TouchableOpacity 
              style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}
              onPress={pickImage}
              onPressIn={() => setShowOverlay(true)}
              onPressOut={() => setShowOverlay(false)}
            >
              <Image 
                source={profileImage ? { uri: profileImage } : require('../../../assets/images/avatar.png')} 
                style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
              />
              {showOverlay && (
                <View style={styles.avatarOverlay}>
                  <Ionicons name="pencil" size={avatarSize * 0.2} color="white" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={[styles.userName, { fontSize: headerFontSize }]}>{userName}</Text>
            <View style={styles.verifiedContainer}>
              <Image 
                source={require('../../../assets/images/verify-icon.png')} 
                style={styles.verifyIcon}
              />
              <Text style={[styles.verifiedText, { fontSize: fontSize * 0.9 }]}>Verified</Text>
            </View>
          </View>

          <View style={styles.menuOptions}>
            <TouchableOpacity 
              style={[styles.menuItem, { width: menuWidth }]} 
              onPress={() => router.push("/(profile)/settings")}
            >
              <Image source={require('../../../assets/images/settings-icon.png')} />
              <Text style={[styles.menuText, { fontSize: fontSize }]}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, { width: menuWidth }]}
              onPress={() => router.push('../../other/reminders')}
            >
              <Image source={require('../../../assets/images/reminders-icon.png')} />
              <Text style={[styles.menuText, { fontSize: fontSize }]}>Reminders</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, { width: menuWidth }]} 
              onPress={() => router.push("/(profile)/subscription")}
            >
              <Image source={require('../../../assets/images/premium-icon.png')} />
              <Text style={[styles.menuText, { fontSize: fontSize }]}>Premium</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, { width: menuWidth }]} 
              onPress={() => Linking.openURL("https://www.cartrackapp.online")}
            >
              <Image source={require('../../../assets/images/Help-and-support-icon.png')} />
              <Text style={[styles.menuText, { fontSize: fontSize }]}>Help & Support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.deleteItem, { width: menuWidth }]} 
              onPress={handleLogout}
            >
              <Image source={require('../../../assets/images/settings-page/logout-icon.png')} />
              <Text style={[styles.deleteText, { fontSize: fontSize }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: '5%',
  },
  avatarContainer: {
    borderRadius: 100,
    backgroundColor: colors.neutral900,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: '10%',
    position: 'relative',
  },
  avatar: {
    resizeMode: 'cover',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  userName: {
    color: '#C6FF66',
    fontWeight: 'bold',
    marginTop: 15,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  verifyIcon: {
    width: 15,
    height: 15,
    marginRight: 3,
  },
  verifiedText: {
    color: '#4682B4',
    marginLeft: 5,
  },
  menuOptions: {
    marginTop: '8%',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    height: 61,
    marginBottom: 14,
  },
  menuText: {
    color: 'white',
    marginLeft: 15,
  },
  deleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    height: 61,
    marginBottom: 14,
  },
  deleteText: {
    color: '#FF5252',
    marginLeft: 15,
  },
});