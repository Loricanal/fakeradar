// QuizScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { ScrollView } from 'react-native-gesture-handler';
import { FlatList } from 'react-native';
import { BackHandler } from 'react-native';
import { Alert } from 'react-native';


const questions = require('../assets/questions.json');

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const QuizScreen = ({ navigation }) => {
  const [scores, setScores] = useState(Array(questions.length).fill(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const {  OPZIONI } = questions[currentQuestion];
  const [selectedOptionsState, setSelectedOptionsState] = useState(OPZIONI.map(() => false));
  const [isAtLeastOneOptionSelected, setIsAtLeastOneOptionSelected] = useState(false);




  
  const handleBackButtonPress = () => {
    setSelectedOptionsState(OPZIONI.map(() => false));
    setIsAtLeastOneOptionSelected(false);
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
              setScores(Array(questions.length).fill(0));
              // Pulisci le opzioni selezionate
              const { OPZIONI } = questions[0];
              // Esegui la navigazione indietro
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
      console.log(777);
      console.log(scores);
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



  const handleOptionPress = (index) => {
    const { RISPOSTA_MULTIPLA, OPZIONI } = questions[currentQuestion];
  
    const updatedOptionsState = [...selectedOptionsState];
    const isOptionSelected = updatedOptionsState[index];
  
    if (isOptionSelected && RISPOSTA_MULTIPLA === 0) {
      // Se è una risposta singola e l'opzione è già selezionata, deselezionala
      updatedOptionsState[index] = false;
    } else {
      if (RISPOSTA_MULTIPLA === 0) {
        // Se è una risposta singola, aggiungi l'opzione solo se non è già presente
        updatedOptionsState.fill(false); // Pulisci le risposte precedenti
        updatedOptionsState[index] = true;
      } else {
        // Se è una risposta multipla, aggiungi o rimuovi l'opzione
        updatedOptionsState[index] = !isOptionSelected;
      }
    }
  
    // Aggiorna lo stato con il nuovo array di booleani

    // console.log(updatedOptionsState);

    setSelectedOptionsState(updatedOptionsState);
  
    setIsAtLeastOneOptionSelected(updatedOptionsState.some((selected) => selected));

  };
  





  const handleNextButtonPress = () => {
    const { RISPOSTA } = questions[currentQuestion];
    const selectedIndices = selectedOptionsState.map((value, index) => value ? index : null).filter(index => index !== null);
  
    const isCorrect = compareArrays(RISPOSTA, selectedIndices);

    console.log(isCorrect);
  
    if (isCorrect) {
      // Assegna i punti se la risposta è corretta
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentQuestion] = 1;
        console.log("Scores",newScores);
        return newScores;
      });
    } else {
      // Imposta lo score a 0 se la risposta è errata
      setScores((prevScores) => {
        const newScores = [...prevScores];
        newScores[currentQuestion] = 0;
        console.log("Scores", newScores);
        return newScores;
      });
    }

    


  
    // Passa alla prossima domanda
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigation.navigate('Score', { scores });
    }
  
    // Pulisci le opzioni selezionate per la nuova domanda
    const { OPZIONI } = questions[currentQuestion];
    setSelectedOptionsState(OPZIONI.map(() => false));
    setIsAtLeastOneOptionSelected(false);
  };
  

  const compareArrays = (arr1, arr2) => {
    // Funzione di utilità per confrontare due array
    return (
      arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index])
    );
  };

  

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
              videoProps={{
                shouldPlay: true,
                resizeMode: ResizeMode.CONTAIN,
                source: {
                  uri: mediaUrl,
                },
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




  const renderButtons = () => {
    const { TYPE, OPZIONI } = questions[currentQuestion];
  
    return (
      <View style={styles.buttonListContainer}>
        {OPZIONI.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              selectedOptionsState[index] ? styles.selectedButton : styles.unselectedButton,
            ]}
            onPress={() => handleOptionPress(index)}
          >
            {TYPE === 'text' ? (
              <Text style={[styles.buttonText, selectedOptionsState[index] && styles.selectedText]}>
                {item}
              </Text>
            ) : (
              <Image source={{ uri: item }} style={styles.buttonImage} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  
  


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.statement}>{questions[currentQuestion].DOMANDA}</Text>
      {renderMedia()}
      {renderButtons()}
      {isAtLeastOneOptionSelected && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => handleNextButtonPress()}
        >
          <Text style={styles.buttonText}>Prossima Domanda</Text>
        </TouchableOpacity>
      )}
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

    imagecontainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 0.8*windowWidth,
        height:300
    },

    buttonListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start', // Align buttons to the start of the container
      },

    statement: {
      fontSize: 18,
      textAlign: 'justify',
      marginHorizontal:20,
      marginBottom: 20,
      color: '#000099'
    },
    answerButton: {
      backgroundColor: '#000099',
      borderColor: '#000099',
      height:50,
      borderWidth: 2,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
      marginHorizontal:20
    },
    selectedButton: {
      backgroundColor: 'white',
    },
    unselectedButton: {
        backgroundColor: '#000099',
        borderColor: '#000099',
    },
    buttonText: {
      fontSize: 18,
      color: 'white'
    },
    selectedText: {
      color: '#000099'
    },
    buttonImage: {
      width: 50,
      height: 50,
    },
    nextButton: {
      backgroundColor: '#000099',
      borderColor: '#000099',
      borderWidth: 2,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 50,
      marginTop: 10,
    }
});

export default QuizScreen;