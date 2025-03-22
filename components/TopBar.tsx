import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { List } from 'phosphor-react-native';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { auth, db } from '@/firebaseAuth';
import { getDoc, doc } from 'firebase/firestore';

/**
 * TopBar - A reusable navigation top bar component that displays the user's profile image from Firebase
 * @param {Object} props - Component props
 * @param {Function} props.onMenuPress - Function to call when menu is pressed
 * @param {Object} props.style - Additional styles for the container
 */
interface TopBarProps {
  onMenuPress: () => void;
  style?: object;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onMenuPress, 
  style 
}) => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the user's profile image from Firebase when component mounts
  useEffect(() => {
    const fetchUserProfileImage = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.profileImage) {
              setProfileImage(userData.profileImage);
              console.log("Profile image loaded from Firestore in TopBar");
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileImage();
  }, []);

  // Handle profile button press
  const handleProfilePress = () => {
    router.push('/(drawer_tabs)/(tabs)/profile');
  };

  return (
    <View style={[styles.container, style]}>
      {/* Menu Button */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <List 
          size={28} 
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {/* Profile Image */}
      <TouchableOpacity onPress={handleProfilePress} style={styles.profileContainer}>
        <Image 
          source={profileImage ? { uri: profileImage } : require('../assets/images/avatar.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.primaryDark,
    elevation: 4, // Android shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  menuButton: {
    padding: 5,
    width: 40,
    height: 40
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.neutral900, // Add background color to match the profile avatar container
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});

export default TopBar;