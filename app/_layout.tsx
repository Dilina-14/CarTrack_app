import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import "react-native-gesture-handler"
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}></Stack>
    
  )
}

export default _layout

const styles = StyleSheet.create({})