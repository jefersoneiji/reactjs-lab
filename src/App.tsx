import './App.css';
import { UseSyncExternalStoreLab } from './hooks/use-syncexternalstore';
import { UseDeferredValueLab } from './hooks/use-deferred-value';
import { UseActionStateLab } from './hooks/use-action-state';
import { UseEffectEvenLab } from './hooks/use-effect-event';
import { UseTransitionLab } from './hooks/use-transition';
import { UseOptimisticLab } from './hooks/use-optimistic';
import { UseDebugLab } from './hooks/use-debug-value';
import { UseCallbackLab } from './hooks/use-callback';
import { ActivityLab } from './components/activity';
import { ProfilerLab } from './components/profiler';
import { SuspenseLab } from './components/suspense';
import { UseEffectLab } from './hooks/use-effect';
import { UseReducer } from './hooks/use-reducer';
import { UseMemoLab } from './hooks/use-memo';
import { UseState } from './hooks/use-state';
import { UseRefLab } from './hooks/use-ref';
import { UseIdLab } from './hooks/user-id';

function App() {
  return (
    <>
      <UseState />
      <UseIdLab />
      <UseRefLab />
      <UseMemoLab />
      <UseReducer />
      <ProfilerLab />
      <ActivityLab />
      <SuspenseLab />
      <UseDebugLab />
      <UseEffectLab />
      <UseCallbackLab />
      <UseEffectEvenLab />
      <UseOptimisticLab />
      <UseTransitionLab />
      <UseActionStateLab />
      <UseDeferredValueLab />
      <UseSyncExternalStoreLab />
    </>
  );
}

export default App;
