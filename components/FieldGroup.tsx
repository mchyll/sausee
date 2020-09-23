import React from "react";
import Field from "./Field";
import FieldGroupFrame from "./FieldGroupFrame";

interface FieldGroupProps {
  onPressed: () => void
}

const FieldGroup = (props: FieldGroupProps) => ( // todo: merge with field group frame?
  <FieldGroupFrame title="field group title">
    <Field onPressed={props.onPressed} description="field description"/>
    <Field onPressed={props.onPressed} description="field description"/>
    <Field onPressed={props.onPressed} description="field description"/>
    <Field onPressed={props.onPressed} description="field description"/>

  </FieldGroupFrame>
);

export default FieldGroup;