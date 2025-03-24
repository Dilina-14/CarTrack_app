import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { router } from "expo-router";

const ToyotaYarisScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>


        <Text style={styles.header}>Vehicle Model Reports</Text>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.vehicleTitle}>Toyota Yaris</Text>

          <Text style={styles.sectionTitle}>Description:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Brand: Toyota</Text>
            <Text style={styles.bulletItem}>• Model: Yaris</Text>
            <Text style={styles.bulletItem}>• Trim / Edition: XLE</Text>
            <Text style={styles.bulletItem}>• Year of Manufacture: 2020</Text>
            <Text style={styles.bulletItem}>• Condition: New</Text>
            <Text style={styles.bulletItem}>• Transmission: Automatic</Text>
            <Text style={styles.bulletItem}>• Body Type: Sedan</Text>
            <Text style={styles.bulletItem}>• Fuel Type: Gasoline</Text>
            <Text style={styles.bulletItem}>• Engine Capacity: 1,800 cc</Text>
          </View>

          <Text style={styles.sectionTitle}>Vehicle Features:</Text>
          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraphText}>
              • The 2020 Toyota Yaris XLE features a 1.8L 4-cylinder engine, offering a balance of power and efficiency.
            </Text>
            <Text style={styles.paragraphText}>
              • Fuel Efficiency: The vehicle averages 14-18 km/l, depending on driving conditions.
            </Text>
            <Text style={styles.paragraphText}>
              • Transmission: The Yaris comes with an automatic transmission for smooth gear changes.
            </Text>
            <Text style={styles.paragraphText}>
              • Safety: The vehicle has multiple safety features such as 6 Airbags, ABS, and Stability Control.
            </Text>
            <Text style={styles.paragraphText}>
              • Interior: The Yaris offers a comfortable interior with touchscreen infotainment.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    fontSize: 24,
    color: '#C3FF65',
    paddingHorizontal: 20,
    marginTop: 10,
    fontFamily: 'monospace',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  vehicleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  paragraphContainer: {
    marginLeft: 8,
  },
  paragraphText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 12,
  },
});

export default ToyotaYarisScreen;