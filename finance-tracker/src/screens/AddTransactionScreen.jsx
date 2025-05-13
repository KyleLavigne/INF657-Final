import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AuthContext } from '../contexts/AuthContext';
import {
  incomeCategories,
  expenseCategories,
  incomeCategoryIcons,
  expenseCategoryIcons,
} from '../data/categories';
import Layout from '../components/Layout';

export default function AddTransactionScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');

  const handleAdd = async () => {
    if (!amount || !note || !category) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'transactions'), {
        type,
        amount,
        note: category,
        description: note,
        date: new Date(date),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const availableCategories =
    type === 'expense' ? expenseCategories : incomeCategories;
  const currentIcons =
    type === 'expense' ? expenseCategoryIcons : incomeCategoryIcons;

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.title}>Add Transaction</Text>

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.active]}
            onPress={() => {
              setType('expense');
              setCategory('');
            }}
          >
            <Text style={type === 'expense' ? styles.activeText : styles.inactiveText}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.active]}
            onPress={() => {
              setType('income');
              setCategory('');
            }}
          >
            <Text style={type === 'income' ? styles.activeText : styles.inactiveText}>Income</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
          >
            <Picker.Item label="-- Select Category --" value="" />
            {availableCategories.map((cat) => (
  <Picker.Item
    key={cat}
    label={`${currentIcons[cat] || '❓'} ${cat}`}
    value={cat}
    color="#000" // Force visible text color
  />
))}

          </Picker>
        </View>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder="Description"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />

        <Button title="Add Transaction" onPress={handleAdd} />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  typeButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 8,
  },
  active: {
    backgroundColor: '#2196F3',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#000',
  },
});
