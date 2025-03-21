import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX } from "@/constants/theme";
import { useRouter } from "expo-router";

const profile = () => {
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

  // Update dimensions on orientation changes
  useEffect(() => {
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
          setScreenWidth(window.width);
          setScreenHeight(window.height);
      });
      return () => subscription?.remove();
  }, []);

  // Calculate responsive values
  const avatarSize = screenWidth * 0.4 > 200 ? 200 : screenWidth * 0.4;
  const menuWidth = screenWidth * 0.9 > 368 ? 368 : screenWidth * 0.9;
  const fontSize = screenWidth * 0.04 > 16 ? 16 : screenWidth * 0.04;
  const headerFontSize = screenWidth * 0.07 > 30 ? 30 : screenWidth * 0.07;
  
  return (
      <ScreenWrapper>
          <SafeAreaView style={styles.container}>
              <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 100 }}
              >
                  <View style={styles.profileInfo}>
                      <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
                          <Image 
                              source={require('../../assets/images/avatar.png')} 
                              style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
                          />
                      </View>
                      <Text style={[styles.userName, { fontSize: headerFontSize }]}>Vidusha.W</Text>

                      <View style={styles.verifiedContainer}>
                          <Image 
                              source={require('../../assets/images/verify-icon.png')} 
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
                          <Image source={require('../../assets/images/settings-icon.png')} />
                          <Text style={[styles.menuText, { fontSize: fontSize }]}>Settings</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                          style={[styles.menuItem, { width: menuWidth }]}
                          onPress={() => router.push('../other/reminders')} // Keep feature from apurva-reminders branch
                      >
                          <Image source={require('../../assets/images/reminders-icon.png')} />
                          <Text style={[styles.menuText, { fontSize: fontSize }]}>Reminders</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                          style={[styles.menuItem, { width: menuWidth }]} 
                          onPress={() => router.push("/(profile)/subscription")}
                      >
                          <Image source={require('../../assets/images/premium-icon.png')} />
                          <Text style={[styles.menuText, { fontSize: fontSize }]}>Premium</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                          style={[styles.menuItem, { width: menuWidth }]} 
                          onPress={() => router.push("/(profile)/help-and-support")}
                      >
                          <Image source={require('../../assets/images/Help-and-support-icon.png')} />
                          <Text style={[styles.menuText, { fontSize: fontSize }]}>Help & Support</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                          style={[styles.deleteItem, { width: menuWidth }]} 
                          onPress={() => router.push("/(auth)/login")}
                      >
                          <Image source={require('../../assets/images/settings-page/logout-icon.png')} />
                          <Text style={[styles.deleteText, { fontSize: fontSize }]}>Logout</Text>
                      </TouchableOpacity>
                  </View>
              </ScrollView>
          </SafeAreaView>
      </ScreenWrapper>
  );
};

export default profile;

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
    },
    avatar: {
        resizeMode: 'cover',
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
        flex: 1,
    },
    activeTab: {
        borderTopWidth: 2,
        borderTopColor: '#4CAF50',
        paddingTop: 13,
    },
});