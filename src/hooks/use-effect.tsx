import { useEffect, useRef, useState } from "react";
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export const UseEffectLab = () => {
    return (
        <>
            <h2>UseEffect Lab</h2>
            <SyncToExternalSource />
            <SyncToExternalSourceCustomHook />
            <ControllingNonReactWidget />
            <FetchData />
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

class MapWidget {
    map: L.Map;

    constructor(domNode: HTMLElement) {
        this.map = L.map(domNode, {
            zoomControl: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            scrollWheelZoom: false,
            touchZoom: false,
            zoomSnap: 0.1
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }).addTo(this.map);

        this.map.setView([0, 0], 0);
    }

    setZoom(level: number) {
        this.map.setZoom(level);
    }
}

const Map = ({ zoomLevel }: { zoomLevel: number; }) => {
    const container_ref = useRef(null);
    const map_ref = useRef<MapWidget | null>(null);

    useEffect(() => {
        if (map_ref.current === null && container_ref.current !== null) {
            map_ref.current = new MapWidget(container_ref.current);
        }

        const map = map_ref.current;
        if (map) {
            map.setZoom(zoomLevel);
        }
    }, [zoomLevel]);

    return (
        <div style={{ width: 200, height: 200 }} ref={container_ref} />
    );
};

const ControllingNonReactWidget = () => {
    const [zoomLevel, setZoomLevel] = useState(0);

    return (
        <>
            <h3>Control a non React widget</h3>
            <h4>Zoom Level: {zoomLevel}x</h4>
            <button onClick={() => setZoomLevel(p => p + 1)}>+</button>
            <button onClick={() => setZoomLevel(p => p - 1)}>-</button>
            <hr />
            <Map zoomLevel={zoomLevel} />
        </>
    );
};

async function fetch_bio(person: string): Promise<string> {
    const delay = person === 'Bob' ? 2000 : 200;
    return new Promise(resolve => {
        setTimeout(() => { resolve('This is ' + person + 's bio.'); }, delay);
    });
}

const FetchData = () => {
    const [person, setPerson] = useState('Alice');
    const [bio, setBio] = useState<string | null>(null);

    useEffect(() => {
        async function start_fetching() {
            setBio(null);
            const result = await fetch_bio(person);
            if (!ignore) {
                setBio(result);
            }
        }
        let ignore = false;
        start_fetching();
        return () => {
            ignore = true;
        };
    }, [person]);

    return (
        <>
            <h3>Fetching Data</h3>
            <select value={person} onChange={e => { setPerson(e.target.value); }}>
                <option value="Alice">Alice</option>
                <option value="Bob">Bob</option>
                <option value="Taylor">Taylor</option>
            </select>
            <hr />
            <p><i>{bio ?? 'Loading...'}</i></p>
        </>
    );
};