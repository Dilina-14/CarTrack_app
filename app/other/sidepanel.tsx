import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { router } from 'expo-router';

type MenuItem = {
  id: string;
  icon: string;
  label: string;
  screen: string;
};

const SidePanel = () => {
  const [activeItem, setActiveItem] = useState('news');

  const menuItems: MenuItem[] = [
    { id: 'vehicle', icon: 'car', label: 'Vehicle Tools Reports', screen: '/other/reports'},
    { id: 'news', icon: 'newspaper', label: 'News', screen: '/news' },
    { id: 'shop', icon: 'cart', label: 'Shop', screen: '/shop' },
    { id: 'embassy', icon: 'briefcase', label: 'Embassy', screen: '/embassy' },
    { id: 'graphs', icon: 'stats-chart', label: 'Graphs', screen: '/graphs' },
    { id: 'chatbot', icon: 'chatbubble', label: 'ChatBot', screen: '/chatbot' },
    { id: 'legal', icon: 'help-circle', label: 'Legal Support', screen: '/legal' },
    { id: 'signout', icon: 'log-out', label: 'SignOut', screen: '/signout' },
  ];

  const handleMenuItemPress = (item: MenuItem) => {
    setActiveItem(item.id);
    if (item.screen) {
      router.push(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
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

            {item.id === 'news' && (
              <View style={styles.videoIcon}>
                <Ionicons name="videocam" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = {
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
  footer: {
    position: 'absolute',
    bottom: 64,
    left: 16,
    right: 16,
  },
  footerText: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
};

export default SidePanel;