
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Using Expo Vector Icons (includes FontAwesome)
import { colors } from '@/constants/theme';
import { Funnel, MagnifyingGlass } from "phosphor-react-native";
import { TextInput } from 'react-native';

const SearchBar = () => {
  return (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity style={styles.filterButton}>
        <Funnel size={24} color="white" weight="bold" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          style={styles.input}
        />
        <MagnifyingGlass size={20} color="black" />
      </View>
    </View>
  );
};

const DATA = [
  // Updated data to better reflect the image and add more variety
  {
    id: '1',
    title: 'Honda Vezel - RS 2016',
    km: '101,000 km',
    location: 'Colombo, Cars',
    price: '13,500,000',
    imageUrl:
      'https://www.automall.lk/wp-content/uploads/2024/06/WhatsApp-Image-2024-05-10-at-12.17.56-PM.jpeg',
    verified: true,
    daysAgo: 12,
  },
  {
    id: '2',
    title: 'Hilux Vigo - 2013',
    km: '105,000 km',
    location: 'Colombo, Cars',
    price: '12,500,000',
    imageUrl:
      'https://toyota-dealer.org/images/2016-Toyota-Hilux-Revo/2016-Toyota-Hilux-Revo-black-front.JPG',
    verified: true,
    daysAgo: 13,
  },
  {
    id: '3',
    title: 'Bajaj RE - 2013',
    km: '22,000 km',
    location: 'Horowpathana, Trishaw',
    price: '1,500,000',
    imageUrl:
      'https://www.riyasakwala.lk/public/images/vehicle_ad/10/AD00017-1.jpeg',
    verified: false, // Bajaj RE is unlikely to be "verified"
    daysAgo: 1,
  },
  {
    id: '4',
    title: 'Toyota Supra MK4 - 2013', // Note the year correction
    km: '198,000 km',
    location: 'Bambalapitiya, Cars',
    price: '75,500,000',
    imageUrl:
      'https://venteautoprestige.com/wp-content/uploads/2024/03/Toyota-Supra-MK4-blanche-trois-quarts-avant.webp',
    verified: true,
    daysAgo: 15,
  },
  {
    id: '5',
    title: 'Hilux Vigo - 2013',
    km: '110,000 km',
    location: 'Colombo, Cars',
    price: '12,000,000',
    imageUrl:
      'https://www.carjunction.com/car_images2/32795_44665/44665a.jpg',
    verified: false,
    daysAgo: 14,
  },
  {
    id: '6',
    title: 'Honda Civic - 2018',
    km: '75,000 km',
    location: 'Colombo, Cars',
    price: '15,000,000',
    imageUrl:
      'https://car-images.bauersecure.com/wp-images/2301/honda-civic-93.jpg',
    verified: true,
    daysAgo: 10,
  },
  {
    id: '7',
    title: 'Nissan Leaf - 2015',
    km: '88,000 km',
    location: 'Colombo, Cars',
    price: '8,000,000',
    imageUrl:
      'https://images.hgmsites.net/hug/2015-nissan-leaf_100473855_h.jpg',
    verified: false,
    daysAgo: 7,
  },
  {
    id: '8',
    title: 'Suzuki Alto - 2012',
    km: '120,000 km',
    location: 'Colombo, Cars',
    price: '2,500,000',
    imageUrl:
      'https://static.carfromjapan.com/car_7b785ab5-2f85-4255-b320-a7ca5219d956',
    verified: false,
    daysAgo: 4,
  },
  {
    id: '9',
    title: 'Mitsubishi Lancer - 2008',
    km: '150,000 km',
    location: 'Colombo, Cars',
    price: '4,000,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/2008_Mitsubishi_Lancer_%28CJ%29_ES_sedan_%282018-09-26%29_01.jpg/1280px-2008_Mitsubishi_Lancer_%28CJ%29_ES_sedan_%282018-09-26%29_01.jpg',
    verified: false,
    daysAgo: 2,
  },
  {
    id: '10',
    title: 'BMW 3 Series - 2016',
    km: '90,000 km',
    location: 'Colombo, Cars',
    price: '18,000,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/2016_BMW_328i_%28F30%29_sedan_%282018-09-28%29_01.jpg/1280px-2016_BMW_328i_%28F30%29_sedan_%282018-09-28%29_01.jpg',
    verified: true,
    daysAgo: 9,
  },
  {
    id: '11',
    title: 'Mercedes-Benz C-Class - 2017',
    km: '80,000 km',
    location: 'Colombo, Cars',
    price: '20,000,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/2017_Mercedes-Benz_C200_%28W205%29_sedan_%282018-09-27%29_01.jpg/1280px-2017_Mercedes-Benz_C200_%28W205%29_sedan_%282018-09-27%29_01.jpg',
    verified: true,
    daysAgo: 6,
  },
  {
    id: '12',
    title: 'Audi A4 - 2019',
    km: '65,000 km',
    location: 'Colombo, Cars',
    price: '22,000,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2019_Audi_A4_S_line_%28B9%29_sedan_%282020-09-26%29_01.jpg/1280px-2019_Audi_A4_S_line_%28B9%29_sedan_%282020-09-26%29_01.jpg',
    verified: true,
    daysAgo: 3,
  },
  {
    id: '13',
    title: 'Another Honda Vezel - RS 2016',
    km: '111,000 km',
    location: 'Colombo, Cars',
    price: '14,500,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2018_Honda_Vezel_Hybrid_RS_%28RU3%29_wagon_%282018-09-29%29_01.jpg/1280px-2018_Honda_Vezel_Hybrid_RS_%28RU3%29_wagon_%282018-09-29%29_01.jpg',
    verified: true,
    daysAgo: 11,
  },

];

const ITEMS_PER_PAGE = 8; // Number of items per page

const Marketplace = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [page]); // Load data when the page changes

  const loadData = useCallback(() => {
    setLoading(true);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newData = DATA.slice(startIndex, endIndex);
    setItems(newData);
    setTotalPages(Math.ceil(DATA.length / ITEMS_PER_PAGE));
    setLoading(false);
  }, [page]);


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
     <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.km}>{item.km}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.price}>Rs {item.price}</Text>
        <View style={styles.bottomRow}>
          {item.verified && (
            <View style={styles.verifiedContainer}>
              <FontAwesome name="check-circle" size={14} color="green" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
          <Text style={styles.daysAgo}>{item.daysAgo} Days</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return null;
  };

  const renderPagination = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            page === i ? styles.activePageButton : null,
          ]}
          onPress={() => setPage(i)}
        >
          <Text
            style={[
              styles.pageButtonText,
              page === i ? styles.activePageButtonText : null,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paginationContainer}>
        {pageButtons}
      </View>
    );
  };

  // Helper function to get items for the current page (no FlatList)
  const getPaginatedData = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return DATA.slice(startIndex, endIndex);
  };

  return (

    <ScreenWrapper>
      <Text>Marketplace</Text>
    </ScreenWrapper>
  )
}

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Using Expo Vector Icons (includes FontAwesome)
import { colors } from '@/constants/theme';
import { Funnel, MagnifyingGlass } from "phosphor-react-native";
import { TextInput } from 'react-native';
import { useRouter } from "expo-router";

const SearchBar = () => {
  return (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity style={styles.filterButton}>
        <Funnel size={24} color="white" weight="bold" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          style={styles.input}
        />
        <MagnifyingGlass size={20} color="black" />
      </View>

    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SearchBar />
        {getPaginatedData().map(item => (
          <TouchableOpacity key={item.id} style={styles.itemContainer}>

           <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.km}>{item.km}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.price}>Rs {item.price}</Text>
              <View style={styles.bottomRow}>
                {item.verified && (
                  <View style={styles.verifiedContainer}>
                    <FontAwesome name="check-circle" size={14} color="#45B1FF" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
                <Text style={styles.daysAgo}>{item.daysAgo} Days</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {renderFooter()}
        {renderPagination()}
      </ScrollView>

    </View>
  );
};


const DATA = [
  // Updated data to better reflect the image and add more variety
  {
    id: '1',
    title: 'Honda Vezel - RS 2016',
    km: '101,000 km',
    location: 'Colombo, Cars',
    price: '13,500,000',
    imageUrl:
      'https://www.automall.lk/wp-content/uploads/2024/06/WhatsApp-Image-2024-05-10-at-12.17.56-PM.jpeg',
    verified: true,
    daysAgo: 12,
  },
  {
    id: '2',
    title: 'Hilux Vigo - 2013',
    km: '105,000 km',
    location: 'Colombo, Cars',
    price: '12,500,000',
    imageUrl:
      'https://toyota-dealer.org/images/2016-Toyota-Hilux-Revo/2016-Toyota-Hilux-Revo-black-front.JPG',
    verified: true,
    daysAgo: 13,
  },
  {
    id: '3',
    title: 'Bajaj RE - 2013',
    km: '22,000 km',
    location: 'Horowpathana, Trishaw',
    price: '1,500,000',
    imageUrl:
      'https://www.riyasakwala.lk/public/images/vehicle_ad/10/AD00017-1.jpeg',
    verified: false, // Bajaj RE is unlikely to be "verified"
    daysAgo: 1,
  },
  {
    id: '4',
    title: 'Toyota Supra MK4 - 2013', // Note the year correction
    km: '198,000 km',
    location: 'Bambalapitiya, Cars',
    price: '75,500,000',
    imageUrl:
      'https://venteautoprestige.com/wp-content/uploads/2024/03/Toyota-Supra-MK4-blanche-trois-quarts-avant.webp',
    verified: true,
    daysAgo: 15,
  },
  {
    id: '5',
    title: 'Hilux Vigo - 2013',
    km: '110,000 km',
    location: 'Colombo, Cars',
    price: '12,000,000',
    imageUrl:
      'https://www.carjunction.com/car_images2/32795_44665/44665a.jpg',
    verified: false,
    daysAgo: 14,
  },
  {
    id: '6',
    title: 'Honda Civic - 2018',
    km: '75,000 km',
    location: 'Colombo, Cars',
    price: '15,000,000',
    imageUrl:
      'https://car-images.bauersecure.com/wp-images/2301/honda-civic-93.jpg',
    verified: true,
    daysAgo: 10,
  },
  {
    id: '7',
    title: 'Nissan Leaf - 2015',
    km: '88,000 km',
    location: 'Colombo, Cars',
    price: '8,000,000',
    imageUrl:
      'https://images.hgmsites.net/hug/2015-nissan-leaf_100473855_h.jpg',
    verified: false,
    daysAgo: 7,
  },
  {
    id: '8',
    title: 'Suzuki Alto - 2012',
    km: '120,000 km',
    location: 'Colombo, Cars',
    price: '2,500,000',
    imageUrl:
      'https://static.carfromjapan.com/car_7b785ab5-2f85-4255-b320-a7ca5219d956',
    verified: false,
    daysAgo: 4,
  },
  {
    id: '9',
    title: 'Mitsubishi Lancer - 2008',
    km: '150,000 km',
    location: 'Colombo, Cars',
    price: '4,000,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/2008_Mitsubishi_Lancer_%28CJ%29_ES_sedan_%282018-09-26%29_01.jpg/1280px-2008_Mitsubishi_Lancer_%28CJ%29_ES_sedan_%282018-09-26%29_01.jpg',
    verified: false,
    daysAgo: 2,
  },
  {
    id: '10',
    title: 'BMW 3 Series - 2016',
    km: '90,000 km',
    location: 'Colombo, Cars',
    price: '18,000,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/2016_BMW_328i_%28F30%29_sedan_%282018-09-28%29_01.jpg/1280px-2016_BMW_328i_%28F30%29_sedan_%282018-09-28%29_01.jpg',
    verified: true,
    daysAgo: 9,
  },
  {
    id: '11',
    title: 'Mercedes-Benz C-Class - 2017',
    km: '80,000 km',
    location: 'Colombo, Cars',
    price: '20,000,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/2017_Mercedes-Benz_C200_%28W205%29_sedan_%282018-09-27%29_01.jpg/1280px-2017_Mercedes-Benz_C200_%28W205%29_sedan_%282018-09-27%29_01.jpg',
    verified: true,
    daysAgo: 6,
  },
  {
    id: '12',
    title: 'Audi A4 - 2019',
    km: '65,000 km',
    location: 'Colombo, Cars',
    price: '22,000,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/2019_Audi_A4_S_line_%28B9%29_sedan_%282020-09-26%29_01.jpg/1280px-2019_Audi_A4_S_line_%28B9%29_sedan_%282020-09-26%29_01.jpg',
    verified: true,
    daysAgo: 3,
  },
  {
    id: '13',
    title: 'Another Honda Vezel - RS 2016',
    km: '111,000 km',
    location: 'Colombo, Cars',
    price: '14,500,000',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/2018_Honda_Vezel_Hybrid_RS_%28RU3%29_wagon_%282018-09-29%29_01.jpg/1280px-2018_Honda_Vezel_Hybrid_RS_%28RU3%29_wagon_%282018-09-29%29_01.jpg',
    verified: true,
    daysAgo: 11,
  },

];

const ITEMS_PER_PAGE = 8; // Number of items per page

const Marketplace = () => {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [page]); // Load data when the page changes

  const loadData = useCallback(() => {
    setLoading(true);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newData = DATA.slice(startIndex, endIndex);
    setItems(newData);
    setTotalPages(Math.ceil(DATA.length / ITEMS_PER_PAGE));
    setLoading(false);
  }, [page]);

  const renderItem = ({ item }) => (
    

    <TouchableOpacity style={styles.itemContainer} onPress={() => router.push("//(mainscreens)/marketplace-display")}>
     <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.km}>{item.km}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.price}>Rs {item.price}</Text>
        <View style={styles.bottomRow}>
          {item.verified && (
            <View style={styles.verifiedContainer}>
              <FontAwesome name="check-circle" size={14} color="green" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
          <Text style={styles.daysAgo}>{item.daysAgo} Days</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return null;
  };

  const renderPagination = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <TouchableOpacity 
          key={i}
          style={[
            styles.pageButton,
            page === i ? styles.activePageButton : null,
          ]}
          onPress={() => setPage(i)}
        >
          <Text
            style={[
              styles.pageButtonText,
              page === i ? styles.activePageButtonText : null,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paginationContainer}>
        {pageButtons}
      </View>
    );
  };

  // Helper function to get items for the current page (no FlatList)
  const getPaginatedData = () => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return DATA.slice(startIndex, endIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SearchBar />
        {getPaginatedData().map(item => (
          <TouchableOpacity key={item.id} style={styles.itemContainer}
          onPress={() => router.push("/marketplace-display")}
          >

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark, 
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#333', //item background
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
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1, 
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  km: {
    fontSize: 14,
    color: '#ccc', 
  },
  location: {
    fontSize: 14,
    color: '#ccc',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
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
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#555', 
  },
  activePageButton: {
    backgroundColor: colors.primary,
  },
  pageButtonText: {
    fontSize: 16,
    color: '#fff', // White text color
  },
  activePageButtonText: {
    color: 'black', // White text color
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryDark, // Dark background
    padding: 10,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#222", // Dark gray background
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