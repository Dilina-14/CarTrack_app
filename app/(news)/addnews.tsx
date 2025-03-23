import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { db, storage } from "@/firebaseAuth"; 
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

const FORM_STORAGE_KEY = 'add_news_form_data';

const AddNews = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ locationData?: string }>();
  
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
  const [formLoaded, setFormLoaded] = useState(false);
  const [isNewForm, setIsNewForm] = useState(true);

  // Clear all form data in AsyncStorage
  const clearFormData = async () => {
    try {
      await AsyncStorage.removeItem(FORM_STORAGE_KEY);
      console.log('Form data cleared successfully');
    } catch (error: any) {
      console.error('Error clearing form data:', error);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setTitle('');
    setDate(new Date());
    setAuthor('');
    setLocation('');
    setDescription('');
    setImageUri('');
    setMapCoordinates(null);
    setDateError('');
  };

  // Save form data to AsyncStorage (only during location selection)
  const saveFormData = async () => {
    if (!isNewForm) {
      try {
        const formData = {
          title,
          date: date.toISOString(),
          author,
          description,
          imageUri,
        };
        await AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
        console.log('Form data saved successfully');
      } catch (error: any) {
        console.error('Error saving form data:', error);
      }
    }
  };

  // Load form data from AsyncStorage
  const loadFormData = async () => {
    try {
      // If we have location data in params, this means we're returning from location selection
      // Only then should we try to restore the form data
      if (params.locationData) {
        const savedData = await AsyncStorage.getItem(FORM_STORAGE_KEY);
        if (savedData) {
          const formData = JSON.parse(savedData);
          setTitle(formData.title || '');
          setDate(formData.date ? new Date(formData.date) : new Date());
          setAuthor(formData.author || '');
          setDescription(formData.description || '');
          if (formData.imageUri) {
            setImageUri(formData.imageUri);
          }
          setIsNewForm(false);
          console.log('Form data loaded successfully');
        }
      } else {
        // If we're not returning from location selection, clear any existing data
        await clearFormData();
        resetForm();
      }
      setFormLoaded(true);
    } catch (error: any) {
      console.error('Error loading form data:', error);
      setFormLoaded(true);
    }
  };

  // On initial mount
  useEffect(() => {
    // Clear form data immediately
    resetForm();
    // Then attempt to load data only if returning from location selection
    loadFormData();
  }, []);

  // Save form data whenever fields change, but only if we're not in a new form
  useEffect(() => {
    if (formLoaded && !isNewForm) {
      saveFormData();
    }
  }, [title, date, author, description, imageUri, formLoaded, isNewForm]);

  // Parse locationData from params
  useEffect(() => {
    if (params.locationData) {
      try {
        const locationData = JSON.parse(params.locationData as string) as LocationData;
        setLocation(locationData.name);
        setMapCoordinates({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        });
        setIsNewForm(false); // If we have location data, we're in the middle of form editing
      } catch (error: any) {
        console.error("Error parsing location data:", error);
      }
    }
  }, [params.locationData]);

  // Request permissions for accessing media library
  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images!');
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
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        setIsNewForm(false); // Once we start editing, it's no longer a new form
      }
    }
  };

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // For iOS, don't hide the picker automatically

    if (Platform.OS === 'android') {
      setShowDatePicker(false); // For Android, hide the picker
    }

    // Get the current date without time
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if the selected date is before the current date
    if (currentDate < today) {
      setDateError("Please select today or a future date.");
    } else {
      setDate(currentDate);
      setDateError("");
      setIsNewForm(false); // Once we start editing, it's no longer a new form
    }
  };

  const handleSelectLocation = async () => {
    try {
      setIsNewForm(false); // Once we start editing, it's no longer a new form
      
      // Save current form data before navigating
      await saveFormData();
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      // Navigate to SelectLocation screen
      router.push("/selectlocation");
    } catch (error: any) {
      console.error("Error accessing location:", error);
      Alert.alert('Location Error', 'Failed to access location services');
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (uri: string) => {
    if (!uri) return null;
    
    try {
      // For faster debugging, you might want to use a lower quality/resolution image
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Generate a unique filename with timestamp and random string
      const filename = `news_images/${new Date().getTime()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
      const storageRef = ref(storage, filename);
      
      // Upload the image
      await uploadBytes(storageRef, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Image uploaded successfully. URL:", downloadURL);
      
      return downloadURL;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      Alert.alert('Upload Error', `Failed to upload image: ${error?.message || 'Unknown error'}`);
      return null;
    }
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for the news');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description for the news');
      return;
    }

    // Validate date using the validation logic
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (date < today) {
      setDateError("Please select today or a future date.");
      Alert.alert('Invalid Date', 'Please select today or a future date.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload image if one is selected
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
        if (!imageUrl) {
          const continueWithoutImage = await new Promise((resolve) => {
            Alert.alert(
              'Upload Error',
              'Failed to upload image. Do you want to continue without an image?',
              [
                { text: 'No', onPress: () => resolve(false), style: 'cancel' },
                { text: 'Yes', onPress: () => resolve(true) }
              ]
            );
          });
          
          if (!continueWithoutImage) {
            setIsSubmitting(false);
            return;
          }
        }
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
        author: author.trim() || 'Anonymous',
        location: location.trim() || undefined,
        description,
        imageUrl,
        coordinates: mapCoordinates,
        createdAt: new Date().toISOString(),
      };
      
      console.log("Saving news data:", newsData);
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "news"), newsData);
      console.log("Document written with ID: ", docRef.id);
      
      // Clear the saved form data after successful submission
      await clearFormData();
      
      Alert.alert('Success', 'News added successfully!', [
        { text: 'OK', onPress: () => {
          // Navigate to the news list page
          router.push("/news");
        }}
      ]);
    } catch (error: any) {
      console.error("Error adding news:", error);
      Alert.alert('Error', `Failed to add news: ${error?.message || 'Unknown error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
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
              onChangeText={(text) => {
                setTitle(text);
                setIsNewForm(false);
              }}
              placeholder="Enter news title"
              placeholderTextColor="#666"
            />
          </View>

          {/* Date Input */}
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
                  display={Platform.OS === 'ios' ? "spinner" : "default"}
                  onChange={handleDateChange}
                  minimumDate={new Date()} // Prevent selecting past dates
                  textColor={Platform.OS === 'ios' ? "#fff" : undefined}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity
                    style={styles.iosPickerButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.iosPickerButtonText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Author/Organizer</Text>
            <TextInput
              style={styles.input}
              value={author}
              onChangeText={(text) => {
                setAuthor(text);
                setIsNewForm(false);
              }}
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
                onChangeText={(text) => {
                  setLocation(text);
                  setIsNewForm(false);
                }}
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
              onChangeText={(text) => {
                setDescription(text);
                setIsNewForm(false);
              }}
              placeholder="Enter detailed description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
          
          {/* Add some space at the bottom */}
          <View style={{ height: 100 }} />
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
    marginTop: 30,
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
    borderColor: 'transparent',
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
  iosPickerButton: {
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
  },
  iosPickerButtonText: {
    color: '#A020F0',
    fontWeight: 'bold',
    fontSize: 16,
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