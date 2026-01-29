import { useRef } from "react";

export const UseRefLab = () => {
    return (
        <>
            <h2>UseRef Lab</h2>
            <ReferencingAValueWithRef />
        </>
    );
};

const ReferencingAValueWithRef = () => {
    let ref = useRef(0);

    function handle_click() {
        ref.current = ref.current + 1;
        alert('You clicked: ' + ref.current + ' times.');
    }

    return (
        <>
            <h3>Referencing a value with a ref</h3>
            <button onClick={handle_click}>Click me</button>
        </>
    );
};