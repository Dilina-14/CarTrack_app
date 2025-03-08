import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
    useEffect(() => {
      const timeout = setTimeout(() => {
        router.push("/(tabs)");
      }, 1500);
    }, []);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.SignInButton}>
            <Typo fontWeight={"500"}>Sign In</Typo>
          </TouchableOpacity>

          <Image source={require("../../assets/images/splashImage.png")}
          style={styles.welcomeImage} 
          resizeMode="contain"/>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },

  SignInButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },

  welcomeImage: {
    width:"100%",
    height: verticalScale(150),
    alignSelf:"center",
    marginTop:verticalScale(200)

  }
});
