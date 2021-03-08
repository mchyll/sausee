import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton, HeaderTitle, TransitionPresets } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './reducers/RootReducer';
import { RootStackParamList, SauseeState } from './shared/TypeDefinitions';
import TripMapScreen from './screens/TripMapScreen';
import DownloadMapScreen from './screens/DownloadMapScreen';
import * as TaskManager from 'expo-task-manager';
import { BACKROUND_ROUTE_TRACKER_TASK_NAME, createBackgroundRouteTrackingTask, stopRouteTracking } from './services/LocationTracking';
import { HelpButton } from "./components/HelpButton";
import StartScreen from './screens/StartScreen';
import { Alert, Button, Platform, TouchableOpacity, View } from 'react-native';
import CounterScreen from './screens/CounterScreen';
import TripsListScreen from './screens/TripsListScreen';
import OldTripScreen from './screens/OldTripScreen';
import ReceiptScreen from './screens/ReceiptScreen';
import { cancelObservation, finishObservation, finishTrip, setUseLocalTiles } from './shared/ActionCreators';
import SheepFormScreen from './screens/SheepFormScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { Button as MaterialButton } from 'react-native-paper';
import InjuredSheepFormScreen from './screens/InjuredSheepFormScreen';
import PredatorFormScreen from './screens/PredatorFormScreen';
import DeadSheepFormScreen from './screens/DeadSheepFormScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Antenna from './components/Antenna';
import ExpoFileSystemStorage from "redux-persist-expo-filesystem"
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from "redux-persist/integration/react";
import { ActionType } from './shared/Actions';
import SettingsScreen from './screens/SettingsScreen';
import { SettingsIconButton } from './components/SettingsIconButton';

const persistConfig = {
  key: "root",
  storage: ExpoFileSystemStorage
};

const store = createStore(
  persistReducer(persistConfig, rootReducer)
);

// @ts-ignore
const persistor = persistStore(store);

if (Platform.OS === "ios") {
  enableScreens();
}
const StackAndroid = createStackNavigator<RootStackParamList>();
const StackIos = createNativeStackNavigator<RootStackParamList>();
const ModalStackFormScreenIos = createNativeStackNavigator<RootStackParamList>();

TaskManager.defineTask(BACKROUND_ROUTE_TRACKER_TASK_NAME, createBackgroundRouteTrackingTask(store.dispatch));


export default class App extends React.Component<{}, {}> {

  private navigatorRef: React.RefObject<NavigationContainerRef>;

  constructor(props: {}) {
    super(props);
    this.navigatorRef = React.createRef();
  }

