import './activity.css';
import { Activity, useState } from "react";

export const ActivityLab = () => {
    return (
        <>
            <h2>Activity Lab</h2>
            <RestoringStateOfComponents />
        </>
    );
};

const Sidebar = () => {
    const [is_expanded, setIsExpanded] = useState(false);

    return (
        <nav>
            <button onClick={() => setIsExpanded(!is_expanded)}>
                Overview
                <span className={`indicator ${is_expanded ? 'down' : 'right'}`}>
                    &#9650;
                </span>
            </button>

            {is_expanded && (
                <ul>
                    <li>Section 1</li>
                    <li>Section 2</li>
                    <li>Section 3</li>
                </ul>
            )}
        </nav>
    );
};
const Main = () => {
    const [is_showing_side_bar, setIsShowingSideBar] = useState(true);
    return (
        <>
            <Activity mode={is_showing_side_bar ? 'visible' : 'hidden'}>
                <Sidebar />
            </Activity>

            <main>
                <button onClick={() => setIsShowingSideBar(!is_showing_side_bar)}>
                    Toggle sidebar
                </button>
                <h1>Main content</h1>
            </main>
        </>
    );
};

const RestoringStateOfComponents = () => {
    return (
        <>
            <h3>Restoring State Of Components</h3>
            <Main />
        </>
    );
};
