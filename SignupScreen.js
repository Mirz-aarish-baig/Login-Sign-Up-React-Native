import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../config/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Svg, { Path, Circle } from 'react-native-svg';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    if (email && password && confirmPassword && cnic) {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (cnic.length !== 13 || isNaN(cnic)) {
        Alert.alert('Error', 'Please enter a valid 13-digit CNIC number');
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        await setDoc(doc(db, 'users', userId), {
          email,
          cnic,
          createdAt: serverTimestamp(),
        });

        Alert.alert('Success', 'Account created successfully');
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.background}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
              <Path d="M0 0 L100 0 L100 100 L0 100 Z" fill="#006600" />
              <Circle cx="50" cy="50" r="20" fill="#ffffff" />
              <Path d="M55 50 L65 45 L65 55 Z" fill="#ffffff" />
            </Svg>
          </View>
          <View style={styles.form}>
            <Text style={styles.title}>Register</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#cccccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#cccccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#cccccc"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="CNIC Number (13 digits)"
              placeholderTextColor="#cccccc"
              value={cnic}
              onChangeText={setCnic}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#006600',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006600',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  form: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006600',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#006600',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#006600',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleButton: {
    marginTop: 20,
  },
  toggleText: {
    color: '#006600',
    fontSize: 14,
  },
});
