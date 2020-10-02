import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './reducers/RootReducer';
import CounterScreen from './screens/CounterScreen';
import FormScreen from './screens/FormScreen';
import { RootStackParamList } from './shared/TypeDefinitions';

const store = createStore(rootReducer);
const Stack = createStackNavigator<RootStackParamList>();

export default class App extends React.Component<{}, {}> {

  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="FormScreen">
            <Stack.Screen name="FormScreen" component={FormScreen} />
            <Stack.Screen name="CounterScreen" component={CounterScreen} options={{headerShown: false, gestureEnabled: false}} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    
    
    //<CarouselWrapper counters={[{name: "example name", count: 1}, {name: "example name 2", count: 2}]}  />
    );
  }
}



