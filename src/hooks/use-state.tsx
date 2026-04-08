import { useState } from "react";

export const UseStateLab = () => {
    return (
        <>
            <h2>Use State Lab</h2>
            <AddingStateToAComponent />
        </>
    );
};

const CounterApp = () => {
    const [count, setCount] = useState(0)

    const handleClick = () => {
        setCount(count + 1)
    }

    return (
        <button onClick={handleClick}>
            You pressed me {count} times
        </button>
    );
};

const AddingStateToAComponent = () => {
    return (
        <>
            <h3>Adding state to a component</h3>
            <CounterApp />
        </>
    );
};
