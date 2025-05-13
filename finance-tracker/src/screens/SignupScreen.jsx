import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';



export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isStrongPassword = (pw) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(pw);
  };

  const getStrength = (pw) => {
    let strength = 0;
    if (pw.length >= 8) strength++;
    if (/[a-z]/.test(pw)) strength++;
    if (/[A-Z]/.test(pw)) strength++;
    if (/\d/.test(pw)) strength++;
    if (/[^\w\s]/.test(pw)) strength++;
    return strength;
  };

  const handleSignup = async () => {
    setSuccessMessage('');

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!isStrongPassword(password)) {
      Alert.alert(
        'Weak Password',
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setSuccessMessage('✅ Account created successfully!');
    } catch (error) {
        console.log('Signup Error:', error.code, error.message);

        let message = 'Signup failed. Please try again.';

        if (error.code === 'auth/email-already-in-use') {
            message = 'An account with this email already exists.';
        } else if (error.code === 'auth/invalid-email') {
            message = 'Please enter a valid email address.';
        } else if (error.code === 'auth/weak-password') {
            message = 'Password is too weak.';
        } else {
            message = error.message;
        }

        if (Platform.OS === 'web') {
            alert(message); // ✅ works on web
        } else {
            Alert.alert('Signup Error', message); // ✅ works on iOS/Android
        }
    }


  };

  const strength = getStrength(password);
  const strengthColor = ['#ccc', 'red', 'orange', 'yellow', 'lightgreen', 'green'][strength];
  const passwordsMatch = password === confirmPassword;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <TextInput
        style={[
          styles.input,
          confirmPassword.length > 0 && !passwordsMatch && { borderColor: 'red' }
        ]}
        placeholder="Confirm Password"
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#888"
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.toggle}>
          {showPassword ? '🙈 Hide Passwords' : '👁️ Show Passwords'}
        </Text>
      </TouchableOpacity>

      {password.length > 0 && (
        <View style={styles.strengthBarContainer}>
          <View style={[styles.strengthBar, { backgroundColor: strengthColor, width: `${(strength / 5) * 100}%` }]} />
        </View>
      )}

      {confirmPassword.length > 0 && (
        <Text style={{
          color: passwordsMatch ? 'green' : 'red',
          fontSize: 12,
          marginBottom: 10,
        }}>
          {passwordsMatch ? '✅ Passwords match' : '❌ Passwords do not match'}
        </Text>
      )}

      <Button title="Sign Up" onPress={handleSignup} />

      {successMessage !== '' && (
        <Text style={styles.success}>{successMessage}</Text>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  toggle: {
    color: '#2196F3',
    textAlign: 'right',
    marginBottom: 10,
    fontSize: 13,
  },
  strengthBarContainer: {
    height: 6,
    width: '100%',
    backgroundColor: '#eee',
    borderRadius: 4,
    marginBottom: 10,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 4,
  },
  link: {
    marginTop: 15,
    color: '#2196F3',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginTop: 15,
    textAlign: 'center',
  },
});
