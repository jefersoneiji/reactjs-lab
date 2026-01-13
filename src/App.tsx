import './App.css';
import { SuspenseLab } from './components/suspense';
import { UseCallbackLab } from './hooks/use-callback';
import { UseEffectLab } from './hooks/use-effect';
import { UseReducer } from './hooks/use-reducer';
import { UseState } from './hooks/use-state';

function App() {
  return (
    <>
      <h1>Hooks</h1>
      <UseState />
      <UseReducer />
      <SuspenseLab />
      <UseEffectLab />
      <UseCallbackLab />
    </>
  );
}

export default App;
