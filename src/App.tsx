import './App.css';
import { UseEffectEvenLab } from './hooks/use-effect-event';
import { UseCallbackLab } from './hooks/use-callback';
import { SuspenseLab } from './components/suspense';
import { UseEffectLab } from './hooks/use-effect';
import { UseReducer } from './hooks/use-reducer';
import { UseState } from './hooks/use-state';
import { UseOptimisticLab } from './hooks/use-optimistic';
import { UseIdLab } from './hooks/user-id';

function App() {
  return (
    <>
      <h1>Hooks</h1>
      <UseState />
      <UseReducer />
      <SuspenseLab />
      <UseEffectLab />
      <UseCallbackLab />
      <UseEffectEvenLab />
      <UseOptimisticLab />
      <UseIdLab />
    </>
  );
}

export default App;
