import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

const SelectLocation = () => {
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 6.9271, // Default coordinates (Sri Lanka)
    longitude: 79.8612,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerPosition, setMarkerPosition] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setMarkerPosition({ latitude, longitude });

        // Get location name from coordinates
        const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          const nameComponents = [
            address.name,
            address.street,
            address.district,
            address.city,
          ].filter(Boolean);
          setLocationName(nameComponents.join(', '));
        }
      } catch (error: any) {
        console.error("Error getting location:", error);
        Alert.alert('Location Error', 'Could not get your current location.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleMapPress = (e: any) => {
    const { coordinate } = e.nativeEvent;
    setMarkerPosition(coordinate);

    // Get location name from new coordinates
    (async () => {
      try {
        const addresses = await Location.reverseGeocodeAsync(coordinate);
        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          const nameComponents = [
            address.name,
            address.street,
            address.district,
            address.city,
          ].filter(Boolean);
          setLocationName(nameComponents.join(', '));
        }
      } catch (error: any) {
        console.error("Error getting address:", error);
      }
    })();
  };

  const handleConfirm = () => {
    if (!markerPosition) {
      Alert.alert('Selection Required', 'Please select a location on the map');
      return;
    }

    // Navigate back to addnews with location data
    const locationData: LocationData = {
      name: locationName || 'Selected Location',
      latitude: markerPosition.latitude,
      longitude: markerPosition.longitude,
    };

    router.push({
      pathname: "/addnews",
      params: {
        locationData: JSON.stringify(locationData),
      }
    });
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={locationName}
            onChangeText={setLocationName}
            placeholder="Enter location name"
            placeholderTextColor="#666"
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A020F0" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            region={region}
            onPress={handleMapPress}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {markerPosition && (
              <Marker
                coordinate={markerPosition}
                pinColor="#A020F0"
                title={locationName || "Selected Location"}
              />
            )}
          </MapView>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tap on the map to select your location
          </Text>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default SelectLocation;

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
    marginTop: 30,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#A020F0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  confirmText: {
    color: 'white',
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: '#121212',
    padding: 10,
    borderRadius: 5,
    color: 'white',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
  },
});