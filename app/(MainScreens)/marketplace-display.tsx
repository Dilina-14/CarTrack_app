import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView, ScrollView, Linking, FlatList, ViewToken } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useTailwind } from 'tailwind-rn';
import { Ionicons } from '@expo/vector-icons';

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
  images: any[]; // Using any[] for image requires, but ideally use a more specific type
}

// Interface for viewable items changed
interface ViewableItemsChanged {
  viewableItems: Array<ViewToken>;
  changed: Array<ViewToken>;
}

const MarketplaceDisplay = () => {
    const router = useRouter();
    const [screenWidth, setScreenWidth] = useState<number>(Dimensions.get('window').width);
    const [screenHeight, setScreenHeight] = useState<number>(Dimensions.get('window').height);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList>(null);

    const tw = useTailwind();

    // Update dimensions on orientation changes
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
            setScreenHeight(window.height);
        });
        return () => subscription?.remove();
    }, []);

    // Vehicle data
    const vehicleData: VehicleData = {
        name: "Hilux Vigo - 2013",
        seller: "Edith",
        price: "Rs 12,500,000",
        distance: "98,000 km",
        brand: "Toyota",
        model: "Hilux",
        trim: "Vigo Smart Cab",
        year: "2010",
        condition: "Used",
        transmission: "Manual",
        bodyType: "SUV / 4x4",
        fuelType: "Diesel",
        engineCapacity: "2500 cc",
        mileage: "205,000 km",
        isVerified: true,
        contactNumber: "+94 766 366 760",
        // Using the same image for demo purposes, replace with actual different images
        images: [
            require('@/assets/images/marketplace-display/vehicle-image-1.jpg'),
            require('@/assets/images/marketplace-display/vehicle-image-2.jpg'),
            require('@/assets/images/marketplace-display/vehicle-image-3.jpg'),
            
        ]
    };

    const handleCall = () => {
        Linking.openURL(`tel:${vehicleData.contactNumber.replace(/\s/g, '')}`);
    };

    const containerWidth = screenWidth * 0.9; // Reduced from 0.95 to add more margin
    const imageWidth = screenWidth * 0.9; // Match image width to container width
    
    const fontSize = {
        title: Math.min(screenWidth * 0.055, 24),
        price: Math.min(screenWidth * 0.05, 22),
        subtitle: Math.min(screenWidth * 0.035, 16),
        detail: Math.min(screenWidth * 0.03, 14),
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: ViewableItemsChanged) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const renderItem = ({ item, index }: { item: any; index: number }) => {
        return (
            <View style={{ width: imageWidth }}>
                <Image 
                    source={item} 
                    style={[styles.image, { width: imageWidth }]}
                    resizeMode="cover"
                />
            </View>
        );
    };

    return (
        <ScreenWrapper>
            <SafeAreaView style={styles.container}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: screenWidth * 0.05 }}
                >
                    {/* Image Carousel */}
                    <View style={[styles.imageContainer, { width: imageWidth }]}>
                        <FlatList
                            ref={flatListRef}
                            data={vehicleData.images}
                            renderItem={renderItem}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onViewableItemsChanged={onViewableItemsChanged}
                            viewabilityConfig={viewabilityConfig}
                            snapToInterval={imageWidth}
                            decelerationRate="fast"
                        />
                        
                        {/* Pagination indicators */}
                        <View style={styles.pagination}>
                            {vehicleData.images.map((_, index) => (
                                <View 
                                    key={index} 
                                    style={index === activeIndex ? styles.paginationDotActive : styles.paginationDot} 
                                />
                            ))}
                        </View>
                    </View>

                    {/* Vehicle Info */}
                    <View style={[styles.infoContainer, { width: containerWidth }]}>
                        <View style={styles.headerSection}>
                            <Text style={[styles.title, { fontSize: fontSize.title }]}>{vehicleData.name}</Text>
                            <View style={styles.sellerContainer}>
                                <Text style={styles.sellerText}>Seller: {vehicleData.seller}</Text>
                                {vehicleData.isVerified && (
                                    <View style={styles.verifiedContainer}>
                                                                <Image 
                                                                    source={require('../../assets/images/verify-icon.png')} 
                                                                    style={styles.verifyIcon}
                                                                />
                                                                <Text style={[styles.verifiedText]}>Verified</Text>
                                                            </View>
                                )}
                            </View>
                        </View>

                        {/* Price and Distance */}
                        <View style={styles.priceDistanceContainer}>
                            <Text style={[styles.price, { fontSize: fontSize.price }]}>{vehicleData.price}</Text>
                            <Text style={[styles.distance, { fontSize: fontSize.subtitle }]}>{vehicleData.distance}</Text>
                        </View>

                        {/* Description Section */}
                        <View style={styles.descriptionSection}>
                            <Text style={[styles.sectionTitle, { fontSize: fontSize.subtitle }]}>Description</Text>
                            
                            {/* Vehicle Specs Table */}
                            <View style={styles.specTable}>
                                <SpecRow title="Brand:" value={vehicleData.brand} fontSize={fontSize.detail} />
                                <SpecRow title="Model:" value={vehicleData.model} fontSize={fontSize.detail} />
                                <SpecRow title="Trim / Edition:" value={vehicleData.trim} fontSize={fontSize.detail} />
                                <SpecRow title="Year of Manufacture:" value={vehicleData.year} fontSize={fontSize.detail} />
                                <SpecRow title="Condition:" value={vehicleData.condition} fontSize={fontSize.detail} />
                                <SpecRow title="Transmission:" value={vehicleData.transmission} fontSize={fontSize.detail} />
                                <SpecRow title="Body Type:" value={vehicleData.bodyType} fontSize={fontSize.detail} />
                                <SpecRow title="Fuel Type:" value={vehicleData.fuelType} fontSize={fontSize.detail} />
                                <SpecRow title="Engine Capacity:" value={vehicleData.engineCapacity} fontSize={fontSize.detail} />
                                <SpecRow title="Mileage:" value={vehicleData.mileage} fontSize={fontSize.detail} />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Call Button */}
                <TouchableOpacity 
                    style={[styles.callButton, { width: containerWidth }]}
                    onPress={handleCall}
                >
                    <Ionicons name="call" size={24} color="black" />
                    <Text style={styles.callButtonText}>{vehicleData.contactNumber}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScreenWrapper>
    );
};

