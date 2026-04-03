import { useSyncExternalStore } from "react";

export const UseSyncExternalStoreLab = () => {
    return (
        <>
            <h2>Use Sync External Source Lab</h2>
            <SubscribingToAnExternalStore />
        </>
    );
};

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners: (() => void)[] = [];

const todosStore = {
    getSnapshot() {
        return todos;
    },
    addTodo() {
        todos = [...todos, { id: nextId++, text: "Todo #" + nextId }];
        emitChange();
    },
    subscribe(listener: () => void) {
        listeners = [...listeners, listener];
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};

const emitChange = () => {
    for (let listener of listeners) {
        listener();
    }
};

const ExternalApp = () => {
    const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
    return (
        <>
            <button onClick={() => todosStore.addTodo()}>Add todo</button>
            <hr />
            <ul>
                {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
            </ul>
        </>
    );
};

const SubscribingToAnExternalStore = () => {
    return (
        <>
            <h3>Subscribing To An External Store</h3>
            <ExternalApp />
        </>
    );
};