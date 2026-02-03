import { useRef } from "react";

export const UseRefLab = () => {
    return (
        <>
            <h2>UseRef Lab</h2>
            <ReferencingAValueWithRef />
            <ManipulatingDOMWithARef />
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

const ManipulatingDOMWithARef = () => {
    const input_ref = useRef<null | HTMLInputElement>(null);

    function handle_click() {
        input_ref.current?.focus();
    }

    return (
        <>
            <h3>Manipulating DOM with a ref</h3>
            <input ref={input_ref} />
            <button onClick={handle_click}>Focus the input</button>
        </>
    );
};