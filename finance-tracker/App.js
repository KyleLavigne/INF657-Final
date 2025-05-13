import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import { TransactionProvider } from './src/contexts/TransactionContext';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import EditTransactionScreen from './src/screens/EditTransactionScreen';
import TransactionListScreen from './src/screens/TransactionListScreen';
import SearchScreen from './src/screens/SearchScreen';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer key={user ? 'user' : 'guest'}>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Add" component={AddTransactionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Edit" component={EditTransactionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TransactionList" component={TransactionListScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Auth" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <MainNavigator />
      </TransactionProvider>
    </AuthProvider>
  );
}
