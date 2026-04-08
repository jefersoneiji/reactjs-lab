import { useState } from "react";

export const UseStateLab = () => {
    return (
        <>
            <h2>Use State Lab</h2>
            <AddingStateToAComponent />
            <UpdatingStateBasedOnPreviousState />
            <UpdatingObjectsAndArraysInState />
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

const Form = () => {
    const [form, setForm] = useState({
        firstName: "Barbara",
        lastName: 'Hepworth',
        'email': 'bhepworth@sculpture.com'
    })

    return (
        <>
            <label>
                First Name:
                <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
            </label>
            <label>
                Last Name:
                <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
            </label>
            <label>
                Email:
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </label>
            <p>
                {form.firstName}{' '}
                {form.lastName}{' '}
                ({form.email}){' '}
            </p>    
        </>
    )
}

const UpdatingObjectsAndArraysInState = () => {
    return (
        <>
            <h3>Updating objects and arrays in state</h3>
            <Form />
        </>
    );
};
