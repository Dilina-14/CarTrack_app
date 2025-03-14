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
} from "phosphor-react-native";
import { colors } from "@/constants/theme";
import { router } from "expo-router";

const ExpenseGraph = () => {
  // Sample data for the graph
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

      {/* Graph/Chart */}
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

  // Graph styles
  graphContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 20,
    paddingBottom: 15,
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
});

export default index;
