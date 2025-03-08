import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import { useIsFocused, useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import index from "@/app";
import * as Icons from 'phosphor-react-native';

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {

    const tabbarIcons: any = {
        index: (isFocused : boolean) => (
            <Icons.House
                size={verticalScale(30)}
                weight={isFocused? "fill" : "regular" }
                color={isFocused? colors.primary : colors.white }
            />
        ),
        
        news: (isFocused : boolean) => (
            <Icons.Book
                size={verticalScale(30)}
                weight={isFocused? "fill" : "regular" }
                color={isFocused? colors.primary : colors.white }
            />
        ),

        marketplace: (isFocused : boolean) => (
            <Icons.ShoppingCart
                size={verticalScale(30)}
                weight={isFocused? "fill" : "regular" }
                color={isFocused? colors.primary : colors.white }
            />
        ),

        profile: (isFocused : boolean) => (
            <Icons.User
                size={verticalScale(30)}
                weight={isFocused? "fill" : "regular" }
                color={isFocused? colors.primary : colors.white }
            />
        ),
    }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            //href={buildHref(route.name, route.params)}
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {
                tabbarIcons[route.name] && tabbarIcons[route.name] (isFocused)
            }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create ({
    tabbar : {
        flexDirection: "row", 
        width: "100%", 
        height: verticalScale(70),
        backgroundColor: colors.primaryDark,
        alignItems:"center",
        justifyContent:"space-around",
        borderTopColor:colors.black,
        borderTopWidth:1,
    },

    tabbarItem: {
        marginBottom: spacingY._5,
        justifyContent:"center",
        alignItems: "center"

    }
})