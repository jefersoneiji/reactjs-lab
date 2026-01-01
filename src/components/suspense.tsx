import { Suspense, use, useState, type ReactNode } from "react";

export const SuspenseLab = () => {
    return (
        <>
            <h2>Suspense - Artists List</h2>
            <Artists />
            <br />
            <br />
            <NestedSuspense />
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

const getData = async (url: string) => {
    if (url === '/the-beatles/albums') {
        return await getAlbums();
    } else if (url === '/the-beatles/bio') {
        return await getBio();
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
