import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const Welcome = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/(tabs)");
    }, 1500);
  }, []);


  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.SignInButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Typo fontWeight={"500"}>Log In</Typo>
          </TouchableOpacity>

          <Image
            source={require("../../assets/images/splashImage.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
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
    width: "100%",
    height: verticalScale(150),
    alignSelf: "center",
    marginTop: verticalScale(200),
  },
});
