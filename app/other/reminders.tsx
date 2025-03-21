import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Reminders = () => {
  // Data for reminders matching the image
  const reminders = [
    {
      id: '1',
      title: 'Check Brake Fluid',
      date: '18/11/2024',
    },
    {
      id: '2',
      title: 'Get License',
      date: '01/10/2025',
    },
    {
      id: '3',
      title: 'Check Coolant status before trip',
      date: '01/10/2025',
    },
  ];
  const navigation = useNavigation();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header with back button */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Reminders Title */}
        <Text style={styles.header}>Reminders</Text>

        {/* List of Reminders */}
        <ScrollView style={styles.remindersList}>
          {reminders.map((item) => (
            <View key={item.id} style={styles.reminderItem}>
              <View style={styles.reminderContent}>
                <View style={styles.bellIconContainer}>
                  <Ionicons name="notifications-outline" size={30} color="#fff" />
                </View>
                <View style={styles.reminderTextContainer}>
                  <Text style={styles.reminderTitle}>{item.title}</Text>
                  <Text style={styles.reminderDate}>Reminder Date - {item.date}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.trashButton}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Add Reminder Button */}
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default Reminders;

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
    fontSize: 32,
    color: '#C3FF65',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  remindersList: {
    paddingHorizontal: 20,
  },
  reminderItem: {
    backgroundColor: '#000000',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bellIconContainer: {
    backgroundColor: '#FF9D42',
    padding: 16,
    borderRadius: 9,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 12,
  },
  reminderTextContainer: {
    paddingVertical: 15,
    flex: 1,
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
  trashButton: {
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#FF9D42',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 35,
  },
});