  private navigate<ScreenName extends keyof RootStackParamList>(screenName: ScreenName, params?: RootStackParamList[ScreenName]) {
    this.navigatorRef.current?.navigate(screenName, params);
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer ref={this.navigatorRef}>
            {Platform.OS === "ios" ?
              this.renderIos() :
              this.renderAndroid()
            }
          </NavigationContainer>
        </PersistGate>
      </Provider>
    );
  }

  renderAndroid() {
    const formScreenOptions = {
      headerLeft: () => (
        <HeaderBackButton
          backImage={() => <MaterialIcons name="close" size={26} color="black" />}
          onPress={() => {
            // This must be called before navigating away, since FormScreenFrame tries to finish the observation when the screen is closed
            store.dispatch(cancelObservation());
            this.navigatorRef.current?.goBack();
          }}
        />
      ),
      headerRight: () => (
        //@ts-ignore nagging about nonexisting props https://github.com/DefinitelyTyped/DefinitelyTyped/pull/49983
        <MaterialButton color="black" onPress={() => {
          store.dispatch(finishObservation());
          this.navigatorRef.current?.goBack();
        }}>
          Lagre
        </MaterialButton>
      ),
      ...TransitionPresets.ModalSlideFromBottomIOS
    };
    return (
      <StackAndroid.Navigator initialRouteName="StartScreen">
        <StackAndroid.Screen
          name="StartScreen"
          component={StartScreen}
          options={{
            headerTitle: "Sausee",
            headerRight: () => <SettingsIconButton onPress={() => this.navigate("SettingsScreen")} />
          }}
        />
        <StackAndroid.Screen
          name="SheepFormScreen"
          component={SheepFormScreen}
          options={formScreenOptions}
        />
        <StackAndroid.Screen
          name="PredatorFormScreen"
          component={PredatorFormScreen}
          options={formScreenOptions}
        />
        <StackAndroid.Screen
          name="InjuredSheepFormScreen"
          component={InjuredSheepFormScreen}
          options={formScreenOptions}
        />
        <StackAndroid.Screen
          name="DeadSheepFormScreen"
          component={DeadSheepFormScreen}
          options={formScreenOptions}
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
            //     // this.navigate("TripMapScreen");
            //     this.navigate("SheepFormScreen");
            //   }}>
            //     Ferdig
            //   </MaterialButton>
            // ),
            headerBackImage: () => <MaterialIcons name="done" size={26} color="black" />
            // headerLeft: () => <Button title="Ferdig" onPress={() => {
            //   this.navigate("TripMapScreen");
            //   this.navigate("SheepFormScreen");
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
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <Antenna />
                <HelpButton screenName="TripMapScreen" />
              </View>
            ),
            // headerLeft: () => (
            //   //@ts-ignore
            //   <MaterialButton color="black" onPress={this.onEndTripPress}>
            //     Avslutt
            //   </MaterialButton>
            // ),
            headerLeft: () => <HeaderBackButton
              backImage={() => <MaterialIcons name="logout" style={{ transform: [{ rotateY: "180deg" }] }} size={26} color="black" />}
              onPress={() => this.navigate("ReceiptScreen")}
            />,
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
        <StackAndroid.Screen name="TripsListScreen" component={TripsListScreen} options={{ headerTitle: "Tidligere turer" }} />
        <StackAndroid.Screen name="OldTripScreen" component={OldTripScreen}
          options={{
            headerLeft: () => <HeaderBackButton
              onPress={() => {
                store.dispatch(finishTrip());
                this.navigatorRef.current?.goBack();
              }}
            />,
            headerTitle: "Gammel tur",
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <Antenna />
                <HelpButton screenName="OldTripScreen" />
              </View>
            ),
          }}
        />
        <StackAndroid.Screen
          name="ReceiptScreen"
          component={ReceiptScreen}
          options={{
            headerTitle: "Oppsummering"
          }}
        />
        <StackAndroid.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            headerTitle: "Innstillinger"
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
            headerTitle: "Sausee",
            headerRight: () => <SettingsIconButton onPress={() => this.navigate("SettingsScreen")} />
          }}
        />
        <StackIos.Screen
          name="FormScreenModals"
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
              this.navigatorRef.current?.goBack();
              this.navigate("FormScreenModals", { screen: "SheepFormScreen" });
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
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <Antenna />
                <HelpButton screenName="TripMapScreen" />
              </View>
            ),
            headerLeft: () => <Button
              title="Avslutt"
              // vil vi ha bakgrunnsfarge her på iOS? Eller er det greit med bare tekst?
              onPress={() => this.navigate("ReceiptScreen")}
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
        <StackIos.Screen name="TripsListScreen" component={TripsListScreen} options={{ headerTitle: "Tidligere turer" }} />
        <StackIos.Screen name="OldTripScreen" component={OldTripScreen}
          options={{
            headerLeft: () => <HeaderBackButton
              onPress={() => {
                store.dispatch(finishTrip());
                this.navigatorRef.current?.goBack();
              }}
            />,
            headerTitle: "Gammel tur",
            headerRight: () => (
              <View style={{ flexDirection: "row" }}>
                <Antenna />
                <HelpButton screenName="OldTripScreen" />
              </View>
            ),
          }}
        />
        <StackIos.Screen
          name="ReceiptScreen"
          component={ReceiptScreen}
          options={{
            headerTitle: "Oppsummering"
          }}
        />
        <StackIos.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            headerTitle: "Innstillinger"
          }}
        />
      </StackIos.Navigator>
    )
  }

  renderIosFormScreenModal = () => {
    const screenOptions = {
      headerLeft: () =>
        <Button
          title="Avbryt"
          onPress={() => {
            // This must be called before navigating away, since FormScreenFrame tries to finish the observation when the screen is closed
            store.dispatch(cancelObservation());
            this.navigatorRef.current?.goBack();
          }}
        />,
      headerRight: () => <Button
        title="Lagre"
        onPress={() => {
          store.dispatch(finishObservation());
          this.navigatorRef.current?.goBack();
        }}
      />
    };

    return (
      <ModalStackFormScreenIos.Navigator>
        <ModalStackFormScreenIos.Screen
          name="SheepFormScreen"
          component={SheepFormScreen}
          options={screenOptions}
        />
        <ModalStackFormScreenIos.Screen
          name="InjuredSheepFormScreen"
          component={InjuredSheepFormScreen}
          options={screenOptions}
        />
        <ModalStackFormScreenIos.Screen
          name="PredatorFormScreen"
          component={PredatorFormScreen}
          options={screenOptions}
        />
        <ModalStackFormScreenIos.Screen
          name="DeadSheepFormScreen"
          component={DeadSheepFormScreen}
          options={screenOptions}
        />
      </ModalStackFormScreenIos.Navigator>
    );
  }
}
