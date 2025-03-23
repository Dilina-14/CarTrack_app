import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { Funnel, MagnifyingGlass } from "phosphor-react-native";
import { colors } from '@/constants/theme';
import { useRouter } from "expo-router";

const reportsPage = () => {
  const router = useRouter();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [reminders, setReminders] = useState([
    { id: '1', title: 'Honda Vezel', date: '20/10/2024' },
    { id: '2', title: 'Bugatti Chiron', date: '01/10/2025' },
    { id: '3', title: 'Mazda 6', date: '01/10/2025' },
  ]);
  const [filteredReminders, setFilteredReminders] = useState(reminders);

  const navigation = useNavigation();

  // Filter modal component
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
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => a.title.localeCompare(b.title)));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Sort by Name (A-Z)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => b.title.localeCompare(a.title)));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Sort by Name (Z-A)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
                const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
                return dateA - dateB;
              }));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Oldest First</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterOptionButton}
            onPress={() => {
              setFilteredReminders([...reminders].sort((a, b) => {
                const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
                const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
                return dateB - dateA;
              }));
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.filterOptionText}>Newest First</Text>
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
        <Text style={styles.header}>Vehicle Model Reports</Text>

        <View style={styles.searchBarContainer}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
            <Funnel size={24} color="white" weight="bold" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              placeholderTextColor="gray"
              style={styles.input}
            />
            <MagnifyingGlass size={20} color="black" />
          </View>
        </View>

        <ScrollView style={styles.remindersList}>
          {filteredReminders.map((item) => (
            <View key={item.id} style={styles.reminderItem}>
              <TouchableOpacity style={styles.reminderContent} onPress={() => router.push("/other/reports")}>
                <View style={styles.bellIconContainer}>
                  <Ionicons name="document-outline" size={30} color="#fff" />
                </View>
                <View style={styles.reminderTextContainer}>
                  <Text style={styles.reminderTitle}>{item.title}</Text>
                  <Text style={styles.reminderDate}>Uploaded Date - {item.date}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.trashButton}>
                <Ionicons name="heart-outline" size={20} color="#fff" />
                <Text style={styles.heartCount}>69</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <FilterModal />
      </View>
    </ScreenWrapper>
  );
};

export default reportsPage;

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
    fontSize: 24,
    color: '#C3FF65',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  remindersList: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  reminderItem: {
    backgroundColor: '#0c0c0c',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  reminderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  bellIconContainer: {
    backgroundColor: '#1570EF',
    padding: 16,
    borderRadius: 8.58,
    marginRight: 12,
  },
  reminderTextContainer: {
    paddingVertical: 15,
    flex: 1,
  },
  heartCount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryDark,
    padding: 10,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#222",
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    color: '#C3FF65', // Updated to match LegalSupportScreen
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterOptionButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Updated to match LegalSupportScreen
  },
  filterOptionText: {
    fontSize: 16,
    color: '#fff', // Updated to match LegalSupportScreen
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#333', // Updated to match LegalSupportScreen
    padding: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff', // Updated to match LegalSupportScreen
    fontWeight: '600',
  },
});