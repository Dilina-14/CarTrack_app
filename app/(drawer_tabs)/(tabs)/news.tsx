import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import TopBar from '@/components/TopBar';
import { db } from "@/firebaseAuth";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Define the type for the news item
type NewsItem = {
  id: string;
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
  distance?: string;
};

type NewsCardProps = {
  id: string;
  title: string;
  date: string;
  author: string;
  distance?: string;
  imageUrl?: string;
  onPress: () => void;
};

const NewsCard = ({ title, date, author, distance, imageUrl, onPress }: NewsCardProps) => {
  // Default image if none is provided
  const fallbackImage = "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60";
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity style={styles.newsCard} onPress={onPress}>
      <Image 
        source={{ uri: imageError ? fallbackImage : (imageUrl || fallbackImage) }} 
        style={styles.newsImage}
        onError={() => setImageError(true)}
      />
      <View style={styles.cardOverlay}>
        <Text style={styles.newsTitle}>{title}</Text>
        <Text style={styles.newsSubtitle}>{date}</Text>
        <View style={styles.newsDetails}>
          <Text style={styles.organizer}>{author}</Text>
          {distance && (
            <View style={styles.infoContainer}>
              <Feather name="map-pin" size={14} color="white" />
              <Text style={styles.infoText}>{distance}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const News = () => {
  const router = useRouter();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const newsQuery = query(collection(db, "news"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(newsQuery);
      
      const newsData: NewsItem[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<NewsItem, 'id'>
      }));
      
      console.log("Fetched news items:", newsData.length);
      setNewsItems(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchNews();
  };

  // Function to handle navigating to news detail
  const handleNewsPress = (newsId: string) => {
    router.push({
      pathname: "/newsdetail",
      params: { id: newsId }
    });
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <TopBar />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>News</Text>
        </View>

        {/* News Feed */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A020F0" />
          </View>
        ) : (
          <ScrollView 
            style={styles.newsFeed}
            contentContainerStyle={newsItems.length === 0 ? styles.emptyContainer : undefined}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#A020F0"]}
                tintColor="#A020F0"
              />
            }
          >
            {newsItems.length > 0 ? (
              newsItems.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  date={item.date}
                  author={item.author}
                  distance={item.distance}
                  imageUrl={item.imageUrl}
                  onPress={() => handleNewsPress(item.id)}
                />
              ))
            ) : (
              <View style={styles.emptyNewsContainer}>
                <Feather name="file-text" size={50} color="#A020F0" />
                <Text style={styles.emptyNewsText}>No news available</Text>
                <Text style={styles.emptyNewsSubtext}>Add your first news item</Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => router.push("/addnews")}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default News;

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
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#A020F0',
  },
  newsFeed: {
    flex: 1,
    paddingHorizontal: 16,
  },
  newsCard: {
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  newsSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginBottom: 4,
  },
  newsDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizer: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A020F0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyNewsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyNewsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyNewsSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
  },
});