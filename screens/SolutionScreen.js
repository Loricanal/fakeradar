import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { ScrollView } from 'react-native-gesture-handler';
import { FlatList } from 'react-native';
import { BackHandler } from 'react-native';
import { Alert } from 'react-native';

const gpticon = require('../assets/quiz_media/ChatGPT_logo.jpg');

const questions = require('../assets/questions.json');

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const SolutionScreen = ({ navigation, route }) => {
  const { questionState } = route.params;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const {  OPZIONI } = questions[currentQuestion];


  const handleBackButtonPress = () => {
    //setSelectedOptionsState(OPZIONI.map(() => false));
    //setIsAtLeastOneOptionSelected(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      // Se si è alla prima domanda, mostra l'alert di conferma
      Alert.alert(
        'Conferma',
        'Se torni alla prima domanda, perderai il progresso del quiz. Sei sicuro di voler continuare?',
        [
          { text: 'Annulla', style: 'cancel' },
          {
            text: 'OK',
            onPress: () => {
              // Resetta lo stato del quiz per ricominciare da capo
              setCurrentQuestion(0);
              // Pulisci le opzioni selezionate
              navigation.goBack();
            },
          },
        ]
      );
    }
  };
  

  useEffect(() => {
    const backAction = () => {
      // La tua logica per tornare indietro qui
      // console.log(777);
      // console.log(questionState);
      handleBackButtonPress();
      return true; // Impedisce la chiamata dell'azione di navigazione predefinita
    };    
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    const navigationListener = navigation.addListener('beforeRemove', (e) => {
        // Verifica se l'utente sta tornando indietro dalla prima schermata
        if (currentQuestion === 0) {
          e.preventDefault(); // Impedisce la chiamata dell'azione di navigazione predefinita
          handleBackButtonPress(); // Esegue la tua logica personalizzata
        } else {
          // Se l'utente sta lasciando la schermata ma non è alla prima domanda, mostra un alert di conferma
          e.preventDefault(); // Impedisce la chiamata dell'azione di navigazione predefinita
          Alert.alert(
            'Conferma',
            'Se lasci la schermata, perderai il progresso del quiz. Sei sicuro di voler continuare?',
            [
              { text: 'Annulla', style: 'cancel' },
              {
                text: 'OK',
                onPress: () => {
                  e.preventDefault(); // Impedisce la chiamata dell'azione di navigazione predefinita
                  navigation.dispatch(e.data.action); // Esegue la navigazione predefinita manualmente
                },
              },
            ]
          );
        }
      });
  
      return () => {
        backHandler.remove();
        navigationListener();
      }; // Rimuove i listener quando il componente si smonta

  }, [currentQuestion, navigation]);


  const renderMedia = () => {
    const { MEDIA } = questions[currentQuestion];
  
    if (!MEDIA || MEDIA.length === 0) {
      return null; // Ritorna null se MEDIA non è definito o è una lista vuota
    }
  
    return MEDIA.map((mediaUrl, index) => {
      const mediaType = determineMediaType(mediaUrl);

      console.log(mediaType);
      switch (mediaType) {
        case 'image':
          return (
            <Image
              key = {index}
              source={{ uri: mediaUrl }}
              style={styles.image}
              resizeMode="contain"
            />
          );
        case 'audio':
          // Aggiungi il componente per la riproduzione audio qui
          return (
            <AudioPlayer
              key={index}
              audioProps={{
                source: {
                  uri: mediaUrl,
                },
              }}
            />
          );
        case 'video':
          return (
            <VideoPlayer
              key={index}
              style = {{height:300}}
              videoProps={{
                shouldPlay: true,
                resizeMode: ResizeMode.CONTAIN,
                source: {
                  uri: mediaUrl,
                }
              }}
            />
          );
        default:
          return null;
      }
    });
  };

  const determineMediaType = (mediaUrl) => {
    console.log(mediaUrl);
    if (/\.(gif|png|jpg)/i.test(mediaUrl)) {
      return 'image';
    } else if (/\.(mp4)/i.test(mediaUrl)) {
      return 'video';
    } else if (/\.(mp3)/i.test(mediaUrl)) {
      return 'audio';
    } else {
      return 'unknown';
    }
  };


  const handleNextButtonPress = () => {
    // Passa alla prossima domanda o termina il quiz
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // If it's the last question, show the "Fine Quiz" alert
      Alert.alert(
        'Conferma',
        'Sei sicuro di voler confermare le risposte e terminare il quiz?',
        [
          { text: 'Annulla', style: 'cancel' },
          {
            text: 'OK',
            onPress: () => {
              // Handle ending the quiz, for example, navigate to the score screen
              navigation.navigate('Home');
            },
          },
        ]
      );
    }
  };
  


  const renderButtons = () => {
    const { TYPE, OPZIONI, RISPOSTA } = questions[currentQuestion];
    return (
      <View style={styles.buttonListContainer}>
        {OPZIONI.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              questionState[currentQuestion].selectedOptions[index] ? styles.selectedButton : styles.unselectedButton,
              RISPOSTA.includes(index) ? styles.correctButton : null,
            ]}
            disabled={true}
          >
            {TYPE === 'text' ? (
              <Text style={[styles.buttonText, questionState[currentQuestion].selectedOptions[index] && styles.selectedText]}>
                {item}
              </Text>
            ) : (
              <Image source={{ uri: item }} style={styles.buttonImage} />
            )}
          </TouchableOpacity>
        ))}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => handleNextButtonPress()}
          >
            <Text style={styles.buttonText}>
              {currentQuestion === questions.length - 1 ? 'Home' : 'Prossima Soluzione'}
            </Text>
          </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.statement}>{questions[currentQuestion].DOMANDA}</Text>
      {renderMedia()}
      {renderButtons()}
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
  headerContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  chatGPTIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  chatGPTIconImage: {
    width: 30,
    height: 30,
  },
  buttonListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statement: {
    fontSize: 18,
    textAlign: 'justify',
    marginHorizontal: 20,
    marginBottom: 20,
    color: '#000099',
  },
  answerButton: {
    backgroundColor: '#000099',
    borderColor: '#000099',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  selectedButton: {
    backgroundColor: 'white',
  },
  unselectedButton: {
    backgroundColor: '#000099',
    borderColor: '#000099',
  },
  correctButton: {
    borderColor: 'green',
    borderWidth: 6,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  selectedText: {
    color: '#000099'
  },
  nextButton: {
    backgroundColor: '#000099',
    borderColor: '#000099',
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 10,
  },
  image: {
    width: 0.8*windowWidth,
    height:300
  }
});

export default SolutionScreen;