import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <SafeAreaView style={[styles.navbar, colorScheme === 'dark' && styles.navbarDark]}>
      <View style={styles.innerContainer}>
        <View style={styles.left}>
          {navigation.canGoBack() && (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text  style={[styles.backButton, colorScheme === 'dark' ? styles.titleDark : styles.title]}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.title, colorScheme === 'dark' && styles.titleDark]}>
            Finance Tracker
          </Text>
        </View>

        <TouchableOpacity onPress={() => setDropdownOpen(!dropdownOpen)}>
          <Image
  source={require('../assets/profile-icon.png')}
  style={[
    styles.icon,
    { tintColor: colorScheme === 'dark' ? '#fff' : '#000' }
  ]}
/>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={[styles.dropdown, colorScheme === 'dark' && styles.dropdownDark]}>
            <TouchableOpacity onPress={handleLogout}>
              <Text
                style={[styles.dropdownItem, colorScheme === 'dark' && styles.dropdownItemDark]}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingTop: Platform.OS === 'android' ? 32 : 12,
  },
  navbarDark: {
    backgroundColor: '#333',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    fontSize: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleDark: {
    color: '#fff',
  },
  icon: {
    width: 30,
    height: 30,
  },
  dropdown: {
    position: 'absolute',
    right: 10,
    top: Platform.OS === 'web' ? 40 : 30,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
  fontSize: 20,
  marginRight: 10,
},
left: {
  flexDirection: 'row',
  alignItems: 'center',
},
icon: {
  width: 30,
  height: 30,
  borderRadius: 15,
  tintColor: Platform.OS === 'web' ? undefined : '#000', // fallback default
},
});