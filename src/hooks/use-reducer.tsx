import { useReducer } from "react";

export const UseReducer = () => {
    return (
        <>
            <h2>Use Reducer - Form</h2>
            <Form />

        </>
    );
};

type FormReducer = (state: { name: string, age: number; }, action: { type: string; nextName?: string; }) => { name: string, age: number; };
const form_reducer: FormReducer = (state, action) => {
    switch (action.type) {
        case 'incremented_age': {
            return {
                name: state.name,
                age: state.age + 1
            };
        }
        case 'changed_name': {
            return {
                name: action.nextName || '',
                age: state.age
            };
        }
    }

    throw Error('Unknown action: ' + action.type);
};
const form_initial_state = { name: 'Taylor', age: 42 };

const Form = () => {
    const [state, dispatch] = useReducer(form_reducer, form_initial_state);

    function handle_button_click() {
        dispatch({ type: 'incremented_age' });
    }
    function handle_input_change(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch({ type: 'changed_name', nextName: event.target.value });
    }

    return (
        <>
            <input value={state.name} onChange={handle_input_change} />
            <br />
            <br />
            <button onClick={handle_button_click}>
                Increment age
            </button>
            <p>Hello, {state.name}. You are {state.age}.</p>
        </>
    );
};