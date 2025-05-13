import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function SummaryCard() {
  const { user } = useContext(AuthContext);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users', user.uid, 'transactions'), snapshot => {
      let totalIncome = 0;
      let totalExpense = 0;

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const amount = parseFloat(data.amount);
        if (data.type === 'income') totalIncome += amount;
        else if (data.type === 'expense') totalExpense += amount;
      });

      setIncome(totalIncome);
      setExpense(totalExpense);
    });

    return () => unsub();
  }, []);

  const balance = income - expense;

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Summary</Text>
      <Text style={styles.income}>Income: ${income.toFixed(2)}</Text>
      <Text style={styles.expense}>Expenses: ${expense.toFixed(2)}</Text>
      <Text style={styles.balance}>Balance: ${balance.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    margin: 10,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  income: {
    color: 'green',
    fontSize: 16,
  },
  expense: {
    color: 'red',
    fontSize: 16,
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
});
