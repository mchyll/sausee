import React from "react"
import { Alert, Platform, TouchableOpacity, View } from "react-native"
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { SauseeState } from "../shared/TypeDefinitions";
import { connect, ConnectedProps } from "react-redux";
import { setUseLocalTiles} from "../shared/ActionCreators";


const mapStateToProps = (state: SauseeState) => {
  return {
    isUsingLocalTiles: state.isUsingLocalTiles,
  };
}

const connector = connect(mapStateToProps, { setUseLocalTiles });

type AntennaProps = ConnectedProps<typeof connector>

const Antenna = (props: AntennaProps) => {
  return (
    <View style={{marginRight: Platform.OS == "ios" ? 20 : 10}}>
      {props.isUsingLocalTiles && <View style={{position: "absolute"}}><FontAwesome5 name="slash" size={20} color="black" /></View>}
      <TouchableOpacity
        //disabled={true}
        onPress={() => {
          Alert.alert(
            `Bruke ${props.isUsingLocalTiles ? "internettkart" : "lokalt nedlastet kart"} istedenfor?`,
            `Dette kan føre til at kartet du trenger ikke vises på skjermen. ${props.isUsingLocalTiles ? "" : "Kartet du som du midlertidig har lasted ned vil forsvinne."}`,
            // TODO: Better phrasing of not undoable"
            [
              { text: "Avbryt", style: "cancel" },
              { text: "Bruk", onPress: () => {
                props.setUseLocalTiles(!props.isUsingLocalTiles);
              }}
            ]
          );
        }}
      >
        <MaterialCommunityIcons name="antenna" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

export default connector(Antenna);