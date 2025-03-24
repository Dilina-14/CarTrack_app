import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { router } from "expo-router";

const VehicleInfoScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                  </TouchableOpacity>


        <Text style={styles.header}>Vehicle Model Reports</Text>
        

        {/* Main content */}
        <ScrollView style={styles.scrollView}>
          <Text style={styles.vehicleTitle}>Honda Vezel</Text>

          <Text style={styles.sectionTitle}>Description:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Brand: Honda</Text>
            <Text style={styles.bulletItem}>• Model: Vezel</Text>
            <Text style={styles.bulletItem}>• Trim / Edition: Z Grade / RS Sensing</Text>
            <Text style={styles.bulletItem}>• Year of Manufacture: 2015-2019</Text>
            <Text style={styles.bulletItem}>• Condition: Used</Text>
            <Text style={styles.bulletItem}>• Transmission: Automatic</Text>
            <Text style={styles.bulletItem}>• Body Type: Station Wagon</Text>
            <Text style={styles.bulletItem}>• Fuel Type: Hybrid</Text>
            <Text style={styles.bulletItem}>• Engine Capacity: 1,500 cc</Text>
          </View>

          <Text style={styles.sectionTitle}>Vehicle Features:</Text>
          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraphText}>
              • The 2016 Honda Vezel RS Sensing features a 1.5L 4-cylinder hybrid engine, offering a good balance of
              power and efficiency while also benefiting from the hybrid system for better economy.
            </Text>
            <Text style={styles.paragraphText}>
              • Fuel Efficiency: The vehicle averages 15-22 km/l, depending
              on driving conditions, which is typical for a hybrid vehicle
              and gives it excellent range on fuel costs.
            </Text>
            <Text style={styles.paragraphText}>
              • Transmission: The Vezel comes with an automatic
              transmission that provides smooth gear changes and a
              comfortable driving experience.
            </Text>
            <Text style={styles.paragraphText}>
              • Safety: The vehicle has multiple safety features such
              as 7 Airbags, Anti-lock Braking System (ABS), and Stability
              Control for safer driving.
            </Text>
            <Text style={styles.paragraphText}>
              • Interior: The Vezel offers a spacious interior with
              comfortable seating for 5 adults, dual-zone climate control,
              along with a premium-feel overall design.
            </Text>
            <Text style={styles.paragraphText}>
              • Price Range (Used Honda Vezel in 2016 - 2019): typically
              costs...
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
  menuButton: {
    padding: 8,
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

export default VehicleInfoScreen;