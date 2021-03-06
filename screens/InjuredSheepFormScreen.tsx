import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../shared/TypeDefinitions";
import FormScreenFrame from "./FormScreenFrame";
import ObservationPhotosFormField from "../components/PhotosFormField";
import ObservationDescriptionFormField from "../components/DescriptionFormField";
import { FormTypeHeader } from "../components/FormTypeHeader";


export default function InjuredSheepFormScreen(props: StackScreenProps<RootStackParamList, "InjuredSheepFormScreen">) {
  return (
    <FormScreenFrame navigation={props.navigation}>

      <FormTypeHeader formType="INJURED_SHEEP" />

      <ObservationDescriptionFormField />

      <ObservationPhotosFormField />

    </FormScreenFrame>
  );
}
