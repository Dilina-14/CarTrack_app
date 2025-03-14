import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX } from "@/constants/theme";
import { useRouter } from "expo-router";


const profile = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>

      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image
            source={require('../../assets/images/avatar.png')}
            style={styles.avatar}
          />


        </View>
        <Text style={styles.userName}>Vidusha.W</Text>

        <View style={styles.verifiedContainer}>
          <Image
            source={require('../../assets/images/verify-icon.png')}
            style={styles.verifyIcon}
          />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>


      <View style={styles.menuOptions}>
        <TouchableOpacity style={styles.menuItem}>
          <Image source={require('../../assets/images/settings-icon.png')} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/reminders')} // Navigate to Reminders screen
        >
          <Image source={require('../../assets/images/reminders-icon.png')} />
          <Text style={styles.menuText}>Reminders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image source={require('../../assets/images/premium-icon.png')} />
          <Text style={styles.menuText}>Premium</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Image source={require('../../assets/images/Help-and-support-icon.png')} />
          <Text style={styles.menuText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteItem}>
          <Image source={require('../../assets/images/delete-icon.png')} />
          <Text style={styles.deleteText}>Delete Profile</Text>
        </TouchableOpacity>
      </View>

    </ScreenWrapper>
  );
};

export default profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },

  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    width: 200,
    height: 200,
    borderRadius: "100%",
    backgroundColor: colors.neutral900,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 50,
  },
  avatar: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  userName: {
    color: '#C6FF66',
    fontSize: 30,
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
    fontSize: 15,
    marginLeft: 5,
  },
  menuOptions: {
    marginTop: 30,
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 368,
    height: 61,
    marginBottom: 14,

  },
  menuText: {
    color: 'white',
    marginLeft: 15,
    fontSize: 16,
  },
  deleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 368,
    height: 61,
    marginBottom: 14,
  },
  deleteText: {
    color: '#FF5252',
    marginLeft: 15,
    fontSize: 16,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingVertical: 15,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Ensures equal spacing for each tab
  },

  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
    paddingTop: 13,
  },
});