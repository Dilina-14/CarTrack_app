import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { app } from "../../firebaseAuth";

type Reminder = {
  id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  description?: string;
};

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }
      
      const db = getFirestore(app);
      const remindersRef = collection(db, "reminders");
      const q = query(remindersRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const remindersList: Reminder[] = [];
      querySnapshot.forEach((doc) => {
        remindersList.push({
          id: doc.id,
          ...doc.data()
        } as Reminder);
      });

      remindersList.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      setReminders(remindersList);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "reminders", id));
      
      setReminders(reminders.filter(reminder => reminder.id !== id));
    } catch (error) {
      console.error("Error deleting reminder:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.push('../../(tabs)')}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>Reminders</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C3FF65" />
          </View>
        ) : (
          <ScrollView style={styles.remindersList}>
            {reminders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No reminders found</Text>
                <Text style={styles.emptySubText}>Add a reminder to get started</Text>
              </View>
            ) : (
              reminders.map((item) => (
                <View key={item.id} style={styles.reminderItem}>
                  <View style={styles.reminderContent}>
                    <View style={styles.bellIconContainer}>
                      <Ionicons name="notifications-outline" size={30} color="#fff" />
                    </View>
                    <View style={styles.reminderTextContainer}>
                      <Text style={styles.reminderTitle}>{item.title}</Text>
                      <Text style={styles.reminderDate}>Date - {formatDate(item.date)}</Text>
                      <Text style={styles.reminderTime}>Time - {item.time}</Text>
                      {item.description && item.description !== "No description" && (
                        <Text style={styles.reminderDescription}>{item.description}</Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.trashButton}
                    onPress={() => handleDeleteReminder(item.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        )}

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push('../(MainScreens)/addReminder')}
        >
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
    color: '#FF9D42',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: 'Poppins_700Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#AAA',
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
  reminderTime: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  reminderDescription: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 4,
    fontStyle: 'italic',
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