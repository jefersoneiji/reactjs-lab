import './App.css';
import { UseReducer } from './hooks/use-reducer';
import { UseState } from './hooks/use-state';

function App() {
  return (
    <>
      <h1>Hooks</h1>
      <UseState />
      <UseReducer />
    </>
  );
}

export default App;
