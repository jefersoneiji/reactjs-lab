import { useState } from "react";

export const UseState = () => {
    const [counter, setCounter] = useState(0);
    return (
        <>
            <h2>Use State - counter</h2>
            <p><b>count is: {counter}</b></p>
            <button onClick={() => setCounter(prev => prev + 1)}>Increase counter</button>
        </>
    );
};