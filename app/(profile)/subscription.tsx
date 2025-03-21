import { StyleSheet, Text,View, Dimensions, SafeAreaView, ScrollView, TouchableOpacity,StatusBar} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";
import { useTailwind } from 'tailwind-rn';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";


const Subscription = () => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const navigation = useNavigation();
  
  const tw = useTailwind();

  // Update dimensions on orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
      setScreenHeight(window.height);
    });
    return () => subscription?.remove();
  }, []);

  const cardWidth = screenWidth * 0.85 > 380 ? 380 : screenWidth * 0.85;
  const fontSize = screenWidth * 0.04 > 16 ? 16 : screenWidth * 0.04;
  const planTitleSize = Math.min(fontSize * 1.5, 24);
  
  // Feature list for both plans
  const premiumFeatures = [
    "Cost Management",
    "Marketplace",
    "Online Bidding System",
    "Event Notifier",
    "Add News",
    "Unlimited Chats in Chatbot",
    "Remove Ads",
    "Full Detailed Vehicle Reports"
];

const normalFeatures = [
    "Cost Management",
    "Marketplace",
    "Online Bidding System",
    "Event Notifier"
];


  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        {/* Header with menu icon */}
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.pageTitle, { fontSize: planTitleSize * 1.1, width: cardWidth }]}>
            <TouchableOpacity style={[styles.arrow, { }]} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            Subscription Plan
          </Text>
          
          {/* Free Plan Card */}
          <TouchableOpacity
            onPress={() => setSelectedPlan("free")}
            activeOpacity={0.8}
            style={{ width: cardWidth }}
          >
            <View 
              style={[
                styles.planCard, 
                selectedPlan === "free" ? { borderWidth: 4, borderColor: "#6c6c6c" } : {}
              ]}
            >
              <Text style={[styles.planTitle, { fontSize: planTitleSize }]}>FREE</Text>
              
              {normalFeatures.map((normalFeatures, index) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={[styles.featureText, { fontSize }]}>{normalFeatures}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
          
          {/* Premium Plan Card */}
          <TouchableOpacity
            onPress={() => setSelectedPlan("premium")}
            activeOpacity={0.8}
            style={{ width: cardWidth, marginTop: 20 }}
          >
            <LinearGradient
              colors={selectedPlan === "premium" 
                ? ['rgba(198, 255, 102, 0.3)', 'rgba(198, 255, 102, 0.1)'] 
                : ['rgba(199, 255, 102, 0.46)', 'rgba(198, 255, 102, 0.05)']}
              style={[
                styles.planCard,
                styles.premiumCard,
                selectedPlan === "premium" ? { borderWidth: 4, borderColor: "#C6FF66",borderRadius: 22 } : {}
              ]}
            >
              <Text style={[styles.planTitle, styles.premiumTitle, { fontSize: planTitleSize }]}>
                Premium Plan
              </Text>
              
              {premiumFeatures.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Text style={[styles.featureText, styles.premiumFeatureText, { fontSize }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    marginTop: 30,
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: "center",
  },
  pageTitle: {
    color: "#C6FF66",
    fontWeight: "700",
    marginBottom: 20,
    marginRight: 30,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
  },
  arrow: {
    marginRight:30,
  },
  planCard: {
    backgroundColor: "#333333",
    borderRadius: 20,
    padding: 20,
    width: "100%",
  },
  premiumCard: {
    backgroundColor: "transparent",
  },
  planTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 15,
  },
  premiumTitle: {
    color: "#C6FF66",
  },
  featureRow: {
    marginVertical: 6,
  },
  featureText: {
    color: "white",
  },
  premiumFeatureText: {
    color: "white",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 15,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#C6FF66",
    paddingTop: 13,
  },
});