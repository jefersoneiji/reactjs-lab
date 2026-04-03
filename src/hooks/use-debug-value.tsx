import { useDebugValue, useState } from "react";

export const UseDebugLab = () => {
    return (
        <>
            <h2>Use Debug Lab</h2>
            <AddingALabelToACustomHook />
        </>
    );
};


const useCounter = (initialValue?: number): [() => void, () => void, number] => {
    const [count, setCount] = useState(initialValue || 0);
    
    useDebugValue(count > 0 ? "Value greater than zero." : "Value is zero.");
    
    const increaseCounter = () => setCount(v => v + 1);
    const decreaseCounter = () => setCount(v => v - 1);

    return [increaseCounter, decreaseCounter, count];
};

const CounterApp = () => {
    const [increaseCounter, decreaseCounter, count] = useCounter(0);

    return (
        <>
            <p>current value is: {count}</p>
            <button onClick={() => increaseCounter()}>Increase</button>
            <button onClick={() => decreaseCounter()}>Decrease</button>
        </>
    );
};

const AddingALabelToACustomHook = () => {
    return (
        <>
            <h3>Adding a label to a custom hook</h3>
            <CounterApp />
        </>
    );
};

