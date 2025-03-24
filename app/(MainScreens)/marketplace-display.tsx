import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Linking,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Define interfaces for our data
interface VehicleData {
  name: string;
  seller: string;
  price: string;
  distance: string;
  brand: string;
  model: string;
  trim: string;
  year: string;
  condition: string;
  transmission: string;
  bodyType: string;
  fuelType: string;
  engineCapacity: string;
  mileage: string;
  isVerified: boolean;
  contactNumber: string;
  images: string[]; // Array of image URLs
}

const MarketplaceDisplay = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Retrieve the custom `id` field from the route params
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch vehicle data from Firestore
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data for custom ID:", id);

        const db = getFirestore();
        const marketplaceCollection = collection(db, "marketplace");

        // Query Firestore for the document with the custom `id` field
        const q = query(marketplaceCollection, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0]; // Get the first matching document
          const data = doc.data();
          console.log("Document Data:", data);

          setVehicleData({
            name: `${data.brand} ${data.model} - ${data.year}`,
            seller: data.seller || "Unknown Seller", // Dynamically set the seller's name
            price: `Rs ${data.price}`,
            distance: `${data.mileage} km`,
            brand: data.brand,
            model: data.model,
            trim: data.trim,
            year: data.year,
            condition: data.condition,
            transmission: data.transmission,
            bodyType: data.bodyType,
            fuelType: data.fuelType,
            engineCapacity: data.capacity,
            mileage: `${data.mileage} km`,
            isVerified: data.verified || false,
            contactNumber: data.contactNumber,
            images: data.imgUrl || [], // Array of image URLs
          });
        } else {
          console.error("No document found with the given custom ID!");
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicleData();
    }
  }, [id]);

  const handleCall = () => {
    if (vehicleData?.contactNumber) {
      Linking.openURL(`tel:${vehicleData.contactNumber.replace(/\s/g, "")}`);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    </View>
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C6FF66" />
        </View>
      </ScreenWrapper>
    );
  }

  if (!vehicleData) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={{ color: "white", fontSize: 18 }}>
            Vehicle data not found.
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Image Carousel */}
          <FlatList
            ref={flatListRef}
            data={vehicleData.images}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            onScroll={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / Dimensions.get("window").width
              );
              setActiveIndex(index);
            }}
          />

          {/* Pagination */}
          <View style={styles.pagination}>
            {vehicleData.images.map((_, index) => (
              <View
                key={index}
                style={
                  index === activeIndex
                    ? styles.paginationDotActive
                    : styles.paginationDot
                }
              />
            ))}
          </View>

          {/* Vehicle Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{vehicleData.name}</Text>
            <Text style={styles.price}>{vehicleData.price}</Text>
            <Text style={styles.distance}>{vehicleData.distance}</Text>
            <Text style={styles.sellerText}>
              Seller: {vehicleData.seller}
            </Text>
            {vehicleData.isVerified && (
              <View style={styles.verifiedContainer}>
                <Ionicons name="checkmark-circle" size={16} color="#45B1FF" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}

            {/* Specifications */}
            <View style={styles.specTable}>
              <Text style={styles.specTitle}>Specifications:</Text>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Brand:</Text>
                <Text style={styles.specValue}>{vehicleData.brand}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Model:</Text>
                <Text style={styles.specValue}>{vehicleData.model}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Trim:</Text>
                <Text style={styles.specValue}>{vehicleData.trim}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Year:</Text>
                <Text style={styles.specValue}>{vehicleData.year}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Condition:</Text>
                <Text style={styles.specValue}>{vehicleData.condition}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Transmission:</Text>
                <Text style={styles.specValue}>{vehicleData.transmission}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Body Type:</Text>
                <Text style={styles.specValue}>{vehicleData.bodyType}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Fuel Type:</Text>
                <Text style={styles.specValue}>{vehicleData.fuelType}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Engine Capacity:</Text>
                <Text style={styles.specValue}>{vehicleData.engineCapacity}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specField}>Mileage:</Text>
                <Text style={styles.specValue}>{vehicleData.mileage}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Call Button */}
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color="black" />
          <Text style={styles.callButtonText}>{vehicleData.contactNumber}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default MarketplaceDisplay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: Dimensions.get("window").width,
    height: 240,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 16,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#C6FF66",
    marginHorizontal: 4,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#C6FF66",
    marginVertical: 8,
  },
  distance: {
    fontSize: 16,
    color: "white",
  },
  sellerText: {
    fontSize: 16,
    color: "white",
    marginVertical: 8,
  },
  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  verifiedText: {
    fontSize: 14,
    color: "#45B1FF",
    marginLeft: 4,
  },
  specTable: {
    marginTop: 16,
    marginRight: 8,
  },
  specTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  specField: {
    color: "#D3D3D380",
    fontWeight: "normal",
    fontFamily: "monospace",
  },
  specValue: {
    color: "#D3D3D399",
    fontFamily: "monospace",
  },
  callButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#C6FF66",
    height: 56,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  callButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginLeft: 8,
  },
});