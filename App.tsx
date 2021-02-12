import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, StackScreenProps, HeaderTitle } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
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
import { Alert, Button } from 'react-native';
import FormScreen from './screens/FormScreen';
import CounterScreen from './screens/CounterScreen';
import { finishTrip } from './shared/ActionCreators';
import ReceiptScreen from './screens/ReceiptScreen';



const store = createStore(rootReducer);
// const Stack = createStackNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
enableScreens();

TaskManager.defineTask(ROUTE_TRACKER_TASK_NAME, createRouteTrackingTask(store.dispatch));

export default class App extends React.Component<{}, {}> {

  navigatorRef: React.RefObject<NavigationContainerRef>;

  constructor(props: {}) {
    super(props);
    this.navigatorRef = React.createRef();
  }

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer ref={this.navigatorRef}>
          <Stack.Navigator initialRouteName="StartScreen" >
            <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerTitle: "Sausee" }} />
            <Stack.Screen
              name="FormScreen"
              component={FormScreen}
              options={{
                stackPresentation: "formSheet",
              }}
            />
            <Stack.Screen
              name="CounterScreen"
              component={CounterScreen}
              options={{
                stackAnimation: "none",
                headerLeft: () => <Button title="Ferdig" onPress={() => {
                  this.navigatorRef.current?.navigate("TripMapScreen");
                  this.navigatorRef.current?.navigate("FormScreen");
                }} />,
                headerRight: () => <HelpButton screenName="CounterScreen" />,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="TripMapScreen"
              component={TripMapScreen}
              options={{
                headerTitle: "Sett saueposisjon",
                headerCenter: () => <HeaderTitle>Sett saueposisjon</HeaderTitle>,
                headerRight: () => <HelpButton screenName="TripMapScreen" />,
                headerLeft: () => <Button
                  title="Avslutt"
                  // vil vi ha bakgrunnsfarge her på iOS? Eller er det greit med bare tekst?
                  onPress={() => {
                    this.navigatorRef.current?.navigate("ReceiptScreen");
                  }}
                />
              }}
            />
            <Stack.Screen name="DownloadMapScreen" component={DownloadMapScreen} options={{ headerTitle: "Last ned kartutsnitt", headerRight: (props) => <HelpButton screenName="DownloadMapScreen" /> }} />
            <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} options={{ headerTitle: "Oppsummering"}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}