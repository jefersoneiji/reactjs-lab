import { memo, Suspense, use, useDeferredValue, useState } from "react";

export const UseDeferredValueLab = () => {
    return (
        <>
            <h2>Use Deferred Value Lab</h2>
            <ShowingStaleContentWhileFreshContentIsLoading />
            <IndicatingTheContentIsStale />
            <DeferringReRenderingForAPartOfTheUI />
        </>
    );
};

type Album = {
    id: number;
    title: string;
    year: number;
};

// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map<string, Promise<Album[]>>();

export function fetchData(url: string): Promise<Album[]> {
    if (!cache.has(url)) {
        cache.set(url, getData(url));
    }
    return cache.get(url)!;
}

async function getData(url: string): Promise<Album[]> {
    if (url.startsWith('/search?q=')) {
        return await getSearchResults(url.slice('/search?q='.length));
    } else {
        throw Error('Not implemented');
    }
}

async function getSearchResults(query: string) {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
        setTimeout(resolve, 1000);
    });

    const allAlbums = [{
        id: 13,
        title: 'Let It Be',
        year: 1970
    }, {
        id: 12,
        title: 'Abbey Road',
        year: 1969
    }, {
        id: 11,
        title: 'Yellow Submarine',
        year: 1969
    }, {
        id: 10,
        title: 'The Beatles',
        year: 1968
    }, {
        id: 9,
        title: 'Magical Mystery Tour',
        year: 1967
    }, {
        id: 8,
        title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
        year: 1967
    }, {
        id: 7,
        title: 'Revolver',
        year: 1966
    }, {
        id: 6,
        title: 'Rubber Soul',
        year: 1965
    }, {
        id: 5,
        title: 'Help!',
        year: 1965
    }, {
        id: 4,
        title: 'Beatles For Sale',
        year: 1964
    }, {
        id: 3,
        title: 'A Hard Day\'s Night',
        year: 1964
    }, {
        id: 2,
        title: 'With The Beatles',
        year: 1963
    }, {
        id: 1,
        title: 'Please Please Me',
        year: 1963
    }];

    const lowerQuery = query.trim().toLowerCase();
    return allAlbums.filter(album => {
        const lowerTitle = album.title.toLowerCase();
        return (
            lowerTitle.startsWith(lowerQuery) ||
            lowerTitle.indexOf(' ' + lowerQuery) !== -1
        );
    });
}


const SearchResults = ({ query }: { query: string; }) => {
    if (query === '') {
        return null;
    }

    const albums = use(fetchData(`/search?q=${query}`));
    if (albums.length === 0) {
        return <p>No matches for <i>"{query}"</i></p>;
    }

    return (
        <ul>
            {albums.map(album => <li key={album.id}>{album.title} ({album.year})</li>)}
        </ul>
    );

};

const App = () => {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);

    return (
        <>
            <label>
                Search albums:
                <input value={query} onChange={e => setQuery(e.target.value)} />
            </label>
            <Suspense fallback={<h2>Loading...</h2>}>
                <SearchResults query={deferredQuery} />
            </Suspense>
        </>
    );
};

const ShowingStaleContentWhileFreshContentIsLoading = () => {
    return (
        <>
            <h3>Showing stale content while fresh content is loading</h3>
            <App />
        </>
    );
};

const AppWithStaleIndicator = () => {
    const [query, setQuery] = useState('');
    const deferredQuery = useDeferredValue(query);
    const isStale = query !== deferredQuery;

    return (
        <>
            <label>
                Search albums:
                <input value={query} onChange={e => setQuery(e.target.value)} />
            </label>
            <Suspense fallback={<h2>Loading...</h2>}>
                <div style={{ opacity: isStale ? .5 : 1 }}>
                    <SearchResults query={deferredQuery} />
                </div>
            </Suspense>
        </>
    );
};


const IndicatingTheContentIsStale = () => {
    return (
        <>
            <h3>Indicating that the content is stale</h3>
            <AppWithStaleIndicator />
        </>
    );
};

const SlowItem = ({ text }: { text: string; }) => {
    let startTime = performance.now();
    while (performance.now() - startTime < 1) { }

    return (
        <li style={{
            listStyle: 'none',
            display: 'block',
            height: '40px',
            padding: '5px',
            marginTop: '10px',
            borderRadius: '4px',
            border: '1px solid #aaa'
        }}>
            Text: {text}
        </li >
    );
};

const SlowList = memo(({ text }: { text: string; }) => {
    console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

    let items = [];
    for (let i = 0; i < 250; i++) {
        items.push(<SlowItem key={i} text={text} />);
    }
    return (
        <ul style={{ padding: 0 }}>
            {items}
        </ul>
    );
});

const SlowListApp = () => {
    const [text, setText] = useState('');
    const deferredText = useDeferredValue(text);

    return (
        <>
            <input value={text} onChange={e => setText(e.target.value)} />
            <SlowList text={deferredText} />
        </>
    );
};

const DeferringReRenderingForAPartOfTheUI = () => {
    return (
        <>
            <h3>Deferring re-rendering for a part of the UI</h3>
            <SlowListApp />
        </>
    );
};