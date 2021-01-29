import React from "react";
import { StyleSheet, View } from "react-native";
import Reanimated, { add, concat, cond, cos, Easing, greaterThan, interpolateColors, lessThan, multiply, sin, sub } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { AntDesign } from "@expo/vector-icons";


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

interface DownloadProgressAnimationProps {
  size: number;
}
export class DownloadProgressAnimation extends React.Component<DownloadProgressAnimationProps, { done: boolean }> {

  private progress: Reanimated.Value<number>;
  private arcPath: Reanimated.Node<string>;
  private colorProgress: Reanimated.Value<number>;
  private color: Reanimated.Node<number>;

  constructor(props: DownloadProgressAnimationProps) {
    super(props);
    this.state = { done: false };
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
      `M${c} 0 A${c} ${c} 0 1 1 ${c - 0.1} 0 Z`);
  }

  private getColor() {
    return interpolateColors(this.colorProgress, {
      inputRange: [0, 1],
      outputColorRange: ["#000", "#0B0"]
    });
  }

  render() {
    const s = this.props.size;
    return <View>
      <Svg width={s} height={s} viewBox={`-5 -5 ${s + 10} ${s + 10}`}>
        <AnimatedPath
          fill="none"
          d={this.arcPath}
          stroke={this.color}
          strokeWidth={5}
          strokeLinecap="round" />
      </Svg>
      <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: "center", alignItems: "center" }}>
        {this.state.done ?
          <IconDoneDownloading color={this.color} size={s / 2} /> :
          <AntDesign name="download" color="#000" size={s / 2} />
        }
      </View>
    </View>
  }

  setProgress(newProgress: number) {
    newProgress = Math.min(Math.max(newProgress, 0), 1);
    Reanimated.timing(this.progress, { toValue: newProgress, duration: 500, easing: Easing.inOut(Easing.ease) }).start();
    if (newProgress === 1) {
      Reanimated.timing(this.colorProgress, { toValue: 1, duration: 500, easing: Easing.inOut(Easing.ease) }).start();
      this.setState(state => state.done ? null : { done: true });
    }
    else {
      this.colorProgress.setValue(0);
      this.setState(state => state.done ? { done: false } : null);
    }
  }
}

const IconDoneDownloading = (props: {
  color: Reanimated.Node<number>;
  size: number;
}) =>
  <Svg viewBox="0 0 1000 1000" width={props.size} height={props.size}>
    <AnimatedPath fill={props.color} d="M962.8,644.2c-15,0-27.2,12.2-27.2,27.2v136.1c0,30-24.4,54.4-54.4,54.4H118.9c-30,0-54.4-24.4-54.4-54.4V671.4c0-15-12.2-27.2-27.2-27.2c-15,0-27.2,12.2-27.2,27.2v136.1c0,60.1,48.8,108.9,108.9,108.9h762.2c60.1,0,108.9-48.8,108.9-108.9V671.4C990,656.4,977.8,644.2,962.8,644.2z" />
    <AnimatedPath fill={props.color} d="M361.5,672.2c5.9,6,13.7,8.9,21.5,8.9c7.8,0,15.6-3,21.5-8.9l536.6-536.6c11.9-11.9,11.9-31.1,0-43.1c-11.9-11.9-31.1-11.9-43,0L383,607.6L101.8,326.4c-11.9-11.9-31.1-11.9-43,0c-11.9,11.9-11.9,31.1,0,43.1L361.5,672.2z" />
  </Svg>
