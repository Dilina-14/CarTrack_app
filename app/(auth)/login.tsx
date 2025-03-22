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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "./../styles/authStyle";

// Import Firebase services
import { auth } from '../../firebaseAuth'; // Update this path to match your project structure
import { signInWithEmailAndPassword } from "firebase/auth";

export default function login() {
  const router = useRouter();  

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 
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
  
    setIsLoading(true); // Start loading
    
    try { 
      // Use Firebase authentication
      await signInWithEmailAndPassword(auth, form.email, form.password);
  
      // If login is successful, show a success message
      console.log('User logged in successfully');
  
      // Navigate to the next screen
      router.push('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle Firebase authentication errors
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password');
        Alert.alert('Error', 'Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later');
        Alert.alert('Error', 'Too many failed login attempts. Please try again later');
      } else if (error.code === 'auth/network-request-failed') {
        Alert.alert(
          'Connection Error',
          'Could not connect to the server. Please check your connection or try again later.'
        );
      } else {
        // Other authentication errors
        setError('Authentication failed. Please try again.');
        Alert.alert('Error', 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false); // End loading regardless of outcome
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
          <Text style={{ marginTop: 10, color: '#ffffff', fontSize: 16 }}>Logging in...</Text>
        </View>
      )}
      
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
                  value={form.email}
                  editable={!isLoading} // Disable while loading
                />
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
                    value={form.password}
                    editable={!isLoading} // Disable while loading
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    disabled={isLoading} // Disable while loading
                  >
                    <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {error ? (
                <Text style={{ color: 'red', marginTop: 4, marginBottom: 4 }}>
                  {error}
                </Text>
              ) : null}

              <TouchableOpacity onPress={() => {}} disabled={isLoading}>
                <Text style={[styles.formLink, isLoading && { opacity: 0.7 }]}>
                  Forgot password?
                </Text>
              </TouchableOpacity>

              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
                  <View style={[
                    styles.btn,
                    isLoading && { opacity: 0.7 } // Dim the button while loading
                  ]}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.btnText}>Log In</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                onPress={() => router.push("/(auth)/signup")}
                disabled={isLoading}
              >
                <Text style={[styles.formFooter, isLoading && { opacity: 0.7 }]}>
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