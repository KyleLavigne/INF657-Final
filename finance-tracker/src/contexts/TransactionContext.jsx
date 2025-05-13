import React, { createContext, useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'transactions'), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions }}>
      {children}
    </TransactionContext.Provider>
  );
};