// Helper component for specs table with proper TypeScript types
interface SpecRowProps {
    title: string;
    value: string;
    fontSize: number;
}

const SpecRow: React.FC<SpecRowProps> = ({ title, value, fontSize }) => (
    <View style={styles.specRow}>
        <Text style={[styles.specTitle, { fontSize }]}>{title}</Text>
        <Text style={[styles.specValue, { fontSize }]}>{value}</Text>
    </View>
);

export default MarketplaceDisplay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    imageContainer: {
        height: 240,
        position: 'relative',
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        height: '100%',
        borderRadius: 12,
    },
    pagination: {
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    verifyIcon: {
        width: 15,
        height: 15,
        marginLeft: 10,
    },
    verifiedText: {
        color: '#45B1FF',
        marginLeft: 5,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        width: 16,
        height: 8,
        borderRadius: 10,
        backgroundColor: '#C6FF66',
        marginHorizontal: 4,
    },
    infoContainer: {
        alignSelf: 'center',
        marginTop: 15,
    },
    headerSection: {
        marginBottom: 0,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
    },
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    sellerText: {
        color: 'white',
        fontSize: 14,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 10,
    },
    
    priceDistanceContainer: {
        marginVertical: 15,
    },
    price: {
        color: '#C6FF66',
        fontWeight: 'bold',
    },
    distance: {
        color: 'white',
        marginTop: 5,
    },
    descriptionSection: {
        marginTop: 0,
    },
    sectionTitle: {
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    specTable: {
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 16,
    },
    specRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    specTitle: {
        color: 'white',
        opacity: 0.7,
    },
    specValue: {
        color: 'white',
        fontWeight: '500',
    },
    callButton: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#C6FF66',
        height: 56,
        borderRadius: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    callButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});