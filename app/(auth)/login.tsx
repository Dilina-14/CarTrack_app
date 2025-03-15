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
 {/*
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
  */}
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

              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.formLink}>Forgot password?</Text>
              </TouchableOpacity>

             
              {/*
              <View style={styles.formAction}>
                <TouchableOpacity
                  onPress={handleLogin}>
                  <View style={styles.btn}>
                    <Text style={styles.btnText}>Log In</Text>
                  </View>
                </TouchableOpacity>
              </View>*/}
              <View style={styles.formAction}>
                <TouchableOpacity onPress={() => router.push("/(tabs)")}>
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
