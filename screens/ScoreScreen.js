// ScoreScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text,TouchableOpacity, StyleSheet } from 'react-native';

TouchableOpacity

const questions = require('../assets/questions.json');

const ScoreScreen = ({ navigation, route }) => { 
  const { questionState } = route.params;

  const [score, setScore] = useState(0);

  useEffect(() => {
    const newScore = questionState.reduce((acc, question, index) => {
      // Ottieni gli indici selezionati dall'utente
      const selectedIndices = question.selectedOptions.reduce((indices, isSelected, index) => {
        if (isSelected) {
          indices.push(index);
        }
        return indices;
      }, []);

      // Ottieni gli indici corretti dalla risposta
      const correctIndices = questions[index].RISPOSTA;

      // Verifica se gli indici selezionati corrispondono agli indici corretti della risposta
      const isCorrect =
        selectedIndices.length === correctIndices.length &&
        selectedIndices.every((index) => correctIndices.includes(index));

      // Aggiorna lo score
      return isCorrect ? acc + 1 : acc;
    }, 0);

    setScore(newScore);
  }, [questionState]);

  const totalQuestions = questionState.length;
  const correctPercentage = ((score / totalQuestions) * 100).toFixed(2);

  let comment = '';
  if (correctPercentage <= 30) {
    comment = 'Ti si frega pure non volendo!';
  } else if (correctPercentage > 30 && correctPercentage <= 70) {
    comment = 'Fai occhio!';
  } else {
    comment = 'Bravo! Potresti darti alla creazione di fake news!';
  }

  const handleShowSolution = () => {
    // Naviga a SolutionScreen passando l'array questionState
    navigation.navigate('Soluzione', { questionState });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>
        Punteggio: {score}/{totalQuestions}
      </Text>
      <Text style={styles.commentText}>{comment}</Text>
      <TouchableOpacity
        style={styles.solutionButton}
        onPress={handleShowSolution}
      >
        <Text style={styles.buttonText}>Visualizza Soluzioni</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  scoreText: {
    fontSize: 24,
    color: '#000099',
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 18,
    color: '#000099',
    marginBottom: 10,
  },
  commentText: {
    fontSize: 16,
    color: '#000099',
  },
  buttonText: {
    fontSize: 18,
    color: 'white', // Testo bianco
  },
  solutionButton: {
    backgroundColor: '#000099',
    borderColor: '#000099',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 10,
  }
});

export default ScoreScreen;



