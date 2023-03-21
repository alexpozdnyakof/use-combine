import { Dispatch, Reducer, ReducerAction, ReducerState } from 'react';

type Reducers<T, A> = {
  [K in keyof T]: [
    ReducerState<Reducer<T[K], A>>,
    Dispatch<ReducerAction<Reducer<T[K], A>>>,
  ];
}

export default function useCombine<
  State extends Record<string, object>,
  Action = any,
>(reducers: Reducers<State, Action>) {
  const combinedState = Object.entries(reducers).reduce((acc, [sliceName, [subState]]) => Object.assign(acc, { [sliceName]: subState }), {});

  const combinedDispatch = (action: Action) => Object.values(reducers)
      .map(([_, dispatch]) => dispatch)
      .forEach((dispatch) => dispatch(action));

  return [combinedState, combinedDispatch] as [State, Dispatch<Action>];
}