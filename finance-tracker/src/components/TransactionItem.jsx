import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { incomeCategoryIcons, expenseCategoryIcons } from '../data/categories';

export default function TransactionItem({ item, onEdit, onDelete }) {
  const isWeb = typeof window !== 'undefined' && window.confirm;

  const confirmDelete = () => {
    if (isWeb) {
      if (window.confirm('Are you sure you want to delete this transaction?')) {
        onDelete?.();
      }
    } else {
      Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]);
    }
  };

  const icon =
    item.type === 'income'
      ? incomeCategoryIcons[item.note] || '❓'
      : expenseCategoryIcons[item.note] || '❓';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.details}>
          <Text style={styles.category}>{item.note}</Text>
          <Text style={styles.description}>{item.description || 'No description'}</Text>
          <Text style={styles.date}>{item.date?.toDate().toLocaleDateString()}</Text>
        </View>
        <Text
          style={[
            styles.amount,
            { color: item.type === 'income' ? '#2e7d32' : '#c62828' },
          ]}
        >
          {item.type === 'income' ? '+' : '-'}${parseFloat(item.amount).toFixed(2)}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button title="Edit" onPress={onEdit} />
        <View style={{ width: 10 }} />
        <Button title="Delete" onPress={confirmDelete} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});
