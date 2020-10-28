import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, View, Text } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { createTrip } from "../shared/ActionCreators";
import { RootStackParamList } from '../shared/TypeDefinitions';


const connector = connect(null, { createTrip });

type StartScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "TripMapScreen">

// todo: initial region
const StartScreen = (props: StartScreenProps) => {
  return (
    <View style={{ justifyContent: "space-evenly" }}>
      <View style={{   alignItems: "center", }}>
        <Pressable
          onPress={() => { 
            props.createTrip();
            props.navigation.navigate("DownloadMapScreen");
           }}
        >
          <Image
            source={require("../assets/sheep_1.png")}
            style={{ width: 350, height: 350 }}
          />
        </Pressable>
      </View>

      <View style={{ alignItems: "center"}}>
        <Text>
          Trykk på sauen for å starte en oppsynstur
          </Text>
      </View>

    </View>
  )
}

export default connector(StartScreen);
