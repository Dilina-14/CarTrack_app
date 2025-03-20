import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";

// Define the type for the news item
type NewsItemProps = {
  newsId: string;
  title: string;
  date: string;
  author: string;
  distance?: string;
  imageUri: string;
};

const NewsCard = ({ title, date, author, distance, imageUri, newsId }: NewsItemProps) => {
  const router = useRouter();

  const handleNewsPress = () => {
    // Navigate to the news detail screen with the news ID
    router.push({
      pathname: "/(news)/newsdetail",
      params: { id: newsId }
    });
  };

  return (
    <TouchableOpacity style={styles.newsCard} onPress={handleNewsPress}>
      <Image source={{ uri: imageUri }} style={styles.newsImage} />
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

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>News</Text>
        </View>

        {/* News Feed */}
        <ScrollView style={styles.newsFeed}>
          <NewsCard
            newsId="1"
            title="Super Car Meet Up"
            date="14th of November"
            author="Organized by Mr.Dilino"
            distance="235 km"
            imageUri="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          />
          <NewsCard
            newsId="2"
            title="Sri Lanka To Ease Vehicle Import Restrictions"
            date="posted on 18/11/2024"
            author="Author Sara Eddings"
            imageUri="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
          />
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} onPress={() => router.push("/(news)/addnews")}>
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
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
});