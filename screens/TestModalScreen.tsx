import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { RootStackParamList } from '../shared/TypeDefinitions';


type ModalStackParamList = RootStackParamList & {
  FirstScreen: undefined,
  SecondScreen: undefined
}

const ModalStack = createNativeStackNavigator<ModalStackParamList>();

const FirstScreen = (props: StackScreenProps<ModalStackParamList, "FirstScreen">) =>
  <ScrollView>
    <Text>Hei hei dette er en modal</Text>
    <Text>Hei hei dette er en modal</Text>
    <Text>Hei hei dette er en modal</Text>
    <Button title="Fullscreen" onPress={() => { props.navigation.replace("FullScreen") }} />
    <Button title="Neste" onPress={() => props.navigation.navigate("SecondScreen")} />
    <Button title="Lukk modalen" onPress={() => props.navigation.pop()} />
  </ScrollView>

const SecondScreen = (props: StackScreenProps<ModalStackParamList, "SecondScreen">) =>
  <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
    <Text>DETTE ER SKJEMBILDE 2!</Text>
    <Button title="Tilbake" onPress={() => props.navigation.navigate("FirstScreen")} />
  </View>

export default (props: StackScreenProps<RootStackParamList, "TestModalScreen">) =>
  <ModalStack.Navigator>
    <ModalStack.Screen name="FirstScreen" component={FirstScreen} />
    <ModalStack.Screen name="SecondScreen" component={SecondScreen} options={{ headerShown: false, gestureEnabled: false }} />
  </ModalStack.Navigator>
