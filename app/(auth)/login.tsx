import React, { useState } from 'react';
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "./../styles/authStyle";

export default function login() {
  const router = useRouter();  

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
 
  const handleLogin = async () => {
    router.push("/(tabs)")
    // Reset previous error
    setError('');
    
    // Validate email and password
    if (!form.email || !form.password) {
      setError('Please enter both email and password');
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

  const handleLogin = async () => {
    // Reset previous error
    setError('');
    
    // Validate email and password
    if (!form.email || !form.password) {
      setError('Please enter both email and password');
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Minimum password length validation
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
  
    try { 
      // Call the login API
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: form.email,
        password: form.password,
      });
  
      // If login is successful, show a success message
      Alert.alert('Success', 'Login successful!');
      console.log('User:', response.data.user);
  
      // Navigate to the next screen
      router.push('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network errors
      if ((error as any).message && (error as any).message.includes('Network Error')) {
        Alert.alert(
          'Connection Error',
          'Could not connect to the server. Please check your connection or try again later.'
        );
      } else {
        // Regular authentication error
        setError('Invalid email or password');
        Alert.alert('Error', 'Invalid email or password');
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        style={{ flex: 1 }}>
      
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          
          <View style={styles.container}>
            <View style={styles.header}>
              
            <Image source={require("../../assets/images/logo.png")}
              style={styles.headerImg}
              resizeMode="contain"/>       
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>
                  Log in 
              </Text>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Email address</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="email-address"
                  onChangeText={email => setForm({ ...form, email })}
                  placeholder="steve@example.com"
                  placeholderTextColor="#6b7280"
                  style={[
                    styles.inputControl,
                    { color: '#fff', borderColor: error ? 'red' : '#C9D3DB' },
                  ]}
                  value={form.email} />
              </View>
              
              <View style={styles.input}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={{ position: 'relative' }}>
                  <TextInput
                    autoCorrect={false}
                    clearButtonMode="while-editing"
                    onChangeText={password => setForm({ ...form, password })}
                    placeholder="********"
                    placeholderTextColor="#6b7280"
                    style={[styles.inputControl, { color: '#fff' }]}
                    secureTextEntry={!showPassword}
                    value={form.password} />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                    <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {error ? (
                <Text style={{ color: 'red', marginTop: 4, marginBottom: 4 }}>
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.formLink}>Forgot password?</Text>
              </TouchableOpacity>

              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleLogin}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Log In</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text style={styles.formFooter}>
                  Don't have an account?{' '}
                  <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
                </Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}