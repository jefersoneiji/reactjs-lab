import { useEffect, useState } from "react";

export const UseEffectLab = () => {
    return (
        <>
            <h2>UseEffect Lab</h2>
            <SyncToExternalSource />
            <SyncToExternalSourceCustomHook />
        </>
    );
};

const create_connection = (server_url: string, room_id: string) => {
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
    const [server_url, setServerUrl] = useState('https://localhost:1234');

    useEffect(() => {
        const connection = create_connection(server_url, room_id);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [room_id, server_url]);

    return (
        <>
            <label>
                Server URL: {' '}
                <input value={server_url} onChange={e => setServerUrl(e.target.value)} />
            </label>
            <h4>Welcome to the {room_id} room!</h4>
        </>
    );
};

const useChatRoom = ({ server_url, room_id }: { server_url: string, room_id: string; }) => {
    useEffect(() => {
        const connection = create_connection(server_url, room_id);
        connection.connect();
        return () => connection.disconnect();
    }, [room_id, server_url]);
};

const ChatRoomWithCustomHook = ({ room_id }: { room_id: string; }) => {
    const [server_url, setServerUrl] = useState('https://localhost:1234');

    useChatRoom({ server_url, room_id });

    return (
        <>
            <label>
                Server URL: {' '}
                <input value={server_url} onChange={e => setServerUrl(e.target.value)} />
            </label>
            <h4>Welcome to the {room_id} room!</h4>
        </>
    );
};

const SyncToExternalSourceCustomHook = () => {
    const [room_id, setRoomId] = useState('general');
    const [show, setShow] = useState(false);

    return (
        <>
            <h3>Connect to an external source (with custom hook)</h3>
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
            {show && <ChatRoomWithCustomHook room_id={room_id} />}
        </>
    );
};

const SyncToExternalSource = () => {
    const [room_id, setRoomId] = useState('general');
    const [show, setShow] = useState(false);

    return (
        <>
            <h3>Connect to an external source</h3>
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