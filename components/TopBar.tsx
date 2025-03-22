import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { List } from 'phosphor-react-native';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

/**
 * TopBar - A reusable navigation top bar component
 * @param {Object} props - Component props
 * @param {Function} props.onMenuPress - Function to call when menu is pressed
 * @param {string} props.profileImagePath - Local path to profile image
 * @param {Object} props.style - Additional styles for the container
 */
interface TopBarProps {
  onMenuPress: () => void;
  profileImagePath?: string | { uri: string } | number; // Allow local require() or URI
  style?: object;
}

const TopBar: React.FC<TopBarProps> = ({ 
  onMenuPress, 
  profileImagePath = require('../assets/images/avatar.png'), // Default image path
  style 
}) => {
  const router = useRouter(); // Initialize the router

  // Handle profile button press
  const handleProfilePress = () => {
    router.push('/profile'); // Navigate to the profile screen
  };

  return (
    <View style={[styles.container, style]}>
      {/* Menu Button */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <List 
          size={28} 
          color="#FFFFFF" // Changed to white
        />
      </TouchableOpacity>

      {/* Profile Image */}
      <TouchableOpacity onPress={handleProfilePress} style={styles.profileContainer}>
        <Image 
          source={profileImagePath}
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
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});

export default TopBar;