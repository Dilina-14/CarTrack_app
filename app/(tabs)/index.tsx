import React from "react";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable
} from "react-native";
import {
  CurrencyDollar,
  ShoppingCart,
  Newspaper,
  BookOpen,
  Receipt,
  Car,
  GasPump,
  FileText,
  Wrench,
  Trash,
  X
} from "phosphor-react-native";
import { colors } from "@/constants/theme";
import { router } from "expo-router";

import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { app } from "../../firebaseAuth"; // Adjust the path to your Firebase config file


// Define the type for expense items
type ExpenseItem = {
  id: string; // Firestore document ID
  category: string;
  date: string;
  amount: string;
  note: string;
};
// Expense List Component
const ExpenseList = () => {
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userId = user.uid;

    // Fetch expenses from Firestore
    const db = getFirestore(app);
    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, where("userId", "==", userId)); // Filter by user ID

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses: ExpenseItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        expenses.push({
          id: doc.id, // Use Firestore document ID
          category: data.category,
          date: data.date,
          amount: data.amount.toString(),
          note: data.note,
        });
      });
      setExpenseItems(expenses);
    });

    // Removed redundant fetchExpenses() call
    return () => unsubscribe();
  }, []);

  const handleExpensePress = (expense: ExpenseItem) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const db = getFirestore(app);
      await deleteDoc(doc(db, "expenses", id)); // Delete the document by ID
      console.log("Expense deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const renderIcon = (iconName: string, size: number = 32) => {
    switch (iconName) {
      case "Fuel":
        return <GasPump size={size} color="white" weight="duotone" />;
      case "Maintenance":
        return <Car size={size} color="white" weight="duotone" />;
      case "Insurance":
        return <Receipt size={size} color="white" weight="duotone" />;
      case "Repair":
        return <Wrench size={size} color="white" weight="duotone" />;
      case "Other":
        return <FileText size={size} color="white" weight="duotone" />;
      default:
        return <FileText size={size} color="white" weight="duotone" />;
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
        {expenseItems.length === 0 ? (
          // Display this message when the list is empty
          <Text style={styles.instructionText}>No expenses in the list</Text>
        ) : (
          [...expenseItems].reverse().map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => handleExpensePress(item)}
              onLongPress={() => handleDeleteExpense(item.id)} // Pass the unique id
            >
              <View style={styles.expenseItem}>
                {/* Icon and Details */}
                <View style={styles.expenseIconSection}>
                  <View
                    style={[
                      styles.expenseIconBg,
                      {
                        backgroundColor:
                          item.category === "Fuel"
                            ? "#F91115"
                            : item.category === "Insurance"
                            ? "#2E90FA"
                            : item.category === "Repair"
                            ? "#A020F0"
                            : item.category === "Maintenance"
                            ? "#74B520"
                            : "#6D6D6D", // Default for "Other"
                      },
                    ]}
                  >
                    {renderIcon(item.category)}
                  </View>
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseTitle}>{item.category}</Text>
                    <Text style={styles.expenseDescription}>
                      {item.note.length > 15
                        ? `${item.note.slice(0, 12)}...`
                        : item.note}
                    </Text>
                  </View>
                </View>

                {/* Amount */}
                <View style={styles.expenseAmountContainer}>
                  <Text style={styles.expenseAmount}>
                    {`LKR.${parseFloat(item.amount).toFixed(2).length > 12
                      ? `${parseFloat(item.amount).toFixed(2).slice(0, 11)}...`
                      : parseFloat(item.amount).toFixed(2)}`}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))
        )}

      </ScrollView>
      
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)} // Close modal when background is touched
      >
        <View style={styles.modalOverlay}>
          {/* Background Pressable */}
          <Pressable
            style={styles.modalOverlayPressable}
            onPress={() => setModalVisible(false)} // Close modal on background press
          />

          {/* Close Icon */}
          <Pressable
            style={styles.closeIcon}
            onPress={() => setModalVisible(false)} // Close modal when "X" is pressed
          >
            <X size={24} color="white" weight="bold" /> {/* Close Icon */}
          </Pressable>

          {/* Modal Content */}
          <View style={styles.modalContainer}>
            {selectedExpense && (
              <ScrollView
                contentContainerStyle={styles.modalScrollContent}
                nestedScrollEnabled={true} // Allow nested scrolling
              >
                {/* Icon and Details */}
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalIcon,
                      {
                        backgroundColor:
                          selectedExpense.category === "Fuel"
                            ? "#F91115"
                            : selectedExpense.category === "Insurance"
                            ? "#2E90FA"
                            : selectedExpense.category === "Repair"
                            ? "#A020F0"
                            : selectedExpense.category === "Maintenance"
                            ? "#74B520"
                            : "#6D6D6D", // Default for "Other"
                      },
                    ]}
                  >
                    {renderIcon(selectedExpense.category, 45)} {/* Pass size 45 */}
                  </View>
                  <View style={styles.modalDetails}>
                    <Text style={styles.modalDetailText}>
                      Category : {selectedExpense.category}
                    </Text>
                    <Text style={styles.modalDetailText}>
                      Date     : {selectedExpense.date}
                    </Text>
                    <Text style={styles.modalDetailText}>
                      Amount   : LKR.{parseFloat(selectedExpense.amount).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Separator Line */}
                <View style={styles.modalSeparator} />

                {/* Note/Description */}
                <Text style={styles.modalDescription}>
                  {selectedExpense.note || "No description available"}
                </Text>

                {/* Delete Button */}
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    handleDeleteExpense(selectedExpense.id); // Delete the selected expense
                    setModalVisible(false); // Hide the modal
                  }}
                >
                  <Trash size={24} color="white" weight="bold" /> {/* Trash Icon */}
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ExpenseGraph = () => {
  const [fuelExpenses, setFuelExpenses] = useState<number[]>([]);
  const [totalExpenditure, setTotalExpenditure] = useState<number>(0);
  const [averageDailySpending, setAverageDailySpending] = useState<number>(0);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const userId = user.uid;

    // Fetch fuel expenses from Firestore
    const db = getFirestore(app);
    const expensesRef = collection(db, "expenses");
    const q = query(
      expensesRef,
      where("userId", "==", userId),
      where("category", "==", "Fuel") // Filter by fuel expenses
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses: number[] = [];
      let total = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const amount = parseFloat(data.amount);
        expenses.push(amount);
        total += amount;
      });

      setFuelExpenses(expenses);
      setTotalExpenditure(total);


      const days = 30; // 30 day per month
      const average = total / days;
      setAverageDailySpending(average);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Generate bar data for the graph
  const barData = fuelExpenses.map((amount, index) => ({
    value: amount,
    key: index.toString(),
  }));

  const maxValue = Math.max(...barData.map((item) => item.value), 1); // Ensure maxValue is at least 1

  return (
    <View style={styles.graphContainer}>
      <Text style={styles.graphTitle}>Fuel Expense - Monthly</Text>

      {/* Graph */}
      <View style={styles.chartArea}>
        <View style={styles.yAxisLabels}>
          <Text style={styles.axisLabel}>{maxValue.toFixed(1)}k</Text>
          <Text style={styles.axisLabel}>{(maxValue * 0.75).toFixed(1)}k</Text>
          <Text style={styles.axisLabel}>{(maxValue * 0.5).toFixed(1)}k</Text>
          <Text style={styles.axisLabel}>{(maxValue * 0.25).toFixed(1)}k</Text>
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
          <Text style={styles.expenseValue}>LKR.{totalExpenditure.toFixed(2)}</Text>
        </View>

        <View>
          <Text style={styles.expenseLabel}>Average Daily Spending</Text>
          <Text style={styles.expenseValue}>LKR.{averageDailySpending.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const Index = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good Evening, Steve</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <TouchableOpacity onPress={() => router.push("/(MainScreens)/addCost")}>
            <View style={[styles.iconContainer, { borderColor: "#C6FF66" }]}>
              <CurrencyDollar size={43} color="#C6FF66" weight="bold" />
              <Text style={[styles.iconText, { color: "#C6FF66" }]}>
                Add Cost
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(tabs)/marketplace")}>
            <View style={[styles.iconContainer, { borderColor: "#FF474A" }]}>
              <ShoppingCart size={43} color="#FF474A" weight="bold" />
              <Text style={[styles.iconText, { color: "#FF474A" }]}>Shop</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/other/reportsPage")}>
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
    marginBottom: 15
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

  // Expense List
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
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginBottom: 12,
    position: 'relative', // Make it a reference point for absolute positioning
  },
  expenseIconSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 100,
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
    width: "auto",
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expenseDescription: {
    color: '#888',
    fontSize: 14,
  },
  expenseAmountContainer: {
    position: 'absolute',
    right: 15, // Stick to the right edge
    top: '50%', // Center vertically
    transform: [{ translateY: -10 }], // Adjust for perfect vertical alignment
    zIndex: 10, // Bring it above the description layer
  },
  expenseAmount: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  //model content
  modalScrollContent: {
    flexGrow: 1, // Allow the content to grow and be scrollable
    alignItems: "center", // Center the content horizontally
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Semi-transparent background
    justifyContent: "center", // Center the modal vertically
    alignItems: "center", // Center the modal horizontally
  },
  modalOverlayPressable: {
    ...StyleSheet.absoluteFillObject, // Cover the entire screen
  },
  modalContainer: {
    width: 350,
    maxHeight: "80%", // Limit the height to 80% of the screen
    backgroundColor: "#1E1E1E",
    borderRadius: 30,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  modalIcon: {
    justifyContent: "center",
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  modalDetails: {
    flex: 1,
    width: "100%",
  },
  modalDetailText: {
    fontFamily: 'monospace',
    color: "white",
    fontSize: 13,
    marginBottom: 5,
    paddingLeft: 15,
    paddingVertical: 4,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: "#333",
    width: "100%",
    marginBottom: 10,
  },
  modalDescription: {
    fontFamily: 'monospace',
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
  },
  instructionText: {
    fontFamily: 'monospace',
    color: "#888", // Light gray color
    fontSize: 12, // Small font size
    textAlign: "center", // Center the text
    marginTop: 10, // Add some spacing above the text
  },
  deleteButton: {
    backgroundColor: "black", // Black background
    borderWidth: 2, // Thick white border
    borderColor: "white",
    borderRadius: 10,
    padding: 10, // Padding for the button
    alignSelf: "center", // Center the button horizontally
    marginTop: 20, // Add spacing above the button
    justifyContent: "center", // Center the icon vertically
    alignItems: "center", // Center the icon horizontally
  },
closeIcon: {
  position: "absolute",
  top: 10, // Position it at the top of the modal container
  right: 10, // Position it at the right of the modal container
  width: 80, // Fixed width
  height: 60, // Fixed height
  justifyContent: "center", // Center the "X" vertically
  alignItems: "center", // Center the "X" horizontally
  zIndex: 10, // Ensure it appears above the modal content
},
});
  

export default Index;