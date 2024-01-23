// QuizScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ResizeMode } from 'expo-av';
import VideoPlayer from 'expo-video-player';
import { ScrollView } from 'react-native-gesture-handler';
import { FlatList } from 'react-native';
import { BackHandler } from 'react-native';
import { Alert } from 'react-native';

const gpticon = require('../assets/quiz_media/ChatGPT_logo.jpg') 

const questions = require('../assets/questions.json');

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const QuizScreen = ({ navigation }) => {
  const [questionState, setQuestionState] = useState(
    questions.map((question) => ({
      selectedOptions: Array(question.OPZIONI.length).fill(false),
      isAtLeastOneOptionSelected: false,
    }))
  );

  //const [scores, setScores] = useState(Array(questions.length).fill(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const {  OPZIONI } = questions[currentQuestion];
  //const [selectedOptionsState, setSelectedOptionsState] = useState(OPZIONI.map(() => false));
  //const [isAtLeastOneOptionSelected, setIsAtLeastOneOptionSelected] = useState(false);




  
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
              setQuestionState(
                questions.map((question) => ({
                  selectedOptions: Array(question.OPZIONI.length).fill(false),
                  isAtLeastOneOptionSelected: false,
                }))
              );
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



  const handleOptionPress = (index) => {
    //console.log(333);
    const { RISPOSTA_MULTIPLA, OPZIONI } = questions[currentQuestion];
    const updatedQuestionState = [...questionState];
    const isOptionSelected = updatedQuestionState[currentQuestion].selectedOptions[index];

    if (isOptionSelected && RISPOSTA_MULTIPLA === 0) {
      updatedQuestionState[currentQuestion].selectedOptions[index] = false;
    } else {
      if (RISPOSTA_MULTIPLA === 0) {
        updatedQuestionState[currentQuestion].selectedOptions = Array(OPZIONI.length).fill(false);
        updatedQuestionState[currentQuestion].selectedOptions[index] = true;
      } else {
        updatedQuestionState[currentQuestion].selectedOptions[index] = !isOptionSelected;
      }
    }

    updatedQuestionState[currentQuestion].isAtLeastOneOptionSelected = updatedQuestionState[
      currentQuestion
    ].selectedOptions.some((selected) => selected);

    setQuestionState(updatedQuestionState);
    console.log(questionState);
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
              navigation.navigate('Punteggio', { questionState });
            },
          },
        ]
      );
    }
  };

  const handleChatGPTIconPress = () => {
    const { RISPOSTA_CHAT_GPT } = questions[currentQuestion];
    Alert.alert(
      'Risposta GPT',
      RISPOSTA_CHAT_GPT || 'Nessuna risposta disponibile.'
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




  const renderButtons = () => {
    const { TYPE, OPZIONI } = questions[currentQuestion];
    return (
      <View style={styles.buttonListContainer}>
        {OPZIONI.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              questionState[currentQuestion].selectedOptions[index] ? styles.selectedButton : styles.unselectedButton,
            ]}
            onPress={() => handleOptionPress(index)}
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
        {questionState[currentQuestion].isAtLeastOneOptionSelected && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => handleNextButtonPress()}
          >
            <Text style={styles.buttonText}>
              {currentQuestion === questions.length - 1 ? 'Fine Quiz' : 'Prossima Domanda'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  
  


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {questions[currentQuestion].RISPOSTA_CHAT_GPT && (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.chatGPTIcon}
          onPress={handleChatGPTIconPress}
        >
          <Image
            source={gpticon}
            style={styles.chatGPTIconImage}
          />
        </TouchableOpacity>
      </View>
      )}
      <Text style={styles.statement}>{questions[currentQuestion].DOMANDA}</Text>
      {renderMedia()}
      {renderButtons()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
        justifyContent: 'center', // Allinea i bottoni al centro orizzontalmente
        alignItems: 'center'
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
    },
    video: {
      height: 200,
    }
});

export default QuizScreen;