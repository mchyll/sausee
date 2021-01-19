import React from "react";
import Reanimated, { add, color, concat, cond, cos, greaterThan, lessThan, multiply, sin, sub } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";


const AnimatedPath = Reanimated.createAnimatedComponent(Path);

function animatedString(strings: TemplateStringsArray, ...values: Array<number | string | Reanimated.Node<string | number>>) {
  const arr = [];
  for (let i = 0; i < values.length; i++) {
    arr.push(strings[i], values[i]);
  }
  const end = strings[values.length];
  if (end) {
    arr.push(end);
  }
  // @ts-ignore
  return concat(...arr);
}

interface ProgressArcProps {
  progess: Reanimated.Value<number>;
  size: number;
}
export class ProgressArc extends React.Component<ProgressArcProps> {

  private arcPath: Reanimated.Node<string>;
  private color: Reanimated.Node<number>;

  constructor(props: ProgressArcProps) {
    super(props);
    this.arcPath = this.getArcPath();
    this.color = this.getColor();
  }

  private getArcPath() {
    const c = this.props.size / 2;
    const rad = multiply(this.props.progess, Math.PI * 2);
    const endX = add(c, multiply(c, sin(rad)));
    const endY = sub(c, multiply(c, cos(rad)));
    const largeArc = cond(greaterThan(rad, Math.PI), "1", "0");
    return cond(lessThan(this.props.progess, 1),
      animatedString`M${c} 0 A${c} ${c} 0 ${largeArc} 1 ${endX} ${endY}`,
      `M${c} 0 A${c} ${c} 0 1 1 ${c - 1} 0 Z`);
  }

  private getColor() {
    return cond(lessThan(this.props.progess, 1), color(0, 0, 0), color(0, 160, 0));
  }

  render() {
    const s = this.props.size;
    return <Svg width={s} height={s} viewBox={`-5 -5 ${s + 10} ${s + 10}`}>
      <AnimatedPath d={this.arcPath} fill="none" stroke={this.color} strokeWidth={5} strokeLinecap="round" />
    </Svg>
  }
}
