import { startTransition, Suspense, use, useState, useTransition, type ReactNode } from "react";

export const SuspenseLab = () => {
    return (
        <>
            <h2>Suspense - Artists List</h2>
            <Artists />
            <br /><br />
            <NestedSuspense />
            <br /><br />
            <StaleContent />
            <br /><br />
            <SuspenseWithTransition />
            <br /><br />
            <SuspenseWithIndicator />
            <br /><br />
            <UpdateSuspense />
            <br /><br />
            <ServerComponentError />
        </>
    );
};

let cache = new Map();

const getAlbums = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));

    return [
        { id: 13, title: 'Let It Be', year: 1970 },
        { id: 12, title: 'Abbey Road', year: 1969 },
        { id: 11, title: 'Yellow Submarine', year: 1969 },
        { id: 10, title: 'The Beatles', year: 1968 },
        { id: 9, title: 'Magical Mystery Tour', year: 1967 },
        { id: 8, title: 'Sgt. Pepper\'s Lonely Hearts Club Band', year: 1967 },
        { id: 7, title: 'Resolver', year: 1966 },
        { id: 6, title: 'Rubber Soul', year: 1965 },
        { id: 5, title: 'Help!', year: 1965 },
        { id: 4, title: 'Beatles For Sale', year: 1964 },
        { id: 3, title: 'A Hard Day\'s Night', year: 1964 },
        { id: 2, title: 'With The Beatles', year: 1963 },
        { id: 1, title: 'Please Please Me', year: 1963 }
    ];
};

