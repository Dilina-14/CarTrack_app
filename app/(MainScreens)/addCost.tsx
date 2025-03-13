import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';

const AddCost = () => {
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateBorderColor, setDateBorderColor] = useState("#FFF");
  const [amountBorderColor, setAmountBorderColor] = useState("#FFF");
  const [noteBorderColor, setNoteBorderColor] = useState("#FFF");

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
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
              onBlur={() => setDateBorderColor("#FFF")}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                textColor="#FFF" // Set text color to white
              />
            </View>
          )}
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, { borderColor: amountBorderColor }]}
            placeholder="Enter amount"
            placeholderTextColor="#777"
            keyboardType="numeric"
            onFocus={() => setAmountBorderColor("#C3FF65")}
            onBlur={() => setAmountBorderColor("#FFF")}
          />
        </View>

        {/* Category Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={[styles.input, {borderColor: '#FFF'},{ padding: 0 }]}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={{ height: 55, color: "#FFF" ,borderRadius: 20,}}
              dropdownIconColor="#FFF"
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Fuel (Default)" value="fuel"  />
              <Picker.Item label="Maintenance" value="maintenance" />
              <Picker.Item label="Insurance" value="insurance" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>
        </View>

        {/* Note Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, { borderColor: noteBorderColor, }]} // Increased height
            placeholder="Enter note"
            placeholderTextColor="#777"
            multiline
            onFocus={() => setNoteBorderColor("#C3FF65")}
            onBlur={() => setNoteBorderColor("#FFF")}
          />
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
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
    borderWidth: 1,
    borderColor: "#121212",
    backgroundColor: "#121212",
    marginLeft: 25,
    marginRight: 25,
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
});
