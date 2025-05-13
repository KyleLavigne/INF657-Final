import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AuthContext } from '../contexts/AuthContext';
import TransactionItem from '../components/TransactionItem';
import Layout from '../components/Layout';

export default function TransactionListScreen({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [filterMonth, setFilterMonth] = useState('all'); // 'all' or 'month'
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const q = query(
      collection(db, 'users', user.uid, 'transactions'),
      orderBy('date', 'desc')
    );
    const unsub = onSnapshot(q, snapshot => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filteredData = filterMonth === 'month'
        ? allData.filter(txn => {
            const d = txn.date?.toDate?.();
            const now = new Date();
            return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
        : allData;

      setTransactions(filteredData);
    });

    return () => unsub();
  }, [filterMonth]);

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
    } catch (err) {}
  };

  return (
    <Layout>
      <View style={styles.topControls}>
        <Button title="Search" onPress={() => navigation.navigate('Search')} />
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterBtn, filterMonth === 'all' && styles.active]}
            onPress={() => setFilterMonth('all')}
          >
            <Text style={filterMonth === 'all' ? styles.activeText : styles.inactiveText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filterMonth === 'month' && styles.active]}
            onPress={() => setFilterMonth('month')}
          >
            <Text style={filterMonth === 'month' ? styles.activeText : styles.inactiveText}>This Month</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            item={item}
            onEdit={() => navigation.navigate('Edit', { transaction: item })}
            onDelete={() => handleDelete(item.id)}
          />
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    alignItems: 'center',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginLeft: 6,
  },
  active: {
    backgroundColor: '#2196F3',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#333',
  },
});
