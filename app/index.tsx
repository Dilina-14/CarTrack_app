import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "react-native";


const index = () => {
  
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/(auth)/welcome");
    }, 1500);
  }, []);

  return (
    
    <View style={styles.container}>
      <StatusBar
        backgroundColor="black"
        barStyle="light-content"
        translucent={false}
      />
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/splashImage.png")}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },

  logo: {
    height: "50%",
    aspectRatio: 0.5,
  },
});
