import React, { useState } from 'react';
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "./../styles/authStyle";

// Import Firebase services from your firebase.js file
import { auth, db } from '../../firebaseAuth'; // Update this path to where you saved your firebase.js file
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function signup() {
  const router = useRouter(); 

  const [form, setForm] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    name: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSignUp = async () => {
    if (!validateEmail(form.email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');

    if (!validatePhoneNumber(form.phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      return;
    }
    setPhoneError('');

    if (!form.name.trim()) {
      Alert.alert('Signup Failed', 'Please enter your full name.');
      return;
    }

    setIsLoading(true); // Start loading

    try {
      // Use the auth instance imported from firebase.js
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        form.email, 
        form.password
      );
      
      // Add user data to Firestore
      const user = userCredential.user;
      const userRef = doc(db, "users", user.uid);
      
      await setDoc(userRef, {
        name: form.name.trim(), // Save the name to Firestore
        email: form.email,
        phoneNumber: form.phoneNumber
      });
      
      console.log("User registered successfully!");
      
      // Navigate to the main app screen
      router.push('../(tabs)');
    } catch (error: any) {
      console.error("Error during signup:", error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Signup Failed', 'This email is already in use.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Signup Failed', 'Password is too weak. Please use a stronger password.');
      } else {
        Alert.alert('Signup Failed', 'An error occurred during registration. Please try again.');
      }
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
        }}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={{ marginTop: 10, color: '#ffffff', fontSize: 16 }}>Creating account...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Image source={require("../../assets/images/logo.png")}
                style={styles.headerImg}
                resizeMode="contain"/>              
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>
                  Sign up 
              </Text>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  autoCapitalize="words"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  onChangeText={name => setForm({ ...form, name })}
                  placeholder="John Doe"
                  placeholderTextColor="#6b7280"
                  style={[
                    styles.inputControl,
                    { color: '#fff', borderColor: '#C9D3DB' },
                  ]}
                  value={form.name}
                  editable={!isLoading} // Disable input while loading
                />
              </View>
              
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
                    { color: '#fff', borderColor: emailError ? 'red' : '#C9D3DB' },
                  ]}
                  value={form.email}
                  editable={!isLoading} // Disable input while loading
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
              
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
                    value={form.password}
                    editable={!isLoading} // Disable input while loading
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    disabled={isLoading} // Disable button while loading
                  >
                    <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.input}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                  keyboardType="phone-pad"
                  maxLength={10}
                  onChangeText={phoneNumber => setForm({ ...form, phoneNumber })}
                  placeholder="123-456-7890"
                  placeholderTextColor="#6b7280"
                  style={[
                    styles.inputControl,
                    { color: '#fff', borderColor: phoneError ? 'red' : '#C9D3DB' },
                  ]}
                  value={form.phoneNumber}
                  editable={!isLoading} // Disable input while loading
                />
              </View>
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}

              <View style={styles.formAction}>
                <TouchableOpacity 
                  onPress={handleSignUp} 
                  disabled={isLoading} // Disable button while loading
                >
                  <View style={[
                    styles.btn,
                    isLoading && { opacity: 0.7 } // Dim the button while loading
                  ]}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.btnText}>Sign Up</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={() => router.push("/(auth)/login")}
                disabled={isLoading} // Disable navigation while loading
              >
                <Text style={styles.formFooter}>
                  Already have an account?{' '}
                  <Text style={{ textDecorationLine: 'underline' }}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}