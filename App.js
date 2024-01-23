// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ScoreScreen from './screens/ScoreScreen';
import SolutionScreen from './screens/SolutionScreen.js';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Punteggio" component={ScoreScreen} />
        <Stack.Screen name="Soluzione" component={SolutionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
