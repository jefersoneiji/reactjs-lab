import { useReducer, useState } from "react";

export const UseReducer = () => {
    return (
        <>
            <h2>Use Reducer - Form</h2>
            <Form />
            <h2>Use Reducer - Task App</h2>
            <TaskApp />
        </>
    );
};

// # Form with useReducer
type form_action =
    | { type: 'incremented_age'; }
    | { type: 'changed_name'; nextName: string; };

interface form_state {
    name: string;
    age: number;
}

type FormReducer = (state: form_state, action: form_action) => form_state;
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
                name: action.nextName,
                age: state.age
            };
        }
        default: {
            throw Error('Unknown action: ' + action);
        }
    }


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

// # Task App with useReducer
const AddTask = ({ onAddTask }: { onAddTask: (text: string) => void; }) => {
    const [text, setText] = useState('');
    return (
        <>
            <input placeholder="Add task" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={() => {
                setText('');
                onAddTask(text);
            }}>
                Add
            </button>
        </>
    );
};

interface task_component_props {
    task: task_interface;
    onChange: (task: task_interface) => void;
    onDelete: (id: number) => void;
}

const Task = ({ task, onChange, onDelete }: task_component_props) => {
    const [isEditing, setIsEditing] = useState(false);
    let task_content;

    if (isEditing) {
        task_content = (
            <>
                <input value={task.text} onChange={e => { onChange({ ...task, text: e.target.value }); }} />
                <button onClick={() => setIsEditing(false)}>Save</button>
            </>
        );
    } else {
        task_content = (
            <>
                {task.text}
                <button onClick={() => setIsEditing(true)}>Edit</button>
            </>
        );
    }

    return (
        <label>
            <input type="checkbox" checked={task.done} onChange={e => { onChange({ ...task, done: e.target.checked }); }} />
            {task_content}
            <button onClick={() => onDelete(task.id)}>
                Delete
            </button>
        </label>
    );

};

interface task_list_props {
    tasks: task_interface[];
    onChangeTask: (task: task_interface) => void;
    onDeleteTask: (id: number) => void;
}
const TaskList = ({ tasks, onChangeTask, onDeleteTask }: task_list_props) => {
    return (
        <ul>
            {tasks.map(task => (
                <li key={task.id} style={{ listStyleType: 'none' }}>
                    <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
                </li>
            ))}
        </ul>
    );
};

type TaskAction =
    | { type: 'added'; id: number; text: string; }
    | { type: 'changed'; task: task_interface; }
    | { type: 'deleted'; id: number; };

function task_reducer(tasks: task_interface[], action: TaskAction): task_interface[] {
    switch (action.type) {
        case 'added': {
            return [...tasks, {
                id: action.id,
                text: action.text,
                done: false
            }];
        }
        case 'changed': {
            return tasks.map(t => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return tasks.filter(t => t.id !== action.id);
        }
        default: {
            throw Error('Unknown action: ', action);
        }
    }
}

let nextId = 3;
interface task_interface {
    id: number;
    text: string;
    done: boolean;
}
const initial_tasks = [
    { id: 0, text: 'Visit Kafka Museum', done: true },
    { id: 1, text: 'Watch a puppet show', done: false },
    { id: 2, text: 'Lennon Wall Pic', done: false }
];

const TaskApp = () => {
    const [tasks, dispatch] = useReducer(task_reducer, initial_tasks);

    function handle_add_task(text: string) {
        dispatch({ type: 'added', id: nextId++, text });
    }

    function handle_change_task(task: task_interface) {
        dispatch({ type: 'changed', task });
    }

    function handle_delete_task(id: number) {
        dispatch({ type: 'deleted', id });
    }

    return (
        <>
            <AddTask onAddTask={handle_add_task} />
            <TaskList tasks={tasks} onChangeTask={handle_change_task} onDeleteTask={handle_delete_task} />
        </>
    );
};