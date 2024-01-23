// QuizScreen.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { ScrollView } from 'react-native-gesture-handler';


const questions = [
  { statement: 'Guarda il video.', type: 'video', media: require('../assets/quiz_media/video.mp4'), answer: false },
  { statement: 'Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.', type: 'image', media: require('../assets/quiz_media/1.jpg'), answer: false },
  { statement: 'Il sole è giallo.', type: 'image', media: require('../assets/quiz_media/2.jpg'), answer: true },
  { statement: 'Ascolta l\'audio.', type: 'audio', media: require('../assets/quiz_media/audio.mp3'), answer: true },
  { statement: 'Questa domanda non ha media.', type: 'text', answer: true },
  // Aggiungi altre domande con tipi diversi
];

const QuizScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (userAnswer) => {
    const isCorrect = questions[currentQuestion].answer === userAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Passa alla prossima domanda o mostra il punteggio alla fine
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigation.navigate('Score', { score });
    }
  };

  const renderMedia = () => {
    const { type, media } = questions[currentQuestion];
    console.log('Media:', media); // Stampa il valore di media nella console
    switch (type) {
      case 'image':
        return <Image source={media} style={styles.media} />;
      case 'audio':
        // Aggiungi il componente per la riproduzione audio qui
        return null;
      case 'video':
        return (
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              resizeMode: ResizeMode.CONTAIN,
              source: {
                uri:"https://www.dropbox.com/scl/fi/7wulop1rjzsvx46x46ex4/video.mp4?rlkey=bjx50s9o0u7x79jslpx85n1fq&dl=1"
              },
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.statement}>{questions[currentQuestion].statement}</Text>
      {renderMedia()}
      <TouchableOpacity
        style={styles.answerButton}
        onPress={() => handleAnswer(true)}
      >
      <Text style={styles.buttonText}>Vero</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.answerButton}
        onPress={() => handleAnswer(false)}
      >
        <Text style={styles.buttonText}>Falso</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  media: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  statement: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: '#000099',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default QuizScreen;


// const questions = [
//   { statement: 'Guarda il video.', type: 'video', media: require('../assets/quiz_media/video.mp4'), answer: false },
//   { statement: 'Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.Il cielo è verde.', type: 'image', media: require('../assets/quiz_media/1.jpg'), answer: false },
//   { statement: 'Il sole è giallo.', type: 'image', media: require('../assets/quiz_media/2.jpg'), answer: true },
//   { statement: 'Ascolta l\'audio.', type: 'audio', media: require('../assets/quiz_media/audio.mp3'), answer: true },
//   { statement: 'Questa domanda non ha media.', type: 'text', answer: true },
  // Aggiungi altre domande con tipi diversi
// ];