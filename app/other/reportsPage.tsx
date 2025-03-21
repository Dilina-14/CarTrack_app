import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { Funnel, MagnifyingGlass } from "phosphor-react-native";
import { colors } from '@/constants/theme';
import { useRouter } from "expo-router";



const reportsPage = () => {

  const router = useRouter();
  // Data for reminders matching the image
  const reminders = [
    {
      id: '1',
      title: 'Honda Vezel',
      date: '20/10/2024',
    },
    {
      id: '2',
      title: 'bugatti chiron',
      date: '01/10/2025',
    },
    {
      id: '3',
      title: 'mazda 6',
      date: '01/10/2025',
    },
  ];

  
  const navigation = useNavigation();

  // SearchBar Component


  
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
        </View>

        {/* Reminders Title */}
        <Text style={styles.header}>Vehicle Model Reports</Text>

        
      <View style={styles.searchBarContainer}>
        <TouchableOpacity style={styles.filterButton}>
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


        {/* List of Reminders */}
        <ScrollView style={styles.remindersList}  >
          {reminders.map((item) => (
            <View key={item.id} style={styles.reminderItem}  >
              <TouchableOpacity  style={styles.reminderContent} onPress={() => router.push("/other/reports")}>
                <View style={styles.bellIconContainer}>
                  <Ionicons name="document-outline" size={30} color="#fff" />
                </View>
                <View style={styles.reminderTextContainer}>
                  <Text style={styles.reminderTitle}>{item.title}</Text>
                  <Text style={styles.reminderDate}>Uploaded Datee - {item.date}</Text>
                </View>
              </TouchableOpacity >
              <TouchableOpacity style={styles.trashButton}>
                <Ionicons name="heart-outline" size={20} color="#fff" />
                <Text style={styles.heartCount}>69</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
    marginTop: 20
  },
  reminderItem: {
    backgroundColor: '#0c0c0c',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    height:80,
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
});