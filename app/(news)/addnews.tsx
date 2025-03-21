import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";


const addnews = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [author, setAuthor] = useState('');
  const [distance, setDistance] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');

  const handleAddImage = () => {
    setImageUri('https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60');
  };

  const handleSubmit = () => {
    navigation.goBack();
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
          <TouchableOpacity style={styles.imageUpload} onPress={handleAddImage}>
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
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="Enter date (e.g., 14th of November)"
              placeholderTextColor="#666"
            />
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
            <Text style={styles.label}>Distance (optional)</Text>
            <TextInput
              style={styles.input}
              value={distance}
              onChangeText={setDistance}
              placeholder="Enter distance (e.g., 235 km)"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
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

export default addnews;

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
});