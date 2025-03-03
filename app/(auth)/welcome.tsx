import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";

const Welcome = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.SignInButton}>
            <Typo fontWeight={"500"}>Sign Bye tessst</Typo>
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