async function getBio() {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
        setTimeout(resolve, 500);
    });

    return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getSearchResults(query: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const all_albums = [{
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

    const lower_query = query.trim().toLowerCase();
    return all_albums.filter(album => {
        const lower_title = album.title.toLowerCase();
        return (
            lower_title.startsWith(lower_query) ||
            lower_title.indexOf(' ' + lower_query) !== -1
        );
    });
}

const getData = async (url: string) => {
    if (url === '/the-beatles/albums') {
        return await getAlbums();
    } else if (url === '/the-beatles/bio') {
        return await getBio();
    } else if (url.startsWith('/search?q=')) {
        return await getSearchResults(url.slice('/search?q='.length));
    } else if (url.startsWith('/the-who?album=')) {
        return await getTheWhoAlbums(url.slice('/the-who?album='.length));
    } else {
        throw new Error('Not implemented');
    }
};

const fetchData = (url: string) => {
    if (!cache.has(url)) {
        cache.set(url, getData(url));
    }
    return cache.get(url);
};

const Albums = ({ artistId }: { artistId: string; }) => {
    const albums: [{ id: number, title: string, year: number; }] = use(fetchData(`/${artistId}/albums`));
    return (
        <ul style={{ textAlign: 'left' }}>
            {albums.map(album => (
                <li key={album.id}>{album.title} - {album.year}</li>
            ))}
        </ul>
    );
};

const ArtistPage = ({ artist }: { artist: { id: string, name: string; }; }) => {
    return (
        <>
            <h3>{artist.name} - Load State</h3>
            <Suspense fallback={<div>Loading albums...</div>}>
                <Albums artistId={artist.id} />
            </Suspense>
        </>
    );
};

const Artists = () => {
    const [show, setShow] = useState(false);

    if (show) {
        return <ArtistPage artist={{ id: 'the-beatles', name: 'The Beatles' }} />;
    } else {
        return <button onClick={() => setShow(true)}> Open The Beatles artist page</button>;
    }
};

const Biography = ({ artistId }: { artistId: string; }) => {
    const bio: string = use(fetchData(`/${artistId}/bio`));
    return (
        <>
            <section>
                <p style={bio_style}>{bio}</p>
            </section>
        </>
    );
};


const BigSpinner = () => {
    return <h2>🌀 Loading...</h2>;
};

function AlbumsGlimmer() {
    return (
        <div style={glimmer_panel_style}>
            <div style={glimmer_line_style} />
            <div style={glimmer_line_style} />
            <div style={glimmer_line_style} />
        </div>
    );
}

export default function Panel({ children }: { children: ReactNode; }) {
    return (
        <section style={panel_style}>
            {children}
        </section>
    );
}

const NestedArtistPage = ({ artist }: { artist: { name: string, id: string; }; }) => {
    return (
        <>
            <h3>{artist.name}</h3>
            <Suspense fallback={<BigSpinner />}>
                <Biography artistId={artist.id} />
                <Suspense fallback={<AlbumsGlimmer />}>
                    <Panel>
                        <Albums artistId={artist.id} />
                    </Panel>
                </Suspense>
            </Suspense>
        </>
    );
};

const NestedSuspense = () => {
    const [show, setShow] = useState(false);
    if (show) {
        return (
            <NestedArtistPage
                artist={{
                    id: 'the-beatles',
                    name: 'The Beatles',
                }}
            />
        );
    } else {
        return (
            <button onClick={() => setShow(true)}>
                Open The Beatles artist page (Nested Suspense)
            </button>
        );
    }
};

const bio_style = { fontStyle: 'italic' };

const panel_style = {
    border: '1px solid #aaa',
    borderRadius: '6px',
    marginTop: '20px',
    padding: '10px',
};

const glimmer_panel_style = {
    border: '1px dashed #aaa',
    background: 'linear-gradient(90deg, rgba(221, 221, 221, 1) 0%, rgba(255, 255, 255, 1) 100%)',
    borderRadius: '6px',
    marginTop: '20px',
    padding: '10px',
};

const glimmer_line_style = {
    display: 'block',
    width: '60%',
    height: '20px',
    margin: 10,
    borderRadius: 4,
    background: '#f0f0f0',
};

const SearchResults = ({ query }: { query: string; }) => {
    if (query === '') {
        return null;
    }

    const albums: { id: number, title: string, year: number; }[] = use(fetchData(`/search?q=${query}`));

    if (albums.length === 0) {
        return <p>No matches for <i>"{query}"</i></p>;
    }

    return (
        <ul>
            {albums.map(album => (
                <li key={album.id}>
                    {album.title} - {album.year}
                </li>
            ))}
        </ul>
    );
};


const StaleContent = () => {
    const [query, setQuery] = useState('');
    return (
        <>
            <label>
                Search albums: {" "}
                <input value={query} onChange={e => setQuery(e.target.value)} />
            </label>
            <Suspense fallback={<h3>Loading...</h3>}>
                <SearchResults query={query} />
            </Suspense>
        </>
    );
};

const Layout = ({ children }: { children: ReactNode; }) => {
    return (
        <div style={{ border: '1px solid black' }}>
            <section style={{
                background: '#222',
                padding: '10px',
                textAlign: 'center',
                color: 'white'
            }}>
                Music Browser
            </section>
            <main>
                {children}
            </main>
        </div>
    );
};

const IndexPage = ({ navigate }: { navigate: (url: string) => void; }) => {
    return (
        <button onClick={() => navigate('/the-beatles')}>
            Open The Beatles artist page (with transition)
        </button>
    );
};

const Router = () => {
    const [page, setPage] = useState('/');

    function navigate(url: string) {
        startTransition(() => {
            setPage(url);
        });
    }

    let content;
    if (page === "/") {
        content = (<IndexPage navigate={navigate} />);
    } else if (page === '/the-beatles') {
        content = (<ArtistPageForTransition artist={{ id: 'the-beatles', name: 'The Beatles' }} />);
    }

    return (
        <Layout>{content}</Layout>
    );
};

const SuspenseWithTransition = () => {
    return (
        <Suspense fallback={<BigSpinner />}>
            <Router />
        </Suspense>
    );
};

const ArtistPageForTransition = ({ artist }: { artist: { name: string, id: string; }; }) => {
    return (
        <>
            <h3>{artist.name}</h3>
            <Biography artistId={artist.id} />
            <Suspense fallback={<AlbumsGlimmer />}>
                <Panel>
                    <Albums artistId={artist.id} />
                </Panel>
            </Suspense>
        </>
    );
};

const LayoutWithIndicator = ({ children, isPending }: { children: ReactNode; isPending: boolean; }) => {
    return (
        <div style={{ border: '1px solid black' }}>
            <section style={{
                background: '#222',
                padding: '10px',
                textAlign: 'center',
                color: 'white',
                opacity: isPending ? .7 : 1
            }}>
                Music Browser (with pending indicator)
            </section>
            <main>
                {children}
            </main>
        </div>
    );
};

const RouterWithIndicator = () => {
    const [page, setPage] = useState('/');
    const [isPending, startTransition] = useTransition();

    function navigate(url: string) {
        startTransition(() => {
            setPage(url);
        });
    }

    let content;
    if (page === "/") {
        content = (<IndexPage navigate={navigate} />);
    } else if (page === '/the-beatles') {
        content = (<ArtistPageForTransition artist={{ id: 'the-beatles', name: 'The Beatles' }} />);
    }

    return (
        <LayoutWithIndicator isPending={isPending}>
            {content}
        </LayoutWithIndicator>
    );
};

const SuspenseWithIndicator = () => {
    return (
        <Suspense fallback={<BigSpinner />}>
            <RouterWithIndicator />
        </Suspense>
    );
};

const getTheWhoAlbums = async (index: string = "0") => {
    console.log('Get The Who Album called!');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const albums = [
        {
            "id": 1,
            "title": "My Generation",
            "year": 1965,
            "description": "The Who’s debut album, defining the mod movement with raw energy, youthful rebellion, and the iconic title track."
        },
        {
            "id": 2,
            "title": "A Quick One",
            "year": 1966,
            "description": "An experimental follow-up featuring shorter songs and the mini-rock opera 'A Quick One, While He’s Away.'"
        },
        {
            "id": 3,
            "title": "The Who Sell Out",
            "year": 1967,
            "description": "A concept album styled as a pirate radio broadcast, blending pop art, satire, and jingles."
        },
        {
            "id": 4,
            "title": "Tommy",
            "year": 1969,
            "description": "A landmark rock opera telling the story of a deaf, dumb, and blind boy, cementing The Who’s artistic ambition."
        },
        {
            "id": 5,
            "title": "Live at Leeds",
            "year": 1970,
            "description": "A legendary live album capturing The Who at peak intensity, often cited as one of the greatest live records ever."
        },
        {
            "id": 6,
            "title": "Who's Next",
            "year": 1971,
            "description": "A powerful studio album blending hard rock and synthesizers, featuring classics like 'Baba O’Riley.'"
        },
        {
            "id": 7,
            "title": "Quadrophenia",
            "year": 1973,
            "description": "A complex rock opera exploring mod culture, identity, and alienation through the story of Jimmy."
        },
        {
            "id": 8,
            "title": "The Who by Numbers",
            "year": 1975,
            "description": "A darker, more introspective album reflecting Pete Townshend’s personal struggles and anxieties."
        },
        {
            "id": 9,
            "title": "Who Are You",
            "year": 1978,
            "description": "The band’s last album with drummer Keith Moon, mixing mature songwriting with renewed rock energy."
        },
        {
            "id": 10,
            "title": "Face Dances",
            "year": 1981,
            "description": "The first album after Keith Moon’s death, featuring a more polished, early-80s sound."
        },
        {
            "id": 11,
            "title": "It's Hard",
            "year": 1982,
            "description": "A socially conscious album dealing with politics, aging, and change, released before the band’s initial breakup."
        },
        {
            "id": 12,
            "title": "Endless Wire",
            "year": 2006,
            "description": "A comeback album after a long hiatus, including the mini-opera 'Wire & Glass.'"
        },
        {
            "id": 13,
            "title": "Who",
            "year": 2019,
            "description": "A late-career studio album combining classic Who themes with modern production and orchestration."
        }
    ];

    return albums.at(parseInt(index));
};

const UpdateSuspense = () => {
    const [index, setIndex] = useState(0);


    const next_album = () => startTransition(() => {
        index < 12 ? setIndex(p => p + 1) : index;
    });
    const previous_album = () => startTransition(() => {
        index > 0 ? setIndex(p => p - 1) : index;
    });

    return (
        <>
            <h3>Get to know more an album from: The Who <br />(And Reset Suspense Boundary)</h3>
            <h4>Current Album: {index}</h4>
            <Suspense fallback={<BigSpinner />} key={index}>
                <AlbumDetail index={index} />
            </Suspense>
            <button onClick={previous_album}>Previous album</button>
            {" "}
            <button onClick={next_album}>Next album</button>
        </>
    );
};

const AlbumDetail = ({ index }: { index: number; }) => {
    const album: { title: string, year: number, description: string; } = use(fetchData(`/the-who?album=${index}`));
    return (
        <>
            <p><b>Title:</b> {album.title}</p>
            <p><b>Year:</b> {album.year}</p>
            <p><b>Description:</b> {album.description}</p>
        </>
    );
};

function createServerResource<T>(fn: () => Promise<T>) {
    let status = "pending";
    let result: T;
    let promise = fn().then(
        r => {
            status = "success";
            result = r;
        },
        e => {
            status = "error";
            throw e;
        }
    );

    return {
        read() {
            if (status === "pending") throw promise;
            if (status === "error") throw new Error("Server error");
            return result;
        }
    };
}

const resource = createServerResource(
    () => new Promise(res => setTimeout(() => res("Hello from server"), 3000))
);

const ServerLikeComponent = () => {
    return <p>{resource.read() as string}</p>;
};

const ServerComponentError = () => {
    const [show, setShow] = useState(false);
    
    const display_component = () => setShow(!show);
    return (
        <>
        <h3>Display loading for server component errors</h3>
            <Suspense fallback={<BigSpinner />}>
                {show && <ServerLikeComponent />}
            </Suspense>
            <button onClick={display_component}>Load server component</button>
        </>
    );
};