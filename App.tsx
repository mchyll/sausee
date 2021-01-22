import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps, HeaderTitle } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './reducers/RootReducer';
import { RootStackParamList } from './shared/TypeDefinitions';
import TripMapScreen from './screens/TripMapScreen';
import DownloadMapScreen from './screens/DownloadMapScreen';
import * as TaskManager from 'expo-task-manager';
import { ROUTE_TRACKER_TASK_NAME, createRouteTrackingTask } from './services/BackgroundLocationTracking';
import { HelpButton } from "./components/HelpButton";
import StartScreen from './screens/StartScreen';
import TestModalScreen from './screens/TestModalScreen';
import { Button, Modal, Text, View } from 'react-native';
import FormScreen from './screens/FormScreen';
import CounterScreen from './screens/CounterScreen';



const store = createStore(rootReducer);
// const Stack = createStackNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
enableScreens();

TaskManager.defineTask(ROUTE_TRACKER_TASK_NAME, createRouteTrackingTask(store.dispatch));

export default class App extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="StartScreen">
            <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerTitle: "Sausee" }} />
            <Stack.Screen name="FormScreen" component={FormScreen} options={{ headerTitle: "Telleoversikt", headerRight: () => <HelpButton screenName="FormScreen" /> }} initialParams={{ initialNearForm: true }} />
            <Stack.Screen name="CounterScreen" component={CounterScreen} options={{headerRight: () => <HelpButton screenName="CounterScreen" />}} />
            <Stack.Screen name="TripMapScreen" component={TripMapScreen} options={{ headerTitle: "Sett saueposisjon", headerRight: () => <HelpButton screenName="TripMapScreen" /> }} />
            <Stack.Screen name="DownloadMapScreen" component={DownloadMapScreen} options={{ headerTitle: "Last ned kartutsnitt", headerRight: (props) => <HelpButton screenName="DownloadMapScreen" /> }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}