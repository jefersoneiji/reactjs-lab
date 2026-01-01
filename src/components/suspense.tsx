import { Suspense, use, useState } from "react";

export const SuspenseLab = () => {
    return (
        <>
            <h2>Suspense - Artists List</h2>
            <Artists />
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

const getData = async (url: string) => {
    if (url === '/the-beatles/albums') {
        return await getAlbums();
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