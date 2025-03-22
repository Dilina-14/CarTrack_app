import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

// Custom Drawer Content
import { DrawerContentComponentProps } from "@react-navigation/drawer";

import { ComponentProps } from 'react';

type MenuItem = {
  id: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  screen: string;
};

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const [activeItem, setActiveItem] = useState('index');

  const menuItems: MenuItem[] = [
    { id: 'index', icon: 'home', label: 'Home', screen: '/' },
    { id: 'news', icon: 'newspaper', label: 'News', screen: '/news' },
    { id: 'marketplace', icon: 'cart', label: 'Marketplace', screen: '/marketplace' },
    { id: 'profile', icon: 'person', label: 'Profile', screen: '/profile' },
    { id: 'chatbot', icon: 'chatbubble', label: 'ChatBot', screen: '/chatbot' },
  ];

  const handleMenuItemPress = (item: MenuItem) => {
    setActiveItem(item.id);
    if (item.screen) {
      router.push(item.screen as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
      </View>

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
          headerShown: false, // Hide the header
          swipeEnabled: true, // Enable swipe gestures
          swipeEdgeWidth: 100, // Width of the swipeable area from the left edge
          drawerStyle: {
            backgroundColor: colors.black, // Set drawer background color to black
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
          name="signout" // SignOut
          options={{
            drawerLabel: "SignOut",
            title: "SignOut",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
    padding: 16,
    width: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activeMenuItem: {
    backgroundColor: '#333',
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    color: '#fff',
    flex: 1,
  },
  videoIcon: {
    backgroundColor: '#674ea7',
    padding: 8,
    borderRadius: 8,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  drawerLabel: {
    color: "#FFF",
    fontSize: 16,
    marginVertical: 15,
  },
});