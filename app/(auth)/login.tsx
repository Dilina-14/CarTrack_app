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
<<<<<<< Updated upstream
=======
 
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
>>>>>>> Stashed changes

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://your-backend-server.com/login', {
        email: form.email,
        password: form.password,
      });

      if (response.data.success) {
        // Navigate to the main app screen
        router.push('./main');
      } else {
        setError('The email or password that you entered is incorrect');
      }
    } catch (error) {
      setError('The email or password that you entered is incorrect');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
      
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          
          <View style={styles.container}>
            <View style={styles.header}>
              
            <Image source={require("../../assets/images/logo.png")}
              style={styles.headerImg}
              resizeMode="contain"/>

            <Text style={styles.title}>
                Log in to <Text style={{ color: '#C3FF65' }}>CarTrack</Text>
            </Text>
            
            <Text style={styles.subtitle}>
              One Stop for All Your Car Needs
            </Text>

            </View>

            <View style={styles.formContainer}>
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

              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.formLink}>Forgot password?</Text>
              </TouchableOpacity>
              <Text>/n</Text>
              
              <View style={styles.formAction}>
                <TouchableOpacity
                  onPress={handleLogin}>
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
