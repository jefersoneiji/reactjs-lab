import { useSyncExternalStore } from "react";

export const UseSyncExternalStoreLab = () => {
    return (
        <>
            <h2>Use Sync External Source Lab</h2>
            <SubscribingToAnExternalStore />
            <SubscribingToABrowserAPI />
            <ExtractTheLogicToACustomHook />
            <AddingSupportForServerRendering />
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


let mousePosition = { x: 0, y: 0 };

function subscribe(callback: () => void) {
    const handler = (e: MouseEvent) => {
        mousePosition = { x: e.clientX, y: e.clientY };
        callback();
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
}

function getSnapshot() {
    return `${mousePosition.x},${mousePosition.y}`;
}

const MouseTracker = () => {
    const mousePosition = useSyncExternalStore(subscribe, getSnapshot);

    const [x, y] = mousePosition.split(',').map(Number);

    return (
        <div style={{ height: '100vh', cursor: 'crosshair', padding: '20px' }}>
            <div style={{
                position: 'fixed',
                left: x + 15, // Offset so it doesn't flicker under the cursor
                top: y + 15,
                background: '#007AFF',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                pointerEvents: 'none', // Prevents the div from blocking mouse events
                fontSize: '12px'
            }}>
                {x}px, {y}px
            </div>
            <h2>Move your mouse around!</h2>
            <p>The coordinates are being synced directly from the Browser API.</p>
        </div>
    );
};

const SubscribingToABrowserAPI = () => {
    return (
        <>
            <h3>Subscribing To a browser API</h3>
            <MouseTracker />
        </>
    );
};

const useMouseTracker = () => {
    const mousePosition = useSyncExternalStore(subscribe, getSnapshot);
    const [x, y] = mousePosition.split(',').map(Number);
    return { x, y };
};

const UseHook = () => {
    const { x, y } = useMouseTracker();
    return (
        <div style={{ height: '100vh', cursor: 'crosshair', padding: '20px' }}>
            <div style={{
                position: 'fixed',
                left: x + 20, // Offset so it doesn't flicker under the cursor
                top: y + 20,
                background: 'red',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                pointerEvents: 'none', // Prevents the div from blocking mouse events
                fontSize: '12px'
            }}>
                {x}px, {y}px
            </div>
            <h2>Move your mouse around!</h2>
            <p>The coordinates are being synced directly from the Browser API.</p>
        </div>
    );
};

const ExtractTheLogicToACustomHook = () => {
    return (
        <>
            <h3>Extract The Logic to a Custom Hook</h3>
            <UseHook />
        </>
    );
};

const ServerSupport = () => {
    const mousePosition = useSyncExternalStore(subscribe, getSnapshot, () => '0,0');

    const [x, y] = mousePosition.split(',').map(Number);

    return (
        <div style={{ height: '100vh', cursor: 'crosshair', padding: '20px' }}>
            <div style={{
                position: 'fixed',
                left: x + 25, // Offset so it doesn't flicker under the cursor
                top: y + 25,
                background: 'green',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px',
                pointerEvents: 'none', // Prevents the div from blocking mouse events
                fontSize: '12px'
            }}>
                {x}px, {y}px
            </div>
            <h2>Move your mouse around!</h2>
            <p>The coordinates are being synced directly from the Browser API.</p>
        </div>
    );
};

const AddingSupportForServerRendering = () => {
    return (
        <>
            <h3>Adding Support For Server Rendering</h3>
            <ServerSupport />
        </>
    );
};