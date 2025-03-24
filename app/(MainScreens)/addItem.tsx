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
  KeyboardTypeOptions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import TopBar from '@/components/TopBar';

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
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  const handleAddPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const validateForm = () => {
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
      !contactNumber ||
      !location ||
      !price ||
      images.length === 0
    ) {
      Alert.alert('Error', 'Please fill in all fields and add at least one photo.');
      return false;
    }

    // Validate year (between 1900 and current year)
    const currentYear = new Date().getFullYear();
    const yearNumber = parseInt(year, 10);
    if (isNaN(yearNumber) || yearNumber < 1900 || yearNumber > currentYear) {
      Alert.alert('Error', `Year must be between 1900 and ${currentYear}`);
      return false;
    }

    // Validate phone number (10 digits)
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(contactNumber)) {
      Alert.alert('Error', 'Contact number must be a valid 10-digit number.');
      return false;
    }

    // Validate price and mileage (positive numbers)
    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Price must be a positive number.');
      return false;
    }
    if (isNaN(Number(mileage)) || Number(mileage) <= 0) {
      Alert.alert('Error', 'Mileage must be a positive number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const db = getFirestore();
    const storage = getStorage();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert('Error', 'User is not logged in.');
      return;
    }

    try {
      // Fetch the user's name from the `users` collection
      const userDocRef = doc(db, 'users', currentUser.uid); // Assuming `uid` is the document ID in the `users` collection
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        Alert.alert('Error', 'User data not found.');
        return;
      }

      const userData = userDocSnap.data();
      const sellerName = userData.name; // Assuming `name` is the field in the `users` collection

      // Upload images to Firebase Storage
      const uploadedImageUrls: string[] = [];
      for (const [index, imageUri] of images.entries()) {
        const response = await fetch(imageUri);
        const blob = await response.blob();

        // Create a unique path for each image in Firebase Storage
        const storageRef = ref(storage, `marketplace/${Date.now()}_${index}`);
        await uploadBytes(storageRef, blob);

        // Get the public URL of the uploaded image
        const downloadUrl = await getDownloadURL(storageRef);
        uploadedImageUrls.push(downloadUrl);
      }

      // Create the new item with the uploaded image URLs and seller name
      const newItem = {
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
        location,
        price,
        imgUrl: uploadedImageUrls, // Use the public URLs of the uploaded images
        date: new Date(), // Add the current date
        seller: sellerName, // Add the seller's name
      };

      // Get the last ID from Firestore
      const marketplaceCollection = collection(db, 'marketplace');
      const q = query(marketplaceCollection, orderBy('id', 'desc'), limit(1));
      const snapshot = await getDocs(q);

      let newId = '00001'; // Default starting ID
      if (!snapshot.empty) {
        const lastItem = snapshot.docs[0].data();
        const lastId = parseInt(lastItem.id, 10);
        newId = String(lastId + 1).padStart(5, '0'); // Increment ID and pad with zeros
      }

      console.log('Generated ID:', newId);

      // Add the new item to Firestore
      await addDoc(marketplaceCollection, { id: newId, ...newItem });

      Alert.alert('Success', 'Item added successfully!');
      router.push('/(drawer_tabs)/(tabs)/marketplace');
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TopBar/>
      <Text style={styles.name}>Add New Item</Text>

      {/* Form Fields */}
      {[
        { placeholder: 'Brand', value: brand, setter: setBrand },
        { placeholder: 'Model', value: model, setter: setModel },
        { placeholder: 'Trim/Edition', value: trim, setter: setTrim },
        { placeholder: 'Year', value: year, setter: setYear, keyboardType: 'numeric' },
        { placeholder: 'Condition', value: condition, setter: setCondition },
        { placeholder: 'Transmission', value: transmission, setter: setTransmission },
        { placeholder: 'Body Type', value: bodyType, setter: setBodyType },
        { placeholder: 'Fuel Type', value: fuelType, setter: setFuelType },
        { placeholder: 'Engine Capacity', value: capacity, setter: setCapacity },
        { placeholder: 'Mileage', value: mileage, setter: setMileage, keyboardType: 'numeric' },
        { placeholder: 'Contact Number', value: contactNumber, setter: setContactNumber, keyboardType: 'phone-pad' },
        { placeholder: 'Location', value: location, setter: setLocation },
        { placeholder: 'Price', value: price, setter: setPrice, keyboardType: 'numeric' },
      ].map((input, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={input.placeholder}
          placeholderTextColor="#aaa"
          value={input.value}
          onChangeText={input.setter}
          keyboardType={input.keyboardType as KeyboardTypeOptions || 'default'}
        />
      ))}

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
  name: {
    fontSize: 30,
    color: "#C3FF65",
    fontWeight: "bold",
    marginBottom: 0,
    marginTop: -10,
    paddingLeft: 30,
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