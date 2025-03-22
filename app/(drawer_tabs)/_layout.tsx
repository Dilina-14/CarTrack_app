import { Drawer } from "expo-router/drawer";
 import { GestureHandlerRootView } from "react-native-gesture-handler";
 import { View, Text, StyleSheet } from "react-native";
 import { colors } from "@/constants/theme";
 
 // Custom Drawer Content
 import { DrawerContentComponentProps } from "@react-navigation/drawer";
 
 const CustomDrawerContent = (props: DrawerContentComponentProps) => {
   return (
     <View style={styles.drawerContainer}>
       <Text style={styles.drawerLabel}>Home</Text>
       <Text style={styles.drawerLabel}>News</Text>
       <Text style={styles.drawerLabel}>Marketplace</Text>
       <Text style={styles.drawerLabel}>Profile</Text>
     </View>
   );
 };
 
 export default function Layout() {
   return (
     <GestureHandlerRootView style={{ flex: 1 }}>
       <Drawer
         screenOptions={{
           headerShown: false, // Hide the header
           swipeEnabled: true, // Enable swipe gestures
           swipeEdgeWidth: 100, // Width of the swipeable area from the left edge
           drawerStyle: {
             backgroundColor: colors.primaryDark, // Set drawer background color to black
           },
         }}
         drawerContent={(props) => <CustomDrawerContent {...props} />}
       >
         <Drawer.Screen
           name="index" // Corresponds to app/index.tsx
           options={{
             drawerLabel: "Home",
             title: "Home",
           }}
         />
         <Drawer.Screen
           name="news" // Corresponds to app/news.tsx
           options={{
             drawerLabel: "News",
             title: "News",
           }}
         />
         <Drawer.Screen
           name="marketplace" // Corresponds to app/marketplace.tsx
           options={{
             drawerLabel: "Marketplace",
             title: "Marketplace",
           }}
         />
         <Drawer.Screen
           name="profile" // Corresponds to app/profile.tsx
           options={{
             drawerLabel: "Profile",
             title: "Profile",
           }}
         />
       </Drawer>
     </GestureHandlerRootView>
   );
 }
 
 const styles = StyleSheet.create({
   drawerContainer: {
     flex: 1,
     backgroundColor: colors.primaryDark, // Black background for the drawer
     paddingTop: 50,
     paddingHorizontal: 20,
   },
   drawerLabel: {
     color: "#FFF", // White text color
     fontSize: 16,
     marginVertical: 15,
   },
 });