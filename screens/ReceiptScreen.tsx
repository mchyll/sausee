import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Image, Pressable, View, Text, Button, Alert } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';
import { finishTrip } from "../shared/ActionCreators";
import { RootStackParamList, SauseeState } from '../shared/TypeDefinitions';
import { stopRouteTracking } from "../services/BackgroundLocationTracking";
import { deleteDirectoryFiles } from '../services/MapDownload';
import StartScreen from './StartScreen';


const mapStateToProps = (state: SauseeState) => ({
  //currentTripId: state.currentTripId,
  state,
});

const connector = connect(mapStateToProps, { finishTrip });

type StartScreenProps = ConnectedProps<typeof connector> & StackScreenProps<RootStackParamList, "StartScreen">

const ReceiptScreen = (props: StartScreenProps) => {
  return (
    <View style={{alignItems: "center"}}>
      <Button
        title={"Avslutt oppsynstur"}
        onPress={() => {
          Alert.alert("Avslutt oppsynstur", "Er du sikker?", [
            { text: "Avbryt", style: "cancel" },
            {
              text: "OK", onPress: () => {
                props.finishTrip();
                stopRouteTracking();
                props.navigation.reset({
                  index: 0,
                  routes: [{name: "StartScreen"}]
                });
              }
            }
          ]);
        }}
      />
    </View>
  )
}

export default connector(ReceiptScreen);
