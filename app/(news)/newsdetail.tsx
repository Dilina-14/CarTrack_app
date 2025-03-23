import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import { db } from "@/firebaseAuth";
import { doc, getDoc } from 'firebase/firestore';

// Interface for the news item
interface NewsItem {
  id?: string;
  title: string;
  date: string;
  author: string;
  location?: string;
  description: string;
  imageUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contact?: string;
}

const NewsDetail = () => { 
  const router = useRouter();
  const params = useLocalSearchParams();
  const newsId = params.id as string;

  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    // Function to fetch news details from Firestore
    const fetchNewsDetails = async () => {
      if (!newsId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const newsDocRef = doc(db, "news", newsId);
        const newsDoc = await getDoc(newsDocRef);
        
        if (newsDoc.exists()) {
          setNewsItem({ id: newsDoc.id, ...newsDoc.data() as Omit<NewsItem, 'id'> });
          console.log("News item loaded from Firestore:", newsDoc.id);
        } else {
          console.log("No news item found with ID:", newsId);
        }
      } catch (error: any) {
        console.error("Error fetching news details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsDetails();
  }, [newsId]);

  const handleCallOrganizer = (phoneNumber?: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert("Contact Info", "No contact information available for this organizer.");
    }
  };
  
  // Check if this is a car event
  const isCarEvent = newsItem?.title?.toLowerCase().includes('car') || 
                      newsItem?.title?.toLowerCase().includes('meet') ||
                      newsItem?.description?.toLowerCase().includes('event');
  
  // Fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60";
  
  if (loading) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>News Detail</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A020F0" />
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  if (!newsItem) {
    return (
      <ScreenWrapper>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>News Detail</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>News item not found</Text>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>News Detail</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Image */}
          {(newsItem.imageUrl && !imageError) ? (
            <Image 
              source={{ uri: newsItem.imageUrl }} 
              style={styles.image}
              onError={() => {
                console.log("Image failed to load:", newsItem.imageUrl);
                setImageError(true);
              }}
            />
          ) : (
            <Image 
              source={{ uri: fallbackImage }} 
              style={styles.image}
            />
          )}

          <View style={styles.detailsContainer}>
            {/* Title */}
            <Text style={styles.title}>{newsItem.title}</Text>

            {/* Display different info based on type */}
            {isCarEvent ? (
              <>
                {/* Event info */}
                <Text style={styles.dateText}>{newsItem.date}</Text>
                <Text style={styles.subtitleText}>{newsItem.title} – Experience the Thrill!</Text>
                
                <Text style={styles.description}>
                  {newsItem.description}
                </Text>
                
                {newsItem.location && (
                  <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Location:</Text>
                    <Text style={styles.infoText}>{newsItem.location}</Text>
                  </View>
                )}
                
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Organized by:</Text>
                  <Text style={styles.infoText}>{newsItem.author}</Text>
                </View>
                
                <Text style={styles.contactText}>Don't miss this exclusive event! Stay tuned for more details.</Text>
                
                {newsItem.contact && (
                  <TouchableOpacity 
                    style={styles.contactContainer}
                    onPress={() => handleCallOrganizer(newsItem.contact)}
                  >
                    <Feather name="phone" size={16} color="#A020F0" />
                    <Text style={styles.contactNumber}>{newsItem.contact}</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {/* Regular news info */}
                <Text style={styles.dateText}>{newsItem.date}</Text>
                <View style={styles.authorContainer}>
                  <Text style={styles.authorText}>Author: {newsItem.author}</Text>
                </View>
                
                <Text style={styles.description}>
                  {newsItem.description}
                </Text>

                {newsItem.location && (
                  <View style={styles.locationContainer}>
                    <Feather name="map-pin" size={16} color="#A020F0" />
                    <Text style={styles.locationText}>{newsItem.location}</Text>
                  </View>
                )}
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
    marginTop: 30,
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
  noImageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: 'rgba(160, 32, 240, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
});