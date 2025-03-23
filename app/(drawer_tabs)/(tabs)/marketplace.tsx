import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { Plus, SealCheck, Funnel, MagnifyingGlass } from "phosphor-react-native"; // Import the Plus, SealCheck, Funnel, and MagnifyingGlass icons
import { useRouter } from "expo-router";
import ScreenWrapper from '@/components/ScreenWrapper';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const ItemS_PER_PAGE = 8;

const Marketplace = () => {
  interface Item {
      id: string;
      imgUrl: string[];
      mileage: string;
      location: string;
      price: string;
      verified: boolean;
      daysAgo: number;
      brand: string; // Added brand property
      model: string; // Added model property
      year: string;  // Added year property
      title: string; // Added title property
  }

  const [data, setData] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [page]);

  // Helper function to get paginated data
  const getPaginatedData = (): Item[] => {
    const startIndex = (page - 1) * ItemS_PER_PAGE;
    const endIndex = startIndex + ItemS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const db = getFirestore();
      const marketplaceCollection = collection(db, 'marketplace');

      // Fetch all items from Firestore, ordered by ID
      const q = query(marketplaceCollection, orderBy('id', 'asc'));
      const snapshot = await getDocs(q);

      const result: Item[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Item[];

      console.log('Fetched Data:', result); // Log the fetched data

      const formattedData = result.map((item: Item) => ({
        ...item,
        title: `${item.brand} ${item.model} ${item.year}`, // Combine brand, model, and year
      }));

      console.log('Formatted Data:', formattedData); // Log the formatted data
      setData(formattedData);
      setTotalPages(Math.ceil(formattedData.length / ItemS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // SearchBar Component
interface SearchBarProps {
  onSearch: (text: string) => void;
  onFilter: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilter }) => {
  return (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity style={styles.filterButton} onPress={onFilter}>
        <Funnel size={24} color="white" weight="bold" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          style={styles.input}
          onChangeText={onSearch}  // Trigger search when typing
        />
        <MagnifyingGlass size={20} color="black" />
      </View>
    </View>
  );
};


  return (
    <ScreenWrapper>
      
      {/* Search Bar */}
<<<<<<< Updated upstream
=======
      <TopBar />
      <Text style={styles.name}>Marketplace</Text>
>>>>>>> Stashed changes
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Items..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.searchIconContainer}>
          <MagnifyingGlass size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#45B1FF" />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {getPaginatedData().map((item) => {
              console.log('Rendering Item:', item); // Log each item being rendered
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.ItemContainer,
                    selectedItemId === item.id && styles.selectedItemContainer, // Apply border when selected
                  ]}
                  onPress={() => {
                    setSelectedItemId(item.id); // Set the selected item
                    router.push(`/marketplace-display`);
                  }}
                >
                  <Image
                    source={{
                      uri: item.imgUrl && item.imgUrl.length > 0 ? item.imgUrl[0] : 'https://via.placeholder.com/100',
                    }}
                    style={styles.image}
                  />
                  <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{item.title || 'No Title Available'}</Text>
                    <Text style={styles.mileage}>{item.mileage ? `${item.mileage} km` : 'N/A'}</Text>
                    <Text style={styles.location}>{item.location || 'Unknown Location'}</Text>
                    <Text style={styles.price}>{item.price ? `LKR ${item.price}` : 'Price Not Available'}</Text>
                    {item.verified && (
                      <View style={styles.verifiedContainer}>
                        <SealCheck size={16} color="#45B1FF" weight="fill" />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                    <Text style={styles.daysAgo}>{item.daysAgo || 0} Days ago</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

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
  name: {
    fontSize: 30,
    color: "#C3FF65",
    fontWeight: "bold",
    marginBottom: 0,
    marginTop: -10,
    paddingLeft: 30,
  },
  ItemContainer: {
    backgroundColor: '#333',
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    padding: 10,
    marginHorizontal: 15,
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
  mileage: {
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
    borderTopEndRadius: 40,
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
    color: '#C6FF66',
    borderWidth: 2,
    borderColor: '#C6FF66',
    paddingHorizontal: 5,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  page: {
    fontWeight: 'normal',
    color: '#D3D3D380',
    paddingHorizontal: 30,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333', // Background color for the search bar
    borderRadius: 25,
    margin: 10,
    paddingHorizontal: 15,
    height: 50,
    marginHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff', // Text color
  },
  searchIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  selectedItemContainer: {
    borderWidth: 2,
    borderColor: '#45B1FF',
  },
});

export default Marketplace;