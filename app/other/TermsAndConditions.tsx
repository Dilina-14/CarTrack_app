import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useNavigation } from "expo-router";

const TermsAndConditions = () => {
    // Get the navigation object
    const navigation = useNavigation();
    
    return (
        <ScreenWrapper>
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Terms and Conditions</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Effective Date: [Insert Date]</Text>
                    <Text style={styles.paragraph}>Welcome to CarTrackApp! By accessing or using our application, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.</Text>

                    <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.paragraph}>By using CarTrackApp, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please refrain from using our services.</Text>

                    <Text style={styles.sectionTitle}>2. Services Provided</Text>
                    <Text style={styles.paragraph}>CarTrackApp provides features including but not limited to:</Text>
                    <Text style={styles.listItem}>- Real-time vehicle tracking</Text>
                    <Text style={styles.listItem}>- Service history management</Text>
                    <Text style={styles.listItem}>- Fines and loans tracking</Text>
                    <Text style={styles.listItem}>- Insurance and license renewal reminders</Text>
                    <Text style={styles.listItem}>- Fuel cost tracking and vehicle maintenance logs</Text>
                    <Text style={styles.listItem}>- Marketplace for vehicle-related transactions</Text>
                    <Text style={styles.listItem}>- Online bidding and valuation tools</Text>

                    <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
                    <Text style={styles.paragraph}>You must provide accurate and current information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and agree not to misuse the app for illegal activities.</Text>

                    <Text style={styles.sectionTitle}>4. Privacy Policy</Text>
                    <Text style={styles.paragraph}>Your use of CarTrackApp is also governed by our Privacy Policy, which explains how we collect, store, and use your data. Please review it carefully.</Text>

                    <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
                    <Text style={styles.paragraph}>All content, trademarks, and features in CarTrackApp are owned by or licensed to us. You may not copy, modify, distribute, or exploit any part of our services without our prior written consent.</Text>

                    <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
                    <Text style={styles.paragraph}>We strive to provide accurate and reliable information, but we do not guarantee the accuracy, completeness, or timeliness of the data provided. We are not liable for any losses or damages resulting from the use of our app.</Text>

                    <Text style={styles.sectionTitle}>7. Third-Party Services</Text>
                    <Text style={styles.paragraph}>CarTrackApp may include links to third-party services. We do not endorse or take responsibility for any third-party content, services, or transactions.</Text>

                    <Text style={styles.sectionTitle}>8. Termination</Text>
                    <Text style={styles.paragraph}>We reserve the right to suspend or terminate your access to CarTrackApp at any time if you violate these Terms or engage in fraudulent or harmful activities.</Text>

                    <Text style={styles.sectionTitle}>9. Modifications to Terms</Text>
                    <Text style={styles.paragraph}>We may update these Terms from time to time. Continued use of CarTrackApp after changes constitute acceptance of the updated Terms.</Text>

                    <Text style={styles.sectionTitle}>10. Governing Law</Text>
                    <Text style={styles.paragraph}>These Terms shall be governed by and interpreted under the laws of Sri Lanka. Any disputes arising from the use of CarTrackApp shall be resolved in accordance with the jurisdiction of Sri Lanka.</Text>

                    <Text style={styles.sectionTitle}>11. Contact Information</Text>
                    <Text style={styles.paragraph}>For any questions or concerns regarding these Terms, please contact us at:</Text>
                    <Text style={styles.listItem}>Email: cartrackapp0@gmail.com [Insert Email]</Text>
                    <Text style={styles.listItem}>Website: [https://www.cartrackapp.online](https://www.cartrackapp.online)</Text>
                </ScrollView>
            </SafeAreaView>
        </ScreenWrapper>
    );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 40,
    },
    contentContainer: {
        paddingBottom: 100,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 15,
    },
    headerText: {
        color: '#C6FF66',
        fontSize: 22,

    },
    sectionTitle: {
        color: '#C6FF66',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 15,
    },
    paragraph: {
        color: 'white',
        fontSize: 16,
        lineHeight: 24,
    },
    listItem: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
        lineHeight: 24, 
        marginTop: 2, 
    },
});