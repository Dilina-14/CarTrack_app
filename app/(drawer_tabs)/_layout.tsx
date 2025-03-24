import React, { useState } from 'react';
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { ComponentProps } from 'react';

type MenuItem = {
  id: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  screen: string;
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathname = usePathname();
  // Extract the route name from the path to determine active item
  const routeSegments = pathname.split('/');
  const currentRoute = routeSegments[routeSegments.length - 1] || 'index';
  
  const [activeItem, setActiveItem] = useState(currentRoute);

  const menuItems: MenuItem[] = [
    { id: 'index', icon: 'home', label: 'Home', screen: '/(drawer_tabs)/' },
    { id: 'news', icon: 'newspaper', label: 'News', screen: '/(drawer_tabs)/news' },
    { id: 'marketplace', icon: 'cart', label: 'Marketplace', screen: '/(drawer_tabs)/marketplace' },
    { id: 'legalsupport', icon: 'document', label: 'Legal Support', screen: '/other/legalSupport' },
    { id: 'reportsPage', icon: 'document-text', label: 'ReportsPage', screen: '/other/reportsPage' },
    { id: 'profile', icon: 'person', label: 'Profile', screen: '/(drawer_tabs)/profile' },
    { id: 'chatbot', icon: 'chatbubble', label: 'ChatBot', screen: '/other/chatbot' },
    { id: 'logout', icon: 'log-out-outline', label: 'Logout', screen: '/(auth)/login' },
  ];

  const handleMenuItemPress = (item: MenuItem) => {
    setActiveItem(item.id);
    props.navigation.closeDrawer(); // Close drawer after selection
    
    if (item.screen) {
      // Add a small delay to make the transition smoother
      setTimeout(() => {
        router.push(item.screen as any);
      }, 100);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
      </View>

      {/* Separator Bar */}
      <View style={styles.separator} />

      <ScrollView style={styles.menuList}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              activeItem === item.id && styles.activeMenuItem,
            ]}
            onPress={() => handleMenuItemPress(item)}
          >
            <Ionicons name={item.icon} size={20} color="#fff" style={styles.icon} />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false, // Hide the default header
          swipeEnabled: true, // Enable swipe gestures
          swipeEdgeWidth: 100, // Width of the swipeable area from the left edge
          drawerStyle: {
            backgroundColor: '#121212', // Set drawer background color to black
            width: '80%',
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="index" // Corresponds to app/index.tsx
          options={{
            drawerLabel: "Home",
            title: "Home",
          }}
        />
        <Drawer.Screen
          name="news" // Corresponds to app/news.tsx
          options={{
            drawerLabel: "News",
            title: "News",
          }}
        />
        <Drawer.Screen
          name="marketplace" // Corresponds to app/marketplace.tsx
          options={{
            drawerLabel: "Marketplace",
            title: "Marketplace",
          }}
        />
        <Drawer.Screen
          name="reportsPage" // Corresponds to app/marketplace.tsx
          options={{
            drawerLabel: "ReportsPage",
            title: "ReportsPage",
          }}
        />
        <Drawer.Screen
          name="profile" // Corresponds to app/profile.tsx
          options={{
            drawerLabel: "Profile",
            title: "Profile",
          }}
        />
        <Drawer.Screen
          name="chatbot" // ChatBot
          options={{
            drawerLabel: "ChatBot",
            title: "ChatBot",
          }}
        />
        <Drawer.Screen
          name="logout" // SignOut
          options={{
            drawerLabel: "Logout",
            title: "Logout",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 16,
    width: '80%',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 40, //
  },
  title: {
    color: 'rgba(179, 255, 98, 0.92)',
    fontSize: 28, 
    fontWeight: 'bold', 
    textShadowColor: 'rgba(0, 0, 0, 0.3)', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginLeft: 15, // 
  },
  separator: {
    height: 1, // Thin bar
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    marginBottom: 16,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  activeMenuItem: {
    backgroundColor: '#121212',
  },
  icon: {
    marginRight: 16,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#121212',
    paddingTop: 20,
  },
});