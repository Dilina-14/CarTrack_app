import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, SafeAreaView, ScrollView, Switch } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingX } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useTailwind } from 'tailwind-rn';
import { Ionicons } from '@expo/vector-icons';

const settings = () => {
    const router = useRouter();
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

    const tw = useTailwind();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
    const toggleSwitch = () => setNotificationsEnabled(previousState => !previousState);

    // Update dimensions on orientation changes
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
            setScreenHeight(window.height);
        });
        return () => subscription?.remove();
    }, []);

    const menuWidth = screenWidth * 0.9 > 368 ? 368 : screenWidth * 0.9;
    const fontSize = screenWidth * 0.04 > 16 ? 16 : screenWidth * 0.04;
    const switchScale = menuWidth / 368;
    const switchWidth = Math.min(51 * switchScale, 51); 
    
    return (
        <ScreenWrapper>
            <SafeAreaView style={styles.container}>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <View style={styles.menuOptions}>
                        {/* Notification menu item with toggle switch */}
                        <View style={[styles.menuItem, { width: menuWidth }]}>
                            <View style={styles.iconTextContainer}>
                                <Ionicons name="notifications-outline" size={24} color="white" />
                                <Text style={[styles.menuText, { fontSize: fontSize }]}>Notification</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: "#4CAF50" }}
                                thumbColor={notificationsEnabled ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={notificationsEnabled}
                                style={{
                                    transform: [
                                        { scaleX: Math.min(switchScale * 1.5, 1.3) }, 
                                        { scaleY: Math.min(switchScale * 1.5, 1.3) }
                                    ] 
                                }}
                            />
                        </View>
                        
                        <TouchableOpacity style={[styles.menuItem, { width: menuWidth }]}>
                            <View style={styles.iconTextContainer}>
                                <Ionicons name="share-social-outline" size={24} color="white" />
                                <Text style={[styles.menuText, { fontSize: fontSize }]}>Share App</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.menuItem, { width: menuWidth }]}>
                            <View style={styles.iconTextContainer}>
                                <Ionicons name="document-text-outline" size={24} color="white" />
                                <Text style={[styles.menuText, { fontSize: fontSize }]}>Terms and Conditions</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.menuItem, { width: menuWidth }]}>
                            <View style={styles.iconTextContainer}>
                                <Ionicons name="chatbox-outline" size={24} color="white" />
                                <Text style={[styles.menuText, { fontSize: fontSize }]}>Feedback</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={[styles.menuItem, { width: menuWidth }]}>
                            <View style={styles.iconTextContainer}>
                                <Ionicons name="mail-outline" size={24} color="white" />
                                <Text style={[styles.menuText, { fontSize: fontSize }]}>Contact</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuItem, { width: menuWidth }]} onPress={() => router.push("/(auth)/login")}>
                            <View style={styles.iconTextContainer}>
                                <Ionicons name="log-out-outline" size={24} color="white" />
                                <Text style={[styles.menuText, { fontSize: fontSize }]}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ScreenWrapper>
    );
};

export default settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212', 
        marginTop: 40,
    },
    menuOptions: {
        marginTop: '10%',
        alignItems: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', 
        backgroundColor: '#1E1E1E',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        height: 61,
        marginBottom: 22,
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        color: 'white',
        marginLeft: 15,
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', 
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingVertical: 15,
        width: '100%', 
        position: 'absolute', 
        bottom: 0, 
    },      
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    activeTab: {
        borderTopWidth: 2,
        borderTopColor: '#4CAF50',
        paddingTop: 13,
    },
});