import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './reducers/RootReducer';
import { RootStackParamList } from './shared/TypeDefinitions';
import CounterScreen from './screens/CounterScreen';
import FormScreen from './screens/FormScreen';
import MapScreen from './screens/MapScreen';
import { TransitionSpec } from '@react-navigation/stack/lib/typescript/src/types';

const store = createStore(rootReducer);
const Stack = createStackNavigator<RootStackParamList>();

export default class App extends React.Component<{}, {}> {

  render() {
    const config: TransitionSpec = {
      animation: "timing",
      config: {
        duration: 2000
      },
    };

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="MapScreen" screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
              open: config,
              close: config
            }
          }}>
            <Stack.Screen name="FormScreen" component={FormScreen} />
            <Stack.Screen name="CounterScreen" component={CounterScreen} options={{ headerShown: false, gestureEnabled: false }} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>


      //<CarouselWrapper counters={[{name: "example name", count: 1}, {name: "example name 2", count: 2}]}  />
    );
  }
}
