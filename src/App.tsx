import './App.css';
import { UseEffectEvenLab } from './hooks/use-effect-event';
import { UseOptimisticLab } from './hooks/use-optimistic';
import { UseCallbackLab } from './hooks/use-callback';
import { ProfilerLab } from './components/profiler';
import { SuspenseLab } from './components/suspense';
import { UseEffectLab } from './hooks/use-effect';
import { UseReducer } from './hooks/use-reducer';
import { UseState } from './hooks/use-state';
import { UseRefLab } from './hooks/use-ref';
import { UseIdLab } from './hooks/user-id';
import { ActivityLab } from './components/activity';
import { UseTransitionLab } from './hooks/use-transition';
import { UseMemoLab } from './hooks/use-memo';

function App() {
  return (
    <>
      <UseState />
      <UseReducer />
      <SuspenseLab />
      <UseEffectLab />
      <UseCallbackLab />
      <UseEffectEvenLab />
      <UseOptimisticLab />
      <UseTransitionLab />
      <UseMemoLab />
      <UseIdLab />
      <UseRefLab />
      <ProfilerLab />
      <ActivityLab />
    </>
  );
}

export default App;
