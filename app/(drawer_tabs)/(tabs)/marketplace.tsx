import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { Plus, SealCheck } from "phosphor-react-native"; // Import the Plus and SealCheck icons
import { useRouter } from "expo-router";
import ScreenWrapper from '@/components/ScreenWrapper';

const ITEMS_PER_PAGE = 8;

const Marketplace = () => {
  interface Item {
    id: string;
    imgUrl: string[];
    title: string;
    mileage: string;
    location: string;
    price: string;
    verified: boolean;
    daysAgo: number;
  }

  const [data, setData] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.1.67:3000/marketplace`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
  
      // Convert object to array
      const formattedData = Object.keys(result).map((key) => ({
        id: key,
        ...result[key],
      }));
  
      console.log('Fetched Data:', formattedData); // ✅ Logs formatted data
  
      setData(formattedData);
      setTotalPages(Math.ceil(formattedData.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPaginatedData = () => {
    if (!data || data.length === 0) return [];
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  return (
    <ScreenWrapper>
      {loading ? (
        <ActivityIndicator size="large" color="#45B1FF" />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {getPaginatedData().map((item) => {
              console.log('Image URL:', item.imgUrl[0]); // Log the first image URL
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemContainer}
                  onPress={() => router.push(`/marketplace-display`)} // Pass item ID to the next screen
                >
                  <Image
                    source={{
                      uri: item.imgUrl && item.imgUrl.length > 0 ? item.imgUrl[0] : 'https://via.placeholder.com/100', // Use the first image or fallback
                    }}
                    style={styles.image}
                  />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{item.title || 'No Title Available'}</Text>
                    <Text style={styles.km}>{item.mileage ? `${item.mileage} km` : 'N/A'}</Text>
                    <Text style={styles.location}>{item.location || 'Unknown Location'}</Text>
                    <Text style={styles.price}>{item.price ? `LKR ${item.price}` : 'Price Not Available'}</Text>
                    {item.verified && (
                      <View style={styles.verifiedContainer}>
                        <SealCheck size={16} color="#45B1FF" weight="fill" /> {/* Use the SealCheck icon */}
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                    <Text style={styles.daysAgo}>{item.daysAgo || 0} Days ago</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Pagination */}
            <View style={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <TouchableOpacity key={num} onPress={() => setPage(num)}>
                  <Text style={page === num ? styles.activePage : styles.page}>
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Floating Plus Button */}
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => router.push('/addItem')} // Navigate to the addItem page
          >
            <Plus size={32} color="#fff" weight="bold" /> {/* Plus Icon */}
          </TouchableOpacity>
        </>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Replace with your desired color
  },
  scrollContent: {
    paddingBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#333',
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center', // ✅ Ensures alignment
  },
  imageContainer: {
    width: '35%', 
    marginRight: 12, 
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 15,
    resizeMode: 'cover', // ✅ Ensures proper resizing
  },
  detailsContainer: {
    flex: 1, 
    justifyContent: 'space-between',
    paddingHorizontal: 15, // Add padding for better spacing
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    padding: 3, // Ensure this contrasts with the background
  },
  km: {
    fontSize: 14,
    color: '#cccccc',
    padding: 3,  // Ensure this contrasts with the background
  },
  location: {
    fontSize: 14,
    color: '#cccccc',
    padding: 3,  // Ensure this contrasts with the background
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C6FF66', 
    padding: 3, // Green for visibility
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3, 
  },
  verifiedText: {
    fontSize: 12,
    color: "#45B1FF",
    marginLeft: 3,
  },
  daysAgo: {
    fontSize: 12,
    color: '#ccc', 
    position: 'absolute', 
    bottom: 0,
    right: 5, 
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  activePageButton: {
    backgroundColor: '#45B1FF',
  },
  activePage: {
    fontWeight: 'bold',
    color: '#45B1FF',
  },
  page: {
    fontWeight: 'normal',
    color: '#000',
  },
  pageButtonText: {
    color: '#000',
    fontSize: 16,
  },
  activePageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingMore: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#121212', // Replace with your desired color
    padding: 10,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#74B520',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Marketplace;