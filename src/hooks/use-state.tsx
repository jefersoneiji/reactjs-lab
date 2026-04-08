import { useState } from "react";

export const UseStateLab = () => {
    return (
        <>
            <h2>Use State Lab</h2>
            <AddingStateToAComponent />
            <UpdatingStateBasedOnPreviousState />
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

const AgeApp = () => {
    const [age, setAge] = useState(42)

    const handleClick = () => {
        setAge(a => a + 1)
        setAge(a => a + 1)
        setAge(a => a + 1)
    }

    return (
        <>
            <h3>Your current age is {age}</h3>
            <button onClick={handleClick}>
                +3
            </button>
        </>
    );
};

const UpdatingStateBasedOnPreviousState = () => {
    return (
        <>
            <h3>Updating state based on previous state</h3>
            <AgeApp />
        </>
    );
};
