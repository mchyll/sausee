import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton, HeaderTitle, TransitionPresets } from '@react-navigation/stack';
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
import { Alert, Button, Platform } from 'react-native';
import CounterScreen from './screens/CounterScreen';
import { cancelObservation, finishObservation, finishTrip } from './shared/ActionCreators';
import FormScreen from './screens/FormScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { Button as MaterialButton } from 'react-native-paper';



const store = createStore(rootReducer);

if (Platform.OS === "ios") {
  enableScreens();
}
const StackAndroid = createStackNavigator<RootStackParamList>();
const StackIos = createNativeStackNavigator<RootStackParamList>();
const ModalStackFormScreenIos = createNativeStackNavigator<RootStackParamList & { InnerFormScreen: undefined }>();

TaskManager.defineTask(ROUTE_TRACKER_TASK_NAME, createRouteTrackingTask(store.dispatch));


export default class App extends React.Component<{}, {}> {

  private navigatorRef: React.RefObject<NavigationContainerRef>;

  constructor(props: {}) {
    super(props);
    this.navigatorRef = React.createRef();
  }

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer ref={this.navigatorRef}>
          {Platform.OS === "ios" ?
            this.renderIos() :
            this.renderAndroid()
          }
        </NavigationContainer>
      </Provider>
    );
  }

  renderAndroid() {
    return (
      <StackAndroid.Navigator initialRouteName="StartScreen">
        <StackAndroid.Screen
          name="StartScreen"
          component={StartScreen}
          options={{
            headerTitle: "Sausee ANDROID"
          }}
        />
        <StackAndroid.Screen
          name="FormScreen"
          component={FormScreen}
          options={{
            headerLeft: () => (
              <HeaderBackButton
                backImage={() => <MaterialIcons name="close" size={26} color="black" />}
                onPress={() => {
                  // This must be called first, since InnerFormScreen tries to finish the observation when the screen is closed
                  store.dispatch(cancelObservation());
                  this.navigatorRef.current?.navigate("TripMapScreen");
                }}
              />
            ),
            headerRight: () => (
              //@ts-ignore nagging about nonexisting props https://github.com/DefinitelyTyped/DefinitelyTyped/pull/49983
              <MaterialButton color="black" onPress={() => {
                store.dispatch(finishObservation());
                this.navigatorRef.current?.navigate("TripMapScreen");
              }}>
                Lagre
              </MaterialButton>
            ),
            ...TransitionPresets.ModalSlideFromBottomIOS
          }}
        />
        <StackAndroid.Screen
          name="CounterScreen"
          component={CounterScreen}
          options={{
            // headerTitleStyle: {
            //   marginLeft: 5
            // },
            headerRight: () => <HelpButton screenName="CounterScreen" />,
            // headerLeft: () => (
            //   //@ts-ignore
            //   <MaterialButton color="black" onPress={() => {
            //     // this.navigatorRef.current?.navigate("TripMapScreen");
            //     this.navigatorRef.current?.navigate("FormScreen");
            //   }}>
            //     Ferdig
            //   </MaterialButton>
            // ),
            headerBackImage: () => <MaterialIcons name="done" size={26} color="black" />
            // headerLeft: () => <Button title="Ferdig" onPress={() => {
            //   this.navigatorRef.current?.navigate("TripMapScreen");
            //   this.navigatorRef.current?.navigate("FormScreen");
            // }} />
          }}
        />
        <StackAndroid.Screen
          name="TripMapScreen"
          component={TripMapScreen}
          options={{
            headerTitleStyle: {
              marginLeft: 22
            },
            headerTitle: "Sett saueposisjon",
            headerRight: () => <HelpButton screenName="TripMapScreen" />,
            // headerLeft: () => (
            //   //@ts-ignore
            //   <MaterialButton color="black" onPress={this.onEndTripPress}>
            //     Avslutt
            //   </MaterialButton>
            // ),
            // TODO: Denne knappen passer ikke inn i Material Design, de foreslår ikon som knapp øverst til høyre (evt. Material text-buttons som i Full screen dialog)
            headerLeft: () => <Button title="Avslutt" onPress={this.onEndTripPress} />,
            headerLeftContainerStyle: {
              left: 10
            }
          }}
        />
        <StackAndroid.Screen
          name="DownloadMapScreen"
          component={DownloadMapScreen}
          options={{
            headerTitle: "Last ned kartutsnitt",
            headerRight: () => <HelpButton screenName="DownloadMapScreen" />,
          }}
        />
      </StackAndroid.Navigator>
    )
  }

  renderIos() {
    return (
      <StackIos.Navigator initialRouteName="StartScreen">
        <StackIos.Screen
          name="StartScreen"
          component={StartScreen}
          options={{
            headerTitle: "Sausee iOS"
          }}
        />
        <StackIos.Screen
          name="FormScreen"
          component={this.renderIosFormScreenModal}
          options={{
            stackPresentation: "formSheet"
          }}
        />
        <StackIos.Screen
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
        <StackIos.Screen
          name="TripMapScreen"
          component={TripMapScreen}
          options={{
            headerTitle: "Sett saueposisjon",
            headerCenter: () => <HeaderTitle>Sett saueposisjon</HeaderTitle>,
            headerRight: () => <HelpButton screenName="TripMapScreen" />,
            headerLeft: () => <Button
              title="Avslutt"
              // vil vi ha bakgrunnsfarge her på iOS? Eller er det greit med bare tekst?
              onPress={this.onEndTripPress}
            />
          }}
        />
        <StackIos.Screen
          name="DownloadMapScreen"
          component={DownloadMapScreen}
          options={{
            headerTitle: "Last ned kartutsnitt",
            headerRight: () => <HelpButton screenName="DownloadMapScreen" />
          }}
        />
      </StackIos.Navigator>
    )
  }

  renderIosFormScreenModal = () => {
    return (
      <ModalStackFormScreenIos.Navigator>
        <ModalStackFormScreenIos.Screen
          name="InnerFormScreen"
          component={FormScreen}
          options={{
            headerLeft: () =>
              <Button
                title="Avbryt"
                onPress={() => {
                  // This must be called first, since InnerFormScreen tries to finish the observation when the screen is closed
                  store.dispatch(cancelObservation());
                  this.navigatorRef.current?.navigate("TripMapScreen");
                }}
              />,
            headerRight: () => <Button
              title="Lagre"
              onPress={() => {
                store.dispatch(finishObservation());
                this.navigatorRef.current?.navigate("TripMapScreen");
              }}
            />
          }}
        />
      </ModalStackFormScreenIos.Navigator>
    );
  }

  onEndTripPress = () => {
    Alert.alert("Avslutt oppsynstur", "Er du sikker?", [
      {
        text: "Avbryt",
        style: "cancel"
      },
      {
        text: "OK",
        onPress: () => {
          store.dispatch(finishTrip());
          this.navigatorRef.current?.navigate("StartScreen");
          // If it's not tracking, this does nothing
          stopRouteTracking();
        }
      }
    ]);
  }
}
