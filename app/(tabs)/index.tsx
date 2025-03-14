import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  CurrencyDollar,
  ShoppingCart,
  Newspaper,
  BookOpen,
  Receipt,
  Car,
  GasPump,
  FileText
} from "phosphor-react-native";
import { colors } from "@/constants/theme";
import { router } from "expo-router";

// Expense 
const ExpenseList = () => {
  
  const expenseItems = [
    {
      id: '1',
      title: 'Vehicle Insurance',
      description: 'Description',
      amount: 'LKR.4200.00',
      iconName: 'FileText',
      bgColor: '#2E90FA',
    },
    {
      id: '2',
      title: 'Vehicle Management',
      description: 'Brake pad check',
      amount: 'LKR.400.00',
      iconName: 'Car',
      bgColor: '#C6FF66',
    },
    {
      id: '3',
      title: 'Fuel',
      description: 'Ioc Shed',
      amount: 'LKR.6000.00',
      iconName: 'Gas',
      bgColor: '#F04438',
    },
    {
      id: '4',
      title: 'Vehicle Management',
      description: 'Brake pad check',
      amount: 'LKR.400.00',
      iconName: 'Car',
      bgColor: '#C6FF66',
    },
    {
      id: '5',
      title: 'Vehicle Insurance',
      description: 'Description',
      amount: 'LKR.4200.00',
      iconName: 'FileText',
      bgColor: '#2E90FA',
    },
    
  ];

  
  const renderIcon = (iconName: string, color: string) => {
    switch(iconName) {
      case 'FileText':
        return <FileText size={32} color="white" weight="duotone" />;
      case 'Car':
        return <Car size={32} color="white" weight="duotone" />;
      case 'Gas':
        return <GasPump size={32} color="white" weight="duotone" />;
      default:
        return <FileText size={32} color="white" weight="duotone" />;
    }
  };

  return (
    <View style={styles.expenseListContainer}>
      <ScrollView 
        style={styles.expenseScrollView}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.expenseScrollContent}
      >
        {[...expenseItems].reverse().map((item) => (
          <View key={item.id} style={styles.expenseItem}>
            <View style={styles.expenseIconSection}>
              <View style={[styles.expenseIconBg, { backgroundColor: item.bgColor }]}>
                {renderIcon(item.iconName, 'white')}
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseDescription}>{item.description}</Text>
              </View>
            </View>
            <Text style={styles.expenseAmount}>{item.amount}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const ExpenseGraph = () => {
  
  const barData = [
    { value: 15.3, key: "1" },
    { value: 17.8, key: "2" },
    { value: 12.4, key: "3" },
    { value: 20.1, key: "4" },
    { value: 14.9, key: "5" },
    { value: 18.2, key: "6" },
    { value: 22.3, key: "7" },
  ];

  const maxValue = Math.max(...barData.map((item) => item.value));

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Fuel Expense</Text>

      {/* Graph */}
      <View style={styles.chartArea}>
        <View style={styles.yAxisLabels}>
          <Text style={styles.axisLabel}>23.1k</Text>
          <Text style={styles.axisLabel}>20.2k</Text>
          <Text style={styles.axisLabel}>15.3k</Text>
          <Text style={styles.axisLabel}>10.5k</Text>
        </View>

        <View style={styles.chartContent}>
          {/* Horizontal grid lines */}
          {[0, 1, 2, 3].map((_, index) => (
            <View key={`line-${index}`} style={styles.gridLine} />
          ))}

          {/* Bars */}
          <View style={styles.barsContainer}>
            {barData.map((item) => (
              <View key={item.key} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(item.value / maxValue) * 80}%`,
                      backgroundColor: "#C6FF66",
                    },
                  ]}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Expense Summary */}
      <View style={styles.expenseSummary}>
        <View>
          <Text style={styles.expenseLabel}>Total Expenditure</Text>
          <Text style={styles.expenseValue}>LKR.56,699</Text>
        </View>

        <View>
          <Text style={styles.expenseLabel}>Average Daily Spending</Text>
          <Text style={styles.expenseValue}>LKR.769.42</Text>
        </View>
      </View>
    </View>
  );
};

const index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good Evening, Steve</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <TouchableOpacity  onPress={() => router.push("/(MainScreens)/addCost")}>
            <View style={[styles.iconContainer, { borderColor: "#C6FF66" }]}>
              <CurrencyDollar size={43} color="#C6FF66" weight="bold" />
              <Text style={[styles.iconText, { color: "#C6FF66" }]}>
                Add Cost
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={[styles.iconContainer, { borderColor: "#F91115" }]}>
              <ShoppingCart size={43} color="#F91115" weight="bold" />
              <Text style={[styles.iconText, { color: "#F91115" }]}>Shop</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={[styles.iconContainer, { borderColor: "#1570EF" }]}>
              <BookOpen size={43} color="#1570EF" weight="bold" />
              <Text style={[styles.iconText, { color: "#1570EF" }]}>
                Reports
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(tabs)/news")}>
            <View style={[styles.iconContainer, { borderColor: "#A020F0" }]}>
              <Newspaper size={43} color="#A020F0" weight="bold" />
              <Text style={[styles.iconText, { color: "#A020F0" }]}>News</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <ExpenseGraph />

        <ExpenseList />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    color: colors.primary,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  iconContainer: {
    width: 105,
    height: 105,
    borderRadius: 20,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  iconText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },

  // Graph 
  graphContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 15,
    marginBottom:15
  },
  graphTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  chartArea: {
    height: 100,
    flexDirection: "row",
    marginBottom: 20,
  },
  yAxisLabels: {
    width: 50,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 5,
  },
  axisLabel: {
    color: "#888",
    fontSize: 12,
  },
  chartContent: {
    flex: 1,
    position: "relative",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#333",
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  bar: {
    width: 15,
    borderRadius: 10,
  },
  expenseSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 15,
  },
  expenseLabel: {
    color: colors.primary,
    fontSize: 14,
    marginBottom: 5,
  },
  expenseValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  //exp
  expenseListContainer: {
    marginHorizontal: 20,
    height: 400, // Fixed height for the scrollable container
  },
  expenseScrollView: {
    flex: 1,
  },
  expenseScrollContent: {
    paddingVertical: 5,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    marginBottom: 12,
  },
  expenseIconSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIconBg: {
    width: 55,
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expenseDetails: {
    marginLeft: 15,
  },
  expenseTitle: {
    color: 'white',
    fontSize: 15,
    width:"75%",
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expenseDescription: {
    color: '#888',
    fontSize: 14,
  },
  expenseAmount: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },

});

export default index;
