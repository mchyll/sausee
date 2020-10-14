import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
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


const store = createStore(rootReducer);
const Stack = createStackNavigator<RootStackParamList>();

TaskManager.defineTask(ROUTE_TRACKER_TASK_NAME, createRouteTrackingTask(store.dispatch));

export default class App extends React.Component<{}, {}> {
  readonly navOptions = {
    headerShown: false, 
    gestureEnabled: false
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="DownloadMapScreen">
            <Stack.Screen name="FormScreen" component={FormScreen} />
            <Stack.Screen name="CounterScreen" component={CounterScreen} options={this.navOptions} />
            <Stack.Screen name="TripMapScreen" component={TripMapScreen} options={this.navOptions} />
            <Stack.Screen name="DownloadMapScreen" component={DownloadMapScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
