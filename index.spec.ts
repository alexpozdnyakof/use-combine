import useCombine from './index';
import { vi, assert, expect, test } from 'vitest'


  const userInitialState = { name: 'name' };
  const todosInitialState = { todos: [1, 2, 3] };

  test('should merge states with provided keys', () => {
    const [state] = useCombine({
      user: [userInitialState, (state) => state],
      todos: [todosInitialState, (state) => state],
    });

    assert.deepEqual(state, {
      user: userInitialState,
      todos: todosInitialState,
    });
  });

  test('should call all passed reducers', () => {
    const reducerA = vi.fn();
    const reducerB = vi.fn();
    const action = { type: 'init' };

    const [_, dispatch] = useCombine({
      user: [userInitialState, reducerA],
      todos: [todosInitialState, reducerB],
    });

    dispatch(action);

    expect(reducerA).toHaveBeenCalledTimes(1);
    expect(reducerA).toHaveBeenCalledWith(action);
    expect(reducerB).toHaveBeenCalledTimes(1);
    expect(reducerB).toHaveBeenCalledWith(action);
  });
