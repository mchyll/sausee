import React from 'react';
import { StackScreenProps } from "@react-navigation/stack";
import FieldGroup from "../components/FieldGroup";

type Props = StackScreenProps<RootStackParamList, "FormScreen">


function FormScreen({ navigation, route }: Props) {
  return (
    <>
      <FieldGroup onPressed={() => navigation.navigate("CounterScreen", {counters: [{name: "Søye", count: 2}, {name: "Lam", count: 4}]})}/>
      <FieldGroup onPressed={() => navigation.navigate("FormScreen")}/>
    </>
  )
}

export default FormScreen;