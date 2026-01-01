import './App.css';
import { SuspenseLab } from './components/suspense';
import { UseReducer } from './hooks/use-reducer';
import { UseState } from './hooks/use-state';

function App() {
  return (
    <>
      <h1>Hooks</h1>
      <UseState />
      <UseReducer />
      <SuspenseLab />
    </>
  );
}

export default App;
