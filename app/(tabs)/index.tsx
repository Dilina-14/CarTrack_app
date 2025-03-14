import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { CurrencyDollar, ShoppingCart, Newspaper, BookOpen } from 'phosphor-react-native';
import { colors } from '@/constants/theme';

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good Evening, Steve</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={[styles.iconContainer, { borderColor: '#C6FF66' }]}>
          <CurrencyDollar size={48} color="#C6FF66" weight="bold" />
          <Text style={[styles.iconText, { color: '#C6FF66' }]}>Add Cost</Text>
        </View>


        <View style={[styles.iconContainer, { borderColor: '#F91115' }]}>
          <ShoppingCart size={48} color="#F91115" weight="bold" />
          <Text style={[styles.iconText, { color: '#F91115' }]}>Shop</Text>
        </View>


        <View style={[styles.iconContainer, { borderColor: '#1570EF' }]}>
          <BookOpen size={48} color="#1570EF" weight="bold" />
          <Text style={[styles.iconText, { color: '#1570EF' }]}>Reports</Text>
        </View>

        <View style={[styles.iconContainer, { borderColor: '#A020F0' }]}>
          <Newspaper size={48} color="#A020F0" weight="bold" />
          <Text style={[styles.iconText, { color: '#A020F0' }]}>News</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    paddingTop: 20,

  },
  greeting: {
    fontSize: 24,
    color: colors.primary,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 20,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default index;
