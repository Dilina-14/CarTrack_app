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
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "./../styles/authStyle";

export default function signup() {
  const router = useRouter(); 

  const [form, setForm] = useState({
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

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

    try {
      const response = await axios.post('https://your-backend-server.com/signup', {
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
      });

      if (response.data.success) {
        // Navigate to the main app screen
        router.push('/main');
      } else {
        Alert.alert('Signup Failed', response.data.message);
      }
    } catch (error) {
      Alert.alert('Signup Failed', 'An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
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
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
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
                />
              </View>
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}

              <View style={styles.formAction}>
                <TouchableOpacity onPress={handleSignUp}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Sign Up</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
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

