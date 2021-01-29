import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
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
import { ROUTE_TRACKER_TASK_NAME, createRouteTrackingTask, stopRouteTracking } from './services/BackgroundLocationTracking';
import { HelpButton } from "./components/HelpButton";
import StartScreen from './screens/StartScreen';
import TestModalScreen from './screens/TestModalScreen';
import { Alert, Button, Modal, Text, View } from 'react-native';
import FormScreen from './screens/FormScreen';
import CounterScreen from './screens/CounterScreen';
import { finishTrip } from './shared/ActionCreators';



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
  navigatorRef: React.RefObject<NavigationContainerRef>;

  /**
   *
   */
  constructor(props: {}) {
    super(props);
    this.navigatorRef = React.createRef();
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer ref={this.navigatorRef}>
          <Stack.Navigator initialRouteName="StartScreen">
            <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerTitle: "Sausee" }} />
            {/* <Stack.Screen name="FormScreen" component={FormScreen} options={{ stackPresentation: "formSheet" }} /> */}
            <Stack.Screen name="FormScreen" component={FormScreen} options={{ headerTitle: "Telleoversikt", headerRight: () => <HelpButton screenName="FormScreen" /> }} initialParams={{ initialNearForm: true }} />
            {/* <Stack.Screen name="CounterScreen" component={CounterScreen} options={this.navOptions} /> */}
            <Stack.Screen name="CounterScreen" component={CounterScreen} options={{ headerRight: () => <HelpButton screenName="CounterScreen" /> }} />
            <Stack.Screen name="FullScreen" component={FullScreen} />
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
            <Stack.Screen
              name="TripMapScreen"
              component={TripMapScreen}
              options={{
                headerTitle: "Sett saueposisjon",
                headerRight: () => <HelpButton screenName="TripMapScreen" />,
                headerLeft: () => <Button
                  title="Avslutt"
                  // vil vi ha bakgrunnsfarge her på iOS? Eller er det greit med bare tekst?
                  onPress={() => {
                    Alert.alert("Avslutt oppsynstur", "Er du sikker?", [
                      { text: "Avbryt", style: "cancel" },
                      {
                        text: "OK", onPress: () => {
                          store.dispatch(finishTrip());
                          this.navigatorRef.current?.navigate("StartScreen");
                          // If it's not tracking, this does nothing
                          stopRouteTracking();
                        }
                      }
                    ])
                  }}
                />
              }}
            />
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
