type RootStackParamList = {
  FormScreen: CounterList,
  CounterScreen: CounterList
}

interface SwipeCounterSpecification {
  name: string,
  count: number,
}

interface CounterList {
  counters: SwipeCounterSpecification[],
}