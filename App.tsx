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
import * as TaskManager from 'expo-task-manager';
import { createRouteTrackingTask } from './BackgroundLocationTrackerTask';


const store = createStore(rootReducer);
const Stack = createStackNavigator<RootStackParamList>();

TaskManager.defineTask("BackgroundLocationTracker", createRouteTrackingTask(store.dispatch));

export default class App extends React.Component<{}, {}> {
  readonly navOptions = {
    headerShown: false, 
    gestureEnabled: false
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="TripMapScreen">
            <Stack.Screen name="FormScreen" component={FormScreen} />
            <Stack.Screen name="CounterScreen" component={CounterScreen} options={this.navOptions} />
            <Stack.Screen name="TripMapScreen" component={TripMapScreen} options={this.navOptions} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
