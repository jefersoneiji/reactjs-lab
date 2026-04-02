import { memo, Suspense, use, useDeferredValue, useEffect, useMemo, useState } from "react";

export const UseDeferredValueLab = () => {
    return (
        <>
            <h2>Use Deferred Value Lab</h2>
            <ShowingStaleContentWhileFreshContentIsLoading />
            <SkippingReRenderingOfComponents />
            <MemoizingADependencyOfAnotherHook />
        </>
    );
};

type Todo = {
    id: number;
    text: string;
    completed: boolean;
};

type Album = {
    id: number;
    title: string;
    year: number;
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

const List = memo(function List({ items }: { items: Todo[]; }) {
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
    const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);

    return (
        <div className={theme}>
            <p><b>Nome: <code>filterTodos</code> is artificially slowed down!</b></p>
            {children}
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
    )
  });
}


const SearchResults = ({ query }: { query: string }) => {
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

const SkippingReRenderingOfComponents = () => {
    return (
        <>
            <h3>Skipping re-rendering of components</h3>
            <TodoAppMemo />
        </>
    );
};

interface DropdownOptions {
    category: string;
    limit: number;
}

const SearchPage = () => {
    const [category, setCategory] = useState('electronics');
    const [otherState, setOtherState] = useState(0);

    const searchOptions = useMemo((): DropdownOptions => {
        return {
            category,
            limit: 10
        };
    }, [category]);

    useEffect(() => {
        console.log('Fetching data for: ', searchOptions.category);

        const timer = setTimeout(() => {
            console.log('Data fetched!');
        }, 500);

        return () => clearTimeout(timer);
    }, [searchOptions]);

    return (
        <div style={{ padding: '20px' }}>
            <h4>Category Search</h4>

            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="clothing">Clothing</option>
            </select>

            <hr />

            <p>UI Updated: {otherState}</p>
            <button onClick={() => setOtherState(s => s + 1)}>
                Re-render Component
            </button>

            <p>
                <small>
                    Check the console. Clicking "Re-render Component"
                    <b>won't</b> trigger the "Fetching data" log because of useMemo.
                </small>
            </p>
        </div>
    );
};

const MemoizingADependencyOfAnotherHook = () => {
    return (
        <>
            <h3>Memoizing a dependency of another Hook</h3>
            <SearchPage />
        </>
    );
};