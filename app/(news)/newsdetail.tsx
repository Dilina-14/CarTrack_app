
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView
} from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';

const NewsDetail = () => { 
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  // Default data for each article based on the images you provided
  const newsData = {
    "1": {
      title: "Super Car Meet Up",
      date: "14th of November",
      author: "Organized by Mr.Dilino", 
      location: "The Speedlane Club",
      description: "Rev your engines and get ready for the ultimate Super Car Meet Up on 14th November! Witness some of the finest supercars in the country, featuring exotic models from Ferrari, Lamborghini, and more. Enjoy a day filled with automotive excellence, horsepower and style.",
      contact: "+94 12 345 6789",
      imageUri: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    "2": {
      title: "Sri Lanka To Ease Vehicle Import Restrictions",
      date: "posted on 18/11/2024",
      author: "Sara Eddings",
      description: "Sri Lanka is set to ease its vehicle import restrictions, marking a significant shift in the automotive industry. This decision is expected to have positive impacts on the local market, making cars more accessible and boosting economic activity. Consumers can anticipate better options and competitive pricing in the coming months. Stay tuned for further updates on policy changes and their impact on the industry.",
      imageUri: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    }
  };

  // Determine which article data to show
  const newsId = params.id as string || "1";
  const article = newsData[newsId as keyof typeof newsData];
  
  // Check if viewing a car meet or regular news article
  const isCarMeet = newsId === "1";

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News Detail</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Image */}
          <Image source={{ uri: article.imageUri }} style={styles.image} />

          <View style={styles.detailsContainer}>
            {/* Title */}
            <Text style={styles.title}>{article.title}</Text>

            {/* Display different info based on type */}
            {isCarMeet ? (
              <>
                {/* Super Car event info */}
                <Text style={styles.dateText}>{article.date}</Text>
                <Text style={styles.subtitleText}>Super Car Meet Up – Experience the Thrill!</Text>
                
                <Text style={styles.description}>
                  {article.description}
                </Text>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoText}></Text>
                </View>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Organized by:</Text>
                  <Text style={styles.infoText}>{article.author.replace('Organized by ', '')}</Text>
                </View>
                
                <Text style={styles.contactText}>Don't miss this exclusive event! Stay tuned for more details.</Text>
                <Text style={styles.contactText}>Would you like to add a call to action, such as a registration link or contact info?</Text>
                
                <View style={styles.contactContainer}>
                  <Feather name="phone" size={16} color="#A020F0" />
                  <Text style={styles.contactNumber}></Text>
                </View>
              </>
            ) : (
              <>
                {/* Regular news info */}
                <Text style={styles.dateText}>{article.date}</Text>
                <View style={styles.authorContainer}>
                  <Text style={styles.authorText}>Author: {article.author}</Text>
                </View>
                
                <Text style={styles.description}>
                  {article.description}
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default NewsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 18,
    color: '#A020F0',
    marginTop: 8,
    marginBottom: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 4,
  },
  authorContainer: {
    marginVertical: 8,
  },
  authorText: {
    fontSize: 14,
    color: '#ccc',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    marginVertical: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#A020F0',
    fontWeight: '500',
    width: 100,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  contactText: {
    fontSize: 15,
    color: '#ccc',
    marginTop: 16,
    fontStyle: 'italic',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(160, 32, 240, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactNumber: {
    fontSize: 16,
    color: '#A020F0',
    marginLeft: 8,
    fontWeight: '500',
  },

import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView
} from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';

const NewsDetail = () => { 
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  
  // Default data for each article based on the images you provided
  const newsData = {
    "1": {
      title: "Super Car Meet Up",
      date: "14th of November",
      author: "Organized by Mr.Dilino",
      location: "The Speedlane Club",
      description: "Rev your engines and get ready for the ultimate Super Car Meet Up on 14th November! Witness some of the finest supercars in the country, featuring exotic models from Ferrari, Lamborghini, and more. Enjoy a day filled with automotive excellence, horsepower and style.",
      contact: "+94 12 345 6789",
      imageUri: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    },
    "2": {
      title: "Sri Lanka To Ease Vehicle Import Restrictions",
      date: "posted on 18/11/2024",
      author: "Sara Eddings",
      description: "Sri Lanka is set to ease its vehicle import restrictions, marking a significant shift in the automotive industry. This decision is expected to have positive impacts on the local market, making cars more accessible and boosting economic activity. Consumers can anticipate better options and competitive pricing in the coming months. Stay tuned for further updates on policy changes and their impact on the industry.",
      imageUri: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    }
  };

  // Determine which article data to show
  const newsId = params.id as string || "1";
  const article = newsData[newsId as keyof typeof newsData];
  
  // Check if viewing a car meet or regular news article
  const isCarMeet = newsId === "1";

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News Detail</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Image */}
          <Image source={{ uri: article.imageUri }} style={styles.image} />

          <View style={styles.detailsContainer}>
            {/* Title */}
            <Text style={styles.title}>{article.title}</Text>

            {/* Display different info based on type */}
            {isCarMeet ? (
              <>
                {/* Super Car event info */}
                <Text style={styles.dateText}>{article.date}</Text>
                <Text style={styles.subtitleText}>Super Car Meet Up – Experience the Thrill!</Text>
                
                <Text style={styles.description}>
                  {article.description}
                </Text>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoText}>{article.location}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Organized by:</Text>
                  <Text style={styles.infoText}>{article.author.replace('Organized by ', '')}</Text>
                </View>
                
                <Text style={styles.contactText}>Don't miss this exclusive event! Stay tuned for more details.</Text>
                <Text style={styles.contactText}>Would you like to add a call to action, such as a registration link or contact info?</Text>
                
                <View style={styles.contactContainer}>
                  <Feather name="phone" size={16} color="#A020F0" />
                  <Text style={styles.contactNumber}>{article.contact}</Text>
                </View>
              </>
            ) : (
              <>
                {/* Regular news info */}
                <Text style={styles.dateText}>{article.date}</Text>
                <View style={styles.authorContainer}>
                  <Text style={styles.authorText}>Author: {article.author}</Text>
                </View>
                
                <Text style={styles.description}>
                  {article.description}
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default NewsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    marginTop: 70
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 18,
    color: '#A020F0',
    marginTop: 8,
    marginBottom: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 4,
  },
  authorContainer: {
    marginVertical: 8,
  },
  authorText: {
    fontSize: 14,
    color: '#ccc',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    marginVertical: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#A020F0',
    fontWeight: '500',
    width: 100,
  },
  infoText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  contactText: {
    fontSize: 15,
    color: '#ccc',
    marginTop: 16,
    fontStyle: 'italic',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(160, 32, 240, 0.1)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactNumber: {
    fontSize: 16,
    color: '#A020F0',
    marginLeft: 8,
    fontWeight: '500',
  },
});