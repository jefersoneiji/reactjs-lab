import { memo, useMemo, useState } from "react";

export const UseMemoLab = () => {
    return (
        <>
            <h2>Use Memo Lab</h2>
            <SkippingExpensiveRecalculations />
            <SkippingReRenderingOfComponents />
        </>
    );
};

type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

const createTodos = (): Todo[] => {
    const todos: Todo[] = [];

    for (let i = 0; i < 50; i++) {
        todos.push({
            id: i,
            text: "Todo " + (i + 1),
            completed: Math.random() > 0.5
        });
    }

    return todos;
};

const filterTodos = (todos: Todo[], tab: 'all' | 'active' | 'completed'): Todo[] => {
    console.log('[ARTIFICIALLY SLOW] Filtering ', todos.length + ' todos for "' + tab + ' "tab.');
    let startTime = performance.now();
    while (performance.now() - startTime < 500) { }

    return todos.filter(todo => {
        if (tab === 'all') {
            return true;
        } else if (tab === 'active') {
            return !todo.completed;
        } else if (tab === 'completed') {
            return todo.completed;
        }
        return false;
    });
};

const todos = createTodos();

type TodoListProps = {
    todos: Todo[];
    theme: string;
    tab: 'all' | 'active' | 'completed';
};

const TodoList = ({ todos, theme, tab }: TodoListProps) => {
    const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);

    return (
        <div className={theme}>
            <p><b>Nome: <code>filterTodos</code> is artificially slowed down!</b></p>
            <ul>
                {visibleTodos.map(todo => {
                    console.log('List item rendered!');
                    return (<li key={todo.id}>{todo.completed ? <s>{todo.text}</s> : todo.text}</li>);
                })}
            </ul>
        </div>
    );
};

const TodoApp = () => {
    const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all');
    const [isDark, setIsDark] = useState(false);

    return (
        <>
            <button onClick={() => setTab('all')}>All</button>
            <button onClick={() => setTab('active')}>Active</button>
            <button onClick={() => setTab('completed')}>Completed</button>
            <br />
            <label>
                <input
                    type='checkbox'
                    checked={isDark}
                    onChange={e => setIsDark(e.target.checked)}
                />
                Dark Mode
            </label>
            <hr />
            <TodoList todos={todos} tab={tab} theme={isDark ? "dark" : "light"} />
        </>
    );
};

const List = memo(function List({ items }: { items: Todo[] }) {
    console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
    let startTime = performance.now();
    while (performance.now() - startTime < 500) { }

    return (
        <ul>
            {items.map((item) => {
                console.log('ITEM FROM MEMO RENDERED!');
                return (
                    <li key={item.id}>
                        {item.completed ? <s>{item.text}</s> : item.text}
                    </li>
                );
            })}
        </ul>
    );
});

const TodoListMemo = ({ todos, theme, tab }: TodoListProps) => {
    const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);

    return (
        <div className={theme}>
            <p><b>Nome: <code>filterTodos</code> is artificially slowed down!</b></p>
            <List items={visibleTodos} />
        </div>
    );
};


const TodoAppMemo = () => {
    const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all');
    const [isDark, setIsDark] = useState(false);

    return (
        <>
            <button onClick={() => setTab('all')}>All</button>
            <button onClick={() => setTab('active')}>Active</button>
            <button onClick={() => setTab('completed')}>Completed</button>
            <br />
            <label>
                <input
                    type='checkbox'
                    checked={isDark}
                    onChange={e => setIsDark(e.target.checked)}
                />
                Dark Mode
            </label>
            <hr />
            <TodoListMemo todos={todos} tab={tab} theme={isDark ? "dark" : "light"} />
        </>
    );
};

const SkippingExpensiveRecalculations = () => {
    return (
        <>
            <h3>Skipping expensive recalculations</h3>
            <TodoApp />
        </>
    );
};

const SkippingReRenderingOfComponents = () => {
    return (
        <>
            <h3>Skipping re-rendering of components</h3>
            <TodoAppMemo />
        </>
    );
};