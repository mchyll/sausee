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

const store = createStore(rootReducer);
const Stack = createStackNavigator<RootStackParamList>();

export default class App extends React.Component<{}, {}> {

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="DownloadMapScreen">
            <Stack.Screen name="FormScreen" component={FormScreen} />
            <Stack.Screen name="CounterScreen" component={CounterScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="TripMapScreen" component={TripMapScreen} />
            <Stack.Screen name="DownloadMapScreen" component={DownloadMapScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}
