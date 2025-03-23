import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

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
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mapCoordinates, setMapCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);

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

  // Handle date change
  const handleDateChange = (event: any, selected?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selected) {
      setSelectedDate(selected);
      const day = selected.getDate();
      const month = selected.toLocaleString('default', { month: 'long' });
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
      setDate(formattedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
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

  const handleSubmit = () => {
    const newsData = {
      title,
      date,
      author,
      location,
      description,
      imageUri,
      coordinates: mapCoordinates,
    };
    console.log("Submitting news:", newsData);
    
    // Use the router to navigate back to the main news screen
    router.back();
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add News</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Feather name="check" size={24} color="#A020F0" />
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={showDatePickerModal}>
              <View style={styles.datePickerButton}>
                <TextInput
                  style={styles.input}
                  value={date}
                  placeholder="Select date"
                  placeholderTextColor="#666"
                  editable={false}
                />
                <Feather name="calendar" size={20} color="#A020F0" style={styles.dateIcon} />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
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
  },
  textArea: { 
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 10,
    color: 'white',
  },
  datePickerButton: {
    position: 'relative',
  },
  dateIcon: {
    position: 'absolute',
    right: 12,
    top: 10,
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
});