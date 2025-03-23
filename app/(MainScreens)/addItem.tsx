import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref, set, get, child } from 'firebase/database'; // For Firebase Realtime Database
import { useRouter } from 'expo-router';

const AddItem = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [year, setYear] = useState('');
  const [condition, setCondition] = useState('');
  const [transmission, setTransmission] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [mileage, setMileage] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  const handleAddPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Use correct MediaTypeOptions
        allowsEditing: true,
        quality: 1,
      });
      
    

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (
      !brand ||
      !model ||
      !trim ||
      !year ||
      !condition ||
      !transmission ||
      !bodyType ||
      !fuelType ||
      !capacity ||
      !mileage ||
      !contactNumber || // Ensure phoneNumber is filled
      images.length === 0
    ) {
      Alert.alert('Error', 'Please fill in all fields and add at least one photo.');
      return;
    }

    try {
      const db = getDatabase();
      const dbRef = ref(db);

      // Get the last ID from Firebase
      const snapshot = await get(child(dbRef, 'marketplace'));
      let newId = '00002'; // Default starting ID
      if (snapshot.exists()) {
        const items = snapshot.val();
        const ids = Object.keys(items).map((id) => parseInt(id, 10));
        const maxId = Math.max(...ids);
        newId = String(maxId + 1).padStart(5, '0'); // Increment ID and pad with zeros
      }

      // Add the new item to Firebase
      const newItem = {
        id: newId,
        brand,
        model,
        trim,
        year,
        condition,
        transmission,
        bodyType,
        fuelType,
        capacity,
        mileage,
        contactNumber, 
        imgUrl: images,
      };

      await set(ref(db, `marketplace/${newId}`), newItem);

      Alert.alert('Success', 'Item added successfully!');
      router.push('/(tabs)/marketplace'); // Navigate back to the marketplace
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add New Item</Text>

      {/* Form Fields */}
      <TextInput
        style={styles.input}
        placeholder="Brand"
        placeholderTextColor="#aaa"
        value={brand}
        onChangeText={setBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Model"
        placeholderTextColor="#aaa"
        value={model}
        onChangeText={setModel}
      />
      <TextInput
        style={styles.input}
        placeholder="Trim/ Edition"
        placeholderTextColor="#aaa"
        value={trim}
        onChangeText={setTrim}
      />
      <TextInput
        style={styles.input}
        placeholder="Year"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        style={styles.input}
        placeholder="Condition"
        placeholderTextColor="#aaa"
        value={condition}
        onChangeText={setCondition}
      />
      <TextInput
        style={styles.input}
        placeholder="Transmission"
        placeholderTextColor="#aaa"
        value={transmission}
        onChangeText={setTransmission}
      />
      <TextInput
        style={styles.input}
        placeholder="Body Type"
        placeholderTextColor="#aaa"
        value={bodyType}
        onChangeText={setBodyType}
      />
      <TextInput
        style={styles.input}
        placeholder="Fuel Type"
        placeholderTextColor="#aaa"
        value={fuelType}
        onChangeText={setFuelType}
      />
      <TextInput
        style={styles.input}
        placeholder="Engine Capacity"
        placeholderTextColor="#aaa"
        value={capacity}
        onChangeText={setCapacity}
      />
      <TextInput
        style={styles.input}
        placeholder="Mileage"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        value={mileage}
        onChangeText={setMileage}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={contactNumber}
        onChangeText={setContactNumber}
      />

      {/* Add Photo */}
      <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
        <Text style={styles.addPhotoText}>Add Photo +</Text>
      </TouchableOpacity>
      <ScrollView horizontal>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.imagePreview} />
        ))}
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  addPhotoButton: {
    backgroundColor: '#45B1FF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  addPhotoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#C6FF66',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddItem;