import React from "react";
import Reanimated, { add, color, concat, cond, cos, Easing, greaterThan, interpolateColors, lessThan, multiply, sin, sub } from "react-native-reanimated";
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
  size: number;
}
export class ProgressArc extends React.Component<ProgressArcProps> {

  private progress: Reanimated.Value<number>;
  private arcPath: Reanimated.Node<string>;
  private colorProgress: Reanimated.Value<number>;
  private color: Reanimated.Node<number>;

  constructor(props: ProgressArcProps) {
    super(props);
    this.progress = new Reanimated.Value(0);
    this.arcPath = this.getArcPath();
    this.colorProgress = new Reanimated.Value(0);
    this.color = this.getColor();
  }

  private getArcPath() {
    const c = this.props.size / 2;
    const rad = multiply(this.progress, Math.PI * 2);
    const endX = add(c, multiply(c, sin(rad)));
    const endY = sub(c, multiply(c, cos(rad)));
    const largeArc = cond(greaterThan(rad, Math.PI), "1", "0");
    return cond(lessThan(this.progress, 1),
      animatedString`M${c} 0 A${c} ${c} 0 ${largeArc} 1 ${endX} ${endY}`,
      `M${c} 0 A${c} ${c} 0 1 1 ${c - 1} 0 Z`);
  }

  private getColor() {
    return interpolateColors(this.colorProgress, { inputRange: [0, 1], outputColorRange: ["#000", "#0B0"] });
  }

  render() {
    console.log("ProgressArc render");
    const s = this.props.size;
    return <>
      <Svg width={s} height={s} viewBox={`-5 -5 ${s + 10} ${s + 10}`}>
        <AnimatedPath
          fill="none"
          d={this.arcPath}
          stroke={this.color}
          strokeWidth={5}
          strokeLinecap="round" />
      </Svg>
    </>
  }

  setProgress(newProgress: number) {
    const progress = Math.min(Math.max(newProgress, 0), 1);
    Reanimated.timing(this.progress, { toValue: progress, duration: 500, easing: Easing.inOut(Easing.ease) }).start();
    if (progress === 1) {
      Reanimated.timing(this.colorProgress, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease) }).start();
    }
    else {
      this.colorProgress.setValue(0);
    }
  }
}
