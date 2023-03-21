# useCombine hook for React

<img src="logo.png" align="right"
     alt="Pic by Craftwork Design" width="100">

Zero-Dependency React hook to combine reducers to global complex state with single dispatch. It's like [redux combineReducers](https://redux.js.org/api/combinereducers) with well typescript support.
Use it with React Context.

## Setup
with yarn
```bash
yarn add usecombine
```

with npm
```
npm install usecombine
```


## Usage

```tsx
import useCombine from 'usecombine';
import { useReducer } from 'react';


// User state slice
const userInitialState = { name: 'name' };
type UserAction = {type: 'login', payload: {name: string}} | {type: 'logout'}
const userReducer = (state, action: UserAction) => {
  switch(action.type) {
    case 'login': {
      state.name = action.payload.name
    }
    case 'logout': {
      state.name = null
    }
  }
}

// Todos state slice
const todosInitialState = { todos: [1, 2, 3] };
type TodosAction = {type: 'set', payload: Array<number>} | {type: 'reset'}
const todosReducer = (state, action: TodosAction) => {
  switch(action.type) {
    case 'set': {
      state.todos = action.payload
    }
    case 'logout': {
      state.todos = []
    }
  }
}


function App(){
  const [state, dispatch] = useCombine({
    user: useReducer(userReducer, userInitialState),
    todos: useReducer(todosReducer, todosInitialState),
  })

  const {user, todos} = state;

  return (
    <>
      <div>{user.name}</div>
      {todos.map(todo => <div key={todo}>{todo}</div>)}
    </>
  )
}
```

### Usage with React Contenxt

```tsx
//user-slice.ts
type UserState = {
  name: string | null
}

//todos-slice.tsx
type TodosState = {
  todos: Array<number>
}

//context.tsx
import useCombine from 'usecombine';
import { userReducer, userInitialState,  UserState, UserAction } from './slices/user-slice'
import { todosReducer, todosInitialState, TodosState, TodosAction } from './slices/todos-slice'

type AppState = {user: UserState, todos: TodosState};
type AppAction = UserAction & TodosAction;
type ContextProps = {
  state: AppState,
  dispatch: Dispatch<AppAction>
};
const AppStateContext = createContext<ContextProps>({} as ContextProps);

function AppStateProvider({children}: PropsWithChildren){
  const [state, dispatch] = useCombine<AppState, AppAction>({
    user: useReducer(userReducer, userInitialState),
    user: useReducer(todosReducer, todosInitialState),
  });

  const store = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <AppStateContext.Provider value={store}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  return useContext(AppStateContext);
}
```


**Tested With [Vitests](https://vitest.dev/)**