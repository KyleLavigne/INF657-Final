import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy, limit, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

import { auth, db } from '../utils/firebase';
import { AuthContext } from '../contexts/AuthContext';

import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import Chart from '../components/Chart';
import Layout from '../components/Layout';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [recentTransactions, setRecentTransactions] = useState([]);


  useEffect(() => {
    const q = query(
      collection(db, 'users', user.uid, 'transactions'),
      orderBy('date', 'desc'),
      limit(5)
    );
    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentTransactions(data);
    });

    return () => unsub();
  }, []);

  const handleDelete = async (id) => {
    if (!id) {
      Alert.alert('Error', 'Transaction ID is missing.');
      return;
    }

    try {
      const ref = doc(db, 'users', user.uid, 'transactions', id);
      await deleteDoc(ref);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.container}>
        <SummaryCard />
        <Chart />

        <View style={styles.headerRow}>
          <Text style={styles.header}>Recent Transactions</Text>
          <Button title="View All" onPress={() => navigation.navigate('TransactionList')} />
        </View>

        {recentTransactions.map((item) => (
          <TransactionItem
            key={item.id}
            item={item}
            onEdit={() => navigation.navigate('Edit', { transaction: item })}
            onDelete={() => handleDelete(item.id)}
          />
        ))}

        <View style={styles.buttonGroup}>
          <Button title="Add Transaction" onPress={() => navigation.navigate('Add')} />
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 30,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonGroup: {
    marginTop: 20,
  },
});
