import React from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <View style={styles.wrapper}>
      <Navbar />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 56,
  },
});
