import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

import {
  chartColors,
  expenseCategoryIcons,
  incomeCategoryIcons
} from '../data/categories';

const screenWidth = Dimensions.get('window').width;

function isSameMonth(date) {
  const now = new Date();
  const txnDate = date instanceof Date ? date : date?.toDate?.();
  return txnDate?.getMonth() === now.getMonth() && txnDate?.getFullYear() === now.getFullYear();
}

export default function Chart() {
  const { user } = useContext(AuthContext);
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState('month'); // 'month' or 'all'
  const [view, setView] = useState('expense'); // 'expense' or 'income'

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'users', user.uid, 'transactions'),
      snapshot => {
        const raw = snapshot.docs.map(doc => doc.data());

        const filtered = raw.filter(txn => txn.type === view && txn.date);
        const dataToUse = filter === 'month'
          ? filtered.filter(txn => isSameMonth(txn.date))
          : filtered;

        const summary = {};
        dataToUse.forEach(txn => {
          const category = txn.note || 'Other';
          summary[category] = (summary[category] || 0) + parseFloat(txn.amount || 0);
        });

        const formatted = Object.keys(summary || {}).map((key, i) => {
          const icon = view === 'income' ? incomeCategoryIcons?.[key] : expenseCategoryIcons?.[key];
          return {
            name: `${icon || '❓'} ${key}`,
            amount: summary[key],
            color: chartColors[i % chartColors.length] || '#ccc',
            legendFontColor: '#333',
            legendFontSize: 14,
          };
        });

        setChartData(formatted);
      });

    return () => unsub();
  }, [filter, view]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{view === 'income' ? 'Income' : 'Expenses'} by Category</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, view === 'expense' && styles.active]}
          onPress={() => setView('expense')}
        >
          <Text style={view === 'expense' ? styles.activeText : styles.inactiveText}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, view === 'income' && styles.active]}
          onPress={() => setView('income')}
        >
          <Text style={view === 'income' ? styles.activeText : styles.inactiveText}>Income</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, filter === 'month' && styles.active]}
          onPress={() => setFilter('month')}
        >
          <Text style={filter === 'month' ? styles.activeText : styles.inactiveText}>This Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, filter === 'all' && styles.active]}
          onPress={() => setFilter('all')}
        >
          <Text style={filter === 'all' ? styles.activeText : styles.inactiveText}>All Time</Text>
        </TouchableOpacity>
      </View>

      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={screenWidth - 20}
          height={220}
          chartConfig={{
            color: () => `rgba(0, 0, 0, 0.8)`,
            labelColor: () => '#000',
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="10"
          absolute
        />
      ) : (
        <Text style={styles.empty}>No {view} transactions to display.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#eee',
  },
  active: {
    backgroundColor: '#2196F3',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#555',
  },
  empty: {
    fontSize: 14,
    color: '#777',
    marginTop: 20,
  },
});
