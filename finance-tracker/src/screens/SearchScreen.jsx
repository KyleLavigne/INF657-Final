import React, { useContext, useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AuthContext } from '../contexts/AuthContext';
import TransactionItem from '../components/TransactionItem';
import Layout from '../components/Layout';

export default function SearchScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users', user.uid, 'transactions'), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lower = query.toLowerCase();
      const filtered = data.filter(txn =>
        txn.note?.toLowerCase().includes(lower) ||
        txn.description?.toLowerCase().includes(lower) ||
        txn.amount?.toString().includes(lower)
      );
      setResults(filtered);
    });

    return () => unsub();
  }, [query]);

  return (
    <Layout>
      <TextInput
        placeholder="Search by description, category, or amount"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            item={item}
            onEdit={() => navigation.navigate('Edit', { transaction: item })}
            onDelete={() => {}}
          />
        )}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    margin: 10,
  },
});
