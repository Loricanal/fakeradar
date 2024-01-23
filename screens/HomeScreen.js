// HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const handleStartQuiz = () => {
    navigation.navigate('Quiz');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Logo_of_RAI_(2016).png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>FAKE RADAR</Text>
      <Text style={styles.subtitle}>Benvenuto al quiz sulla disinformazione!</Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartQuiz}
        activeOpacity={0.7} // Effetto di opacità durante il tocco
      >
        <Text style={styles.buttonText}>INIZIA</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Sfondo bianco
  },
  logo: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 30, 
    right: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000099', // Colore blu chiaro
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#000099', // Colore blu chiaro
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#000099',
    borderColor: '#000099',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white', // Testo bianco
  },
});

export default HomeScreen;
