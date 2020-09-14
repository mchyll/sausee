import React, { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { View, Text, StyleSheet } from "react-native";

export function LocationComponent() {
    const [location, setLocation] = useState({});
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        (async () => {
            let result = await Location.requestPermissionsAsync();
            if (result.status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    });

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <Text>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
