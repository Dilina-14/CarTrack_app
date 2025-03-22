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
import { useRouter } from "expo-router";
import ScreenWrapper from '@/components/ScreenWrapper';

const ITEMS_PER_PAGE = 8;

const Marketplace = () => {
  interface Item {
    id: string;
    imageUrl: string;
    title: string;
    km: string;
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

      console.log('Fetched Data:', result); // Log the fetched data
      setData(result);
      setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPaginatedData = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  return (
    <ScreenWrapper>
      {loading ? (
        <ActivityIndicator size="large" color="#45B1FF" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {getPaginatedData().map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemContainer}
              onPress={() => router.push(`/marketplace-display`)} // Pass item ID to the next screen
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <View style={styles.detailsContainer}>
                <Text style={styles.title}>{item.title || 'No Title Available'}</Text>
                <Text style={styles.km}>{item.km ? `${item.km} km` : 'N/A'}</Text>
                <Text style={styles.location}>{item.location || 'Unknown Location'}</Text>
                <Text style={styles.price}>{item.price ? `LKR ${item.price}` : 'Price Not Available'}</Text>
                {item.verified && (
                  <View style={styles.verifiedContainer}>
                    <Text style={styles.verifiedText}>✅ Verified</Text>
                  </View>
                )}
                <Text style={styles.daysAgo}>{item.daysAgo || 0} Days ago</Text>
              </View>
            </TouchableOpacity>
          ))}

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
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Replace with your desired color
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#333', // item background
    borderRadius: 8,
    marginVertical: 10, 
    overflow: 'hidden',
    padding: 10,
    flexDirection: 'row',  
  },
  imageContainer: {
    width: '35%', 
    marginRight: 12, 
  },
  image: {
    width: '100%',
    height: 100, // Reduce height if necessary
    borderRadius: 8,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1, 
    justifyContent: 'space-between',
    paddingHorizontal: 10, // Add padding for better spacing
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // Ensure this contrasts with the background
  },
  km: {
    fontSize: 14,
    color: '#cccccc', // Ensure this contrasts with the background
  },
  location: {
    fontSize: 14,
    color: '#cccccc', // Ensure this contrasts with the background
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff00', // Green for visibility
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    right: 0, 
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
  

});

export default Marketplace;