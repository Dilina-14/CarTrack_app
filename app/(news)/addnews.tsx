import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { db, storage } from "@/firebaseAuth"; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

const AddNews = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams<{ locationData?: string }>(); // Retrieve locationData from params
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState("");

  // Parse locationData from params
  useEffect(() => {
    if (params.locationData) {
      try {
        const locationData = JSON.parse(params.locationData) as LocationData;
        setLocation(locationData.name);
        setMapCoordinates({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });
      } catch (error) {
        console.error("Error parsing location data:", error);
      }
    }
  }, [params.locationData]);

  // Request permissions for accessing media library
  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload images!');
        return false;
      }
      return true;
    }
    return true;
  };

  // Handle image picking from gallery
  const handlePickImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    
    if (hasPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    }
  };

  // Handle date change - implementing from AddReminders.tsx
  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);

    // Get the current date without time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if the selected date is before the current date
    if (currentDate < today) {
      setDateError("Please select today or a future date.");
    } else {
      setDate(currentDate);
      setDateError("");
    }
  };

  const handleSelectLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      // Navigate to SelectLocation screen
      router.push({
        pathname: "/(news)/selectlocation",
      });
    } catch (error) {
      console.error("Error accessing location:", error);
      alert('Failed to access location services');
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (uri: string) => {
    if (!uri) return null;
    
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const filename = `news_images/${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('Please enter a title for the news');
      return;
    }

    // Validate date using the new validation logic
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (date < today) {
      setDateError("Please select today or a future date.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload image if one is selected
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }
      
      // Format date for display
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const getOrdinalSuffix = (d: number) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      const formattedDate = `${day}${getOrdinalSuffix(day)} of ${month}`;
      
      // Create news object
      const newsData = {
        title,
        date: formattedDate,
        author,
        location,
        description,
        imageUrl,
        coordinates: mapCoordinates,
        createdAt: new Date().toISOString(),
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "news"), newsData);
      console.log("Document written with ID: ", docRef.id);
      
      alert('News added successfully!');
      
      // Navigate back
      router.back();
    } catch (error) {
      console.error("Error adding news:", error);
      alert('Failed to add news. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add News</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting}>
            <Feather name="check" size={24} color={isSubmitting ? "#666" : "#A020F0"} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form}>
          <TouchableOpacity style={styles.imageUpload} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Feather name="image" size={40} color="#A020F0" />
                <Text style={styles.uploadText}>Add Cover Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter news title"
              placeholderTextColor="#666"
            />
          </View>

          {/* Date Input - Implemented from AddReminders.tsx */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={[styles.input, { borderColor: dateError ? "red" : "transparent" }]}
                placeholder="Select date"
                placeholderTextColor="#666"
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
                  minimumDate={new Date()} // Prevent selecting past dates
                  textColor={Platform.OS === 'ios' ? "#fff" : undefined}
                />
              </View>
            )}
            {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Author/Organizer</Text>
            <TextInput
              style={styles.input}
              value={author}
              onChangeText={setAuthor}
              placeholder="Enter author or organizer name"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location (Venue) <Text style={styles.optionalText}>(optional)</Text></Text>
            <View style={styles.locationContainer}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter venue location or select from map"
                placeholderTextColor="#666"
              />
              <TouchableOpacity style={styles.mapButton} onPress={handleSelectLocation}>
                <Feather name="map-pin" size={20} color="white" />
              </TouchableOpacity>
            </View>
            {mapCoordinates && (
              <Text style={styles.coordinatesText}>
                Location selected from map
              </Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]} 
              value={description}
              onChangeText={setDescription}
              placeholder="Enter detailed description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default AddNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  imageUpload: {
    width: '100%',
    height: 200,
    backgroundColor: '#111',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: 'white',
    marginTop: 8,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: 'white',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  optionalText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#121212',
    padding: 10,
    borderRadius: 5,
    color: 'white',
    borderWidth: 1,
  },
  textArea: { 
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 10,
    color: 'white',
  },
  datePickerContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  mapButton: {
    backgroundColor: '#A020F0',
    padding: 11.5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordinatesText: {
    color: '#A020F0',
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 8,
  },
});