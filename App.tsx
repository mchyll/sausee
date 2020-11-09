import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps, HeaderTitle } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './reducers/RootReducer';
import { RootStackParamList } from './shared/TypeDefinitions';
import CounterScreen from './screens/CounterScreen';
import FormScreen from './screens/FormScreen';
import TripMapScreen from './screens/TripMapScreen';
import DownloadMapScreen from './screens/DownloadMapScreen';
import * as TaskManager from 'expo-task-manager';
import { ROUTE_TRACKER_TASK_NAME, createRouteTrackingTask } from './services/BackgroundLocationTracking';
import { HelpButton } from "./components/HelpButton";
import StartScreen from './screens/StartScreen';
import TestModalScreen from './screens/TestModalScreen';
import { Button, Modal, Text, View } from 'react-native';
import NewFormScreen from './screens/NewFormScreen';
import NewCounterScreen from './screens/NewCounterScreen';
import { PanResponderTestScreen } from './screens/PanResponderTestScreen';


const store = createStore(rootReducer);
// const Stack = createStackNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
enableScreens();

TaskManager.defineTask(ROUTE_TRACKER_TASK_NAME, createRouteTrackingTask(store.dispatch));

export default class App extends React.Component<{}, {}> {
  // readonly navOptions = {
  //   headerShown: false,
  //   gestureEnabled: false
  // }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="StartScreen">
            <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerTitle: "Sausee" }} />
            {/* <Stack.Screen name="FormScreen" component={FormScreen} options={{ stackPresentation: "formSheet" }} /> */}
            <Stack.Screen name="NewFormScreen" component={NewFormScreen} options={{ headerTitle: "Telleoversikt", headerRight: () => <HelpButton screenName="NewFormScreen" /> }} initialParams={{ initialNearForm: true }} />
            {/* <Stack.Screen name="CounterScreen" component={CounterScreen} options={this.navOptions} /> */}
            <Stack.Screen name="NewCounterScreen" component={NewCounterScreen} options={{headerRight: () => <HelpButton screenName="NewCounterScreen" />}} />
            <Stack.Screen name="FullScreen" component={FullScreen} />
            <Stack.Screen name="PanResponderTestScreen" component={PanResponderTestScreen} />
            <Stack.Screen
              name="TestModalScreen"
              component={TestModalScreen}
              options={{
                stackPresentation: "formSheet",
                headerShown: false,
                // headerTitle: "Modal",
                // headerRight: () => <Text>Right</Text>
              }}
            />
            <Stack.Screen name="TripMapScreen" component={TripMapScreen} options={{ headerTitle: "Sett saueposisjon", headerRight: () => <HelpButton screenName="TripMapScreen" /> }} />
            <Stack.Screen name="DownloadMapScreen" component={DownloadMapScreen} options={{ headerTitle: "Last ned kartutsnitt", headerRight: (props) => <HelpButton screenName="DownloadMapScreen" /> }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

const FullScreen = (props: StackScreenProps<RootStackParamList, "FullScreen">) => {
  const [modalVisible, setModalVisible] = useState(false);
  return <View>
    <Text>Dette er en fullskjermting</Text>
    <Button title="Tilbake til modal" onPress={() => { props.navigation.navigate("TestModalScreen") }} />
    {/* <Button title="Åpne modal" onPress={() => setModalVisible(true)} />
    <Modal visible={modalVisible} animationType="slide">
      <Text>Dette er en modal</Text>
      <Button title="Lukk modal" onPress={() => setModalVisible(false)} />
    </Modal> */}
  </View>
}
