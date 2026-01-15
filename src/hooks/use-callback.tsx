import './use-callback.css';

import { createContext, memo, useCallback, useContext, useEffect, useReducer, useRef, useState, type Dispatch, type FormEvent, type ReactNode } from "react";

export const UseCallbackLab = () => {
    return (
        <>
            <h2>UseCallback Lab</h2>
            <PreventComponentReRenders />
            <UpdatingStateFromAMemoizedCallback />
            <PreventAnEffectFromFiringTooOften />
            <OptimizingACustomHook />
        </>
    );
};

const PreventComponentReRenders = () => {
    const [is_dark, setIsDark] = useState(false);
    return (
        <>
            <h3>Prevent unnecessary component re-renders</h3>
            <label>
                <input type='checkbox' checked={is_dark} onChange={e => setIsDark(e.target.checked)} />
                Dark Mode
            </label>
            <hr />
            <ProductPage referrer_id="wizard_of_oz" product_id={123} theme={is_dark ? 'dark' : 'light'} />
        </>
    );
};

interface IProductPage {
    product_id: number,
    referrer_id: string,
    theme: string;
}

interface order_details {
    street: string,
    city: string,
    zipCode: string,
    count: number;
}
const ShippingForm = memo(({ onSubmit }: { onSubmit: (input: order_details) => void; }) => {
    const [count, setCount] = useState(1);

    console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
    let start_time = performance.now();
    while (performance.now() - start_time < 500) {
        // do nothing for 500 ms to emulate extremely slow code
    }

    function handle_submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form_data = new FormData(e.currentTarget);
        const order_details = {
            ...Object.fromEntries(form_data),
            count
        } as order_details;
        console.log('Order details are: ', order_details);
        onSubmit(order_details);
    }

    return (
        <form onSubmit={handle_submit} >
            <p><b>Note: <code>Shipping Form</code> is artificially slowed down!</b></p>
            <label>
                Number of items:
                <button type="button" onClick={() => setCount(c => c - 1)}>-</button>
                {count}
                <button type="button" onClick={() => setCount(c => c + 1)}>+</button>
            </label>
            <label>
                Street:
                <input name="street" />
            </label>
            <label>
                City:
                <input name="city" />
            </label>
            <label>
                Postal Code:
                <input name="zipCode" />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
});

const ProductPage = ({ product_id, referrer_id, theme }: IProductPage) => {
    const handle_submit = useCallback((order_details: order_details) => {
        return post('/product/' + product_id + '/buy', {
            referrer: referrer_id,
            order_details
        });
    }, [product_id, referrer_id]);

    return (
        <div className={theme}>
            <ShippingForm onSubmit={handle_submit} />
        </div>
    );
};

function post(url: string, data: { referrer: string, order_details: any; }) {
    console.log('POST/ ' + url);
    console.log('data is: ', data);
}

interface Todo {
    id: number,
    text: string;
}

let next_id = 1;

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const prev_fn_ref = useRef<(text: string) => void | null>(null);

    const handle_add_todo = useCallback((text: string) => {
        const new_todo = { id: next_id++, text };
        setTodos(todos => [...todos, new_todo]);
    }, []);

    useEffect(() => {
        console.log(prev_fn_ref.current === handle_add_todo ? "'handle_add_todo: SAME reference" : "'handle_add_todo: NEW reference");
        prev_fn_ref.current = handle_add_todo;
    });

    return (
        <div>
            <button onClick={() => handle_add_todo('new todo')}>
                Add todo
            </button>

            <ul>
                {todos.map(todo => (<li key={todo.id}>{todo.text}</li>))}
            </ul>
        </div>
    );
};

const UpdatingStateFromAMemoizedCallback = () => {
    return (
        <>
            <h3>Updating state from a memoized callback</h3>
            <TodoList />
        </>
    );
};

const create_connection = ({ server_url, room_id }: { server_url: string, room_id: string; }) => {
    return {
        connect() {
            console.log('✅ Connecting to ' + room_id + " room at " + server_url);
        },
        disconnect() {
            console.log('❌ Disconnected from ' + room_id + " room at " + server_url);
        },
    };
};

const ChatRoom = ({ room_id }: { room_id: string; }) => {
    const [message, setMessage] = useState('');

    const create_options = useCallback(() => {
        return {
            server_url: 'https://localhost:1234',
            room_id
        };
    }, [room_id]);

    useEffect(() => {

        const options = create_options();
        const connection = create_connection(options);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [create_options]);

    return (
        <>
            <h4>Welcome to the {room_id} room!</h4>
            <input value={message} onChange={e => setMessage(e.target.value)} />
        </>
    );
};

const App = () => {
    const [room_id, setRoomId] = useState('general');
    const [show, setShow] = useState(false);

    return (
        <>
            <label>
                Choose the chat room: {" "}
                <select value={room_id} onChange={e => setRoomId(e.target.value)}>
                    <option value="general">general</option>
                    <option value="travel">travel</option>
                    <option value="music">music</option>
                </select>
            </label>
            {" "}
            <button onClick={() => setShow(!show)}>
                {show ? 'Close chat' : 'Open chat'}
            </button>
            {show && <hr />}
            {show && <ChatRoom room_id={room_id} />}
        </>
    );
};

const PreventAnEffectFromFiringTooOften = () => {
    return (
        <>
            <h3>Preventing An Effect From Firing Too Often</h3>
            <App />
        </>
    );
};

type RouterState = string;

type NavigateAction = {
    type: 'navigate',
    url: string;
};

type BackAction = {
    type: 'back';
};

type RouterAction = NavigateAction | BackAction;

type RouterContextValue = {
    state: RouterState,
    dispatch: Dispatch<RouterAction>;
};

const RouterStateContext = createContext<RouterContextValue | null>(null);

function router_reducer(state: RouterState, action: RouterAction): RouterState {
    switch (action.type) {
        case "navigate":
            return action.url;
        case "back":
            return "/";
        default:
            return state;
    }
}

function RouterStateProvider({ children }: { children: ReactNode; }) {
    const [state, dispatch] = useReducer(router_reducer, '/');

    return (
        <RouterStateContext.Provider value={{ state, dispatch }}>
            {children}
        </RouterStateContext.Provider>
    );
}

type Router = {
    navigate: (url: string) => void;
    goBack: () => void;
};

function useRouter(): Router {
    const context = useContext(RouterStateContext);

    if (!context) {
        throw new Error('useRouter must be used within RouterStateProvider');
    }

    const { dispatch } = context;

    const navigate = useCallback((url: string) => {
        dispatch({ type: 'navigate', url });
    }, [dispatch]);

    const goBack = useCallback(() => {
        dispatch({ type: 'back' });
    }, [dispatch]);

    return {
        navigate,
        goBack,
    };
}

const Home = () => {
    const { navigate } = useRouter();

    return (
        <div>
            <h1>Home</h1>

            <button onClick={() => navigate("/profile")}>
                Go to profile
            </button>
        </div>
    );
};

function Profile() {
    const { goBack } = useRouter();

    return (
        <div>
            <h1>Profile</h1>

            <button onClick={goBack}>
                Back
            </button>
        </div>
    );
}

const RouterView = () => {
    const context = useContext(RouterStateContext);

    if (!context) {
        throw new Error("Router View must be used within RouterStateProvider");
    }

    const { state: route } = context;

    switch (route) {
        case "/profile":
            return <Profile />;
        default:
            return <Home />;
    }
};

const OptimizingACustomHook = () => {
    return (
        <>
            <h3>Optimizing a Custom Hook</h3>
            <RouterStateProvider>
                <RouterView />
            </RouterStateProvider>
        </>
    );
};