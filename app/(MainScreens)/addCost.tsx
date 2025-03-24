import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ CHANGED

import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../../firebaseAuth"; 

const AddCost = () => {
  const [category, setCategory] = useState("Fuel");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateBorderColor, setDateBorderColor] = useState("#FFF");
  const [amountBorderColor, setAmountBorderColor] = useState("#FFF");
  const [noteBorderColor, setNoteBorderColor] = useState("#FFF");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState(""); // ✅ CHANGED (Added state for note)
  const [errors, setErrors] = useState({ date: "", amount: "" });

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setErrors((prev) => ({ ...prev, date: "" }));
  };

  const handleSave = async () => {
    let hasError = false;
    const newErrors = { date: "", amount: "" };
  
    if (!date) {
      newErrors.date = "Date is required.";
      setDateBorderColor("red");
      hasError = true;
    }
  
    if (!amount) {
      newErrors.amount = "Amount is required.";
      setAmountBorderColor("red");
      hasError = true;
    }
  
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Enter a valid amount.";
      setAmountBorderColor("red");
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
  
        // Prepare expense data
        const expenseData = {
          category,
          date: date.toISOString().split('T')[0],
          amount: parseFloat(amount),
          note: note.trim() === "" ? "No description" : note.trim(),
          userId, // Associate the expense with the user's ID
        };
  
        // Save to Firestore
        const db = getFirestore(app);
        const expensesRef = collection(db, "expenses");
        await addDoc(expensesRef, expenseData);
  
        console.log("Expense saved to Firestore!");
  
        // Navigate to the index in tabs
        router.push("../(tabs)");
      } catch (error) {
        console.error("Error saving expense:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add Cost</Text>

        {/* Date Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={[styles.input, { borderColor: dateBorderColor }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#777"
              value={date.toISOString().split('T')[0]}
              editable={false}
              onFocus={() => setDateBorderColor("#C3FF65")}
              onBlur={() => setDateBorderColor(errors.date ? "red" : "#FFF")}
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

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, { borderColor: amountBorderColor }]}
            placeholder="Enter amount"
            placeholderTextColor="#777"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              setErrors((prev) => ({ ...prev, amount: "" }));
            }}
            onFocus={() => setAmountBorderColor("#C3FF65")}
            onBlur={() => setAmountBorderColor(errors.amount ? "red" : "#FFF")}
          />
          {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
        </View>

        {/* Category Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={[styles.input, { borderColor: '#FFF' }, { padding: 0 }]}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={{ height: 55, color: "#FFF", borderRadius: 20 }}
              dropdownIconColor="#FFF"
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Fuel (Default)" value="Fuel" />
              <Picker.Item label="Maintenance" value="Maintenance" />
              <Picker.Item label="Insurance" value="Insurance" />
              <Picker.Item label="Repair" value="Repair" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {/* Note Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, { borderColor: noteBorderColor }]}
            placeholder="Enter note"
            placeholderTextColor="#777"
            multiline
            value={note}
            onChangeText={setNote}
            onFocus={() => setNoteBorderColor("#C3FF65")}
            onBlur={() => setNoteBorderColor("#FFF")}
          />
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => router.push("../(tabs)")} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddCost;

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
  pickerItem: {
    backgroundColor: "#1E1E1E",
    color: "#1E1E1E",
    borderRadius: 25,
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
