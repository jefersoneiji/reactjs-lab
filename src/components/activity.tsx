import './activity.css';
import { Activity, Suspense, use, useState } from "react";

export const ActivityLab = () => {
    return (
        <>
            <h2>Activity Lab</h2>
            <RestoringStateOfComponents />
            <RestoringTheDOMOfHiddenComponents />
            <PreRenderingComponent />
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

const TabButton = ({ onClick, children, isActive }: { onClick: () => void; children: React.ReactNode; isActive: boolean; }) => {
    if (isActive) {
        return <b>{children}</b>;
    }

    return (
        <button onClick={onClick}>
            {children}
        </button>
    );
};

const Contact = () => {
    return (
        <div>
            <p>Send me a message!</p>

            <textarea />

            <p>You can find me online here:</p>
            <ul>
                <li>admin@mysite.com</li>
                <li>+123456789</li>
            </ul>
        </div>
    );
};

const Home = () => {
    return (
        <p>Welcome to my profile!</p>
    );
};

const RestoreDOMApp = () => {
    const [active_tab, setActiveTab] = useState('contact');

    return (
        <>
            <TabButton isActive={active_tab === 'home'} onClick={() => setActiveTab('home')}>
                Home
            </TabButton>
            <TabButton isActive={active_tab === 'contact'} onClick={() => setActiveTab('contact')}>
                Contact
            </TabButton>

            <hr />

            <Activity mode={active_tab === 'home' ? 'visible' : 'hidden'}>
                <Home />
            </Activity>
            <Activity mode={active_tab === 'contact' ? 'visible' : 'hidden'}>
                <Contact />
            </Activity>
        </>
    );
};

const RestoringTheDOMOfHiddenComponents = () => {
    return (
        <>
            <h3>Restoring the DOM of hidden components</h3>
            <RestoreDOMApp />
        </>
    );
};

let cache = new Map();

function fetch_data(url: string) {
    if (!cache.has(url)) {
        cache.set(url, getData(url));
    }
    return cache.get(url);
}

async function getData(url: string) {
    if (url.startsWith('/posts')) {
        return await getPosts();
    } else {
        throw Error('Not implemented.');
    }
}

async function getPosts() {
    await new Promise(resolve => { setTimeout(resolve, 1000); });
    let posts = [];
    for (let i = 0; i < 10; i++) {
        posts.push({ id: i, title: 'Post #' + (i + 1) });
    }
    return posts;
}

const Posts = () => {
    const posts = use(fetch_data('/posts')) as { id: number; title: string }[];

    return (
        <ul>
            {posts.map(post => <li key={post.id}>{post.title}</li>)}
        </ul>
    );
};

const PreRenderingApp = () => {
    const [active_tab, setActiveTab] = useState('home');

    return (
        <>
            <TabButton isActive={active_tab === 'home'} onClick={() => setActiveTab('home')}>
                Home
            </TabButton>
            <TabButton isActive={active_tab === 'posts'} onClick={() => setActiveTab('posts')}>
                Posts
            </TabButton>

            <hr />

            <Suspense fallback={<h1>🌀 Loading...</h1>}>
                <Activity mode={active_tab === 'home' ? 'visible' : 'hidden'}>
                    <Home />
                </Activity>
                <Activity mode={active_tab === 'posts' ? 'visible' : 'hidden'}>
                    <Posts />
                </Activity>
            </Suspense>
        </>
    );
};

const PreRenderingComponent = () => {
    return (
        <>
            <h3>Pre-Rendering Content that's likely to become visible</h3>
            <PreRenderingApp />
        </>
    );
};

