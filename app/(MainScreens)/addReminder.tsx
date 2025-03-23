import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ CHANGED

import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebaseAuth"; 

const AddReminder = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: "", date: "", time: "" });

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
    setErrors((prev) => ({ ...prev, time: "" }));
  };

  const handleSave = async () => {
    let hasError = false;
    const newErrors = { title: "", date: "", time: "" };

    if (!title) {
      newErrors.title = "Title is required.";
      hasError = true;
    }

    if (!date) {
      newErrors.date = "Date is required.";
      hasError = true;
    }

    if (!time) {
      newErrors.time = "Time is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      try {
        // Get the current user's ID
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user?.uid;

        if (!userId) {
          throw new Error("User not authenticated");
        }

        // Prepare reminder data
        const reminderData = {
          title,
          date: date.toISOString().split('T')[0],
          time: time.toLocaleTimeString(),
          description: description.trim() === "" ? "No description" : description.trim(),
          userId, // Associate the reminder with the user's ID
        };

        // Save to Firestore
        const db = getFirestore(app);
        const remindersRef = collection(db, "reminders");
        await addDoc(remindersRef, reminderData);

        console.log("Reminder saved to Firestore!");

        // Navigate to the index in tabs
        router.push("../(tabs)");
      } catch (error) {
        console.error("Error saving reminder:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add Reminder</Text>

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, { borderColor: errors.title ? "red" : "#FFF" }]}
            placeholder="Enter title"
            placeholderTextColor="#777"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
        </View>

        {/* Date Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={[styles.input, { borderColor: errors.date ? "red" : "#FFF" }]}
              placeholder="Select date"
              placeholderTextColor="#777"
              value={date.toISOString().split('T')[0]}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                textColor="#FFF"
              />
            </View>
          )}
          {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
        </View>

        {/* Time Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <TextInput
              style={[styles.input, { borderColor: errors.time ? "red" : "#FFF" }]}
              placeholder="Select time"
              placeholderTextColor="#777"
              value={time.toLocaleTimeString()}
              editable={false}
            />
          </TouchableOpacity>
          {showTimePicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                textColor="#FFF"
              />
            </View>
          )}
          {errors.time ? <Text style={styles.errorText}>{errors.time}</Text> : null}
        </View>

        {/* Description Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Enter description"
            placeholderTextColor="#777"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => router.push("../../other/reminders")} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddReminder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    color: "#C3FF65",
    fontWeight: "bold",
    marginBottom: 30,
    paddingLeft: 30,
  },
  inputContainer: {
    marginBottom: 15,
    paddingHorizontal: 30,
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1E1E1E",
    color: "#FFF",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  datePickerContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#C3FF65",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  cancelText: {
    color: "#C3FF65",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#C3FF65",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  saveText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 8,
  },
});