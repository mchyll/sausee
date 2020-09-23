import { NavigationContainer, Route } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import CarouselWrapper from './components/CarouselWrapper';
import FieldGroup from './components/FieldGroup';
import FieldGroupFrame from './components/FieldGroupFrame';
import SwipeCounter from './components/SwipeCounter';
import CounterScreen from './screens/CounterScreen';
import FormScreen from './screens/FormScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default class App extends React.Component<{}, {}> {

  render() {
    return (
      
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FormScreen">
        <Stack.Screen name="FormScreen" component={FormScreen} />
        <Stack.Screen name="CounterScreen" component={CounterScreen} options={{headerShown: false, gestureEnabled: false}} />
      </Stack.Navigator>
    </NavigationContainer>
    
    //<CarouselWrapper counters={[{name: "example name", count: 1}, {name: "example name 2", count: 2}]}  />
    );
  }
}



