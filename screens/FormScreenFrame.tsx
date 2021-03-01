import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Alert, Button, Keyboard, Platform, ScrollView, View, Text } from "react-native";
import { connect, ConnectedProps } from "react-redux";
import { RootStackParamList, SauseeState } from "../shared/TypeDefinitions";
import { deleteObservation, finishObservation } from "../shared/ActionCreators";
import { Button as MaterialButton } from 'react-native-paper';
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";


const connector = connect((state: SauseeState) => ({
  isNewObservation: state.currentObservation?.isNewObservation
}), { deleteObservation, finishObservation });

function FormScreenFrame<TRoute extends keyof RootStackParamList>(props: React.PropsWithChildren<ConnectedProps<typeof connector> & {
  navigation: StackNavigationProp<RootStackParamList, TRoute>,
  shouldFinishObservation?: React.MutableRefObject<boolean>, 
  addBottomScrollingBoxIos: boolean,
}>) {
  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: props.isNewObservation ? "Ny observasjon" : "Tidligere observasjon"
    });
  }, [props.navigation, props.isNewObservation]);

  useEffect(() => {
    return props.navigation.addListener("beforeRemove", () => {
      if (props.shouldFinishObservation?.current ?? true) {
        props.finishObservation();
      }
    })
  }, [props.shouldFinishObservation]);

  const onDeletePress = () =>
    Alert.alert("Slett observasjon", "Er du sikker?", [
      { text: "Avbryt", style: "default" },
      {
        text: "Slett",
        style: "destructive",
        onPress: () => {
          // This must be called before navigating away, since this component will try to finish the observation when the screen is closed
          props.deleteObservation();
          props.navigation.navigate("TripMapScreen");
        }
      }
    ]);

  return (
    <ScrollView>
      {props.children}

      <View style={{
        marginBottom: 50,
      }}>
        {Platform.OS === "ios" ?
          <Button title="Slett observasjon" color="red" onPress={onDeletePress} /> :
          //@ts-ignore
          <MaterialButton color="red" onPress={onDeletePress}>Slett observasjon</MaterialButton>
        }
      </View>
      {Platform.OS === "ios" && props.addBottomScrollingBoxIos && <View style={{height: 300}}></View>}
      
    </ScrollView>
  );
}

export default connector(FormScreenFrame);
