import { startTransition, useActionState, useOptimistic, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const UseActionStateLab = () => {
    return (
        <>
            <h2>Use Action State Lab</h2>
            <AddingStateToAnAction />
            <UsingMultipleActionTypes />
            <UsingWithUseOptimistic />
            <UsingWithActionProps />
            <CancelingQueuedActions />
            <UsingWithFormActionProps />
            <HandlingErrors />
        </>
    );
};

const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const checkoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'system-ui'
};

const totalStyle: React.CSSProperties = {
    fontWeight: 'bold'
};

const stepperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
};

const buttonsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
};

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
});

const addToCart = async (count: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return count + 1;
};

const removeFromCart = async (count: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.max(0, count - 1);
};

const Total = ({ quantity }: { quantity: number; }) => {
    return (
        <div style={{ ...rowStyle, ...totalStyle }}>
            <span>Total</span>
            <span>{formatter.format(quantity * 9999)}</span>
        </div>
    );
};

const UseStateApp = () => {
    const [count, dispatchAction, isPending] = useActionState(async prevCount => await addToCart(prevCount), 0);

    const handleClick = () => {
        startTransition(() => {
            dispatchAction();
        });
    };

    return (
        <div style={checkoutStyle}>
            <h2 style={{ margin: '0 0 8px 0' }}>Checkout</h2>
            <div style={rowStyle}>
                <span>Eras Tour Tickets</span>
                <span>Qty: {count}</span>
            </div>
            <div style={rowStyle}>
                <button onClick={handleClick} style={{ marginLeft: 'auto', minWidth: '150px', }}>
                    Add Ticket{isPending ? " 🌀" : ' '}
                </button>
            </div>
            <hr />
            <Total quantity={count} />
        </div>
    );
};

const AddingStateToAnAction = () => {
    return (
        <>
            <h3>Adding State To An Action</h3>
            <UseStateApp />
        </>
    );
};

async function updateCartAction(prevCount: number, actionPayload: { type: string; }) {
    switch (actionPayload.type) {
        case 'ADD': {
            return await addToCart(prevCount);
        }
        case 'REMOVE': {
            return await removeFromCart(prevCount);
        }
    }
    return prevCount;
}

const TotalManyStates = ({ quantity, isPending }: { quantity: number; isPending: boolean; }) => {
    return (
        <div style={{ ...rowStyle, ...totalStyle }}>
            <span>Total</span>
            <span>{isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}</span>
        </div>
    );
};

const UseManyStateApp = () => {
    const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

    const handleAdd = () => {
        startTransition(() => {
            dispatchAction({ type: 'ADD' });
        });
    };

    const handleRemove = () => {
        startTransition(() => {
            dispatchAction({ type: 'REMOVE' });
        });
    };

    return (
        <div style={checkoutStyle}>
            <h2 style={{ margin: '0 0 8px 0' }}>Checkout</h2>
            <div style={rowStyle}>
                <span>Eras Tour Tickets</span>
                <span style={stepperStyle}>
                    <span>{isPending ? " 🌀" : count}</span>
                    <span style={buttonsStyle}>
                        <button onClick={handleAdd}>▲</button>
                        <button onClick={handleRemove}>▼</button>
                    </span>
                </span>
            </div>
            <hr />
            <TotalManyStates quantity={count} isPending={isPending} />
        </div>
    );
};

const UsingMultipleActionTypes = () => {
    return (
        <>
            <h3>Using Multiple Action Types</h3>
            <UseManyStateApp />
        </>
    );
};

const UseManyStateAppWithOptimistic = () => {
    const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
    const [optimisticCount, setOptimisticCount] = useOptimistic(count);

    const handleAdd = () => {
        startTransition(() => {
            setOptimisticCount(c => c + 1);
            dispatchAction({ type: 'ADD' });
        });
    };

    const handleRemove = () => {
        startTransition(() => {
            setOptimisticCount(c => c - 1);
            dispatchAction({ type: 'REMOVE' });
        });
    };

    return (
        <div style={checkoutStyle}>
            <h2 style={{ margin: '0 0 8px 0' }}>Checkout</h2>
            <div style={rowStyle}>
                <span>Eras Tour Tickets</span>
                <span style={stepperStyle}>
                    <span>{isPending && "🌀"}</span>
                    <span>{optimisticCount}</span>
                    <span style={buttonsStyle}>
                        <button onClick={handleAdd}>▲</button>
                        <button onClick={handleRemove}>▼</button>
                    </span>
                </span>
            </div>
            <hr />
            <TotalManyStates quantity={count} isPending={isPending} />
        </div>
    );
};

const UsingWithUseOptimistic = () => {
    return (
        <>
            <h3>Using With Use Optimistic</h3>
            <UseManyStateAppWithOptimistic />
        </>
    );
};

const WithActionProps = () => {
    const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

    const addAction = async () => {
        dispatchAction({ type: 'ADD' });
    };

    const removeAction = async () => {
        dispatchAction({ type: 'REMOVE' });
    };

    return (
        <div style={checkoutStyle}>
            <h2 style={{ margin: '0 0 8px 0' }}>Checkout</h2>
            <div style={rowStyle}>
                <span>Eras Tour Tickets</span>
                <QuantityStepper
                    value={count}
                    increaseAction={addAction}
                    decreaseAction={removeAction}
                />
            </div>
            <hr />
            <TotalManyStates quantity={count} isPending={isPending} />
        </div>
    );
};

const QuantityStepper = ({ value, increaseAction, decreaseAction }: { value: number; increaseAction: () => Promise<void>; decreaseAction: () => Promise<void> }) => {
    const [optimisticValue, setOptimisticValue] = useOptimistic(value)
    const isPending = value !== optimisticValue

    function handleIncrease() {
        startTransition(async () => {
            setOptimisticValue(c => c + 1)
            await increaseAction()
        })
    }

    function handleDecrease() {
        startTransition(async () => {
            setOptimisticValue(c => Math.max(0, c - 1))
            await decreaseAction()
        })
    }
    return (
        <span style={stepperStyle}>
            <span>{isPending && "🌀"}</span>
            <span>{optimisticValue}</span>
            <span style={buttonsStyle}>
                <button onClick={handleIncrease}>▲</button>
                <button onClick={handleDecrease}>▼</button>
            </span>
        </span>
    )
}

const UsingWithActionProps = () => {
    return (
        <>
            <h3>Using With Action Props</h3>
            <WithActionProps />
        </>
    );
};

class AbortError extends Error {
    name = 'AbortError'
    constructor(message = 'The operation was aborted') {
        super(message)
    }
}

const sleep = (ms: number, signal?: AbortSignal) => {
    if (!signal) return new Promise<void>(resolve => setTimeout(resolve, ms))
    if (signal.aborted) return Promise.reject(new AbortError())

    return new Promise<void>((resolve, reject) => {
        const id = setTimeout(() => {
            signal.removeEventListener('abort', onAbort)
            resolve()
        }, ms)

        const onAbort = () => {
            clearTimeout(id)
            reject(new AbortError())
        }

        signal.addEventListener('abort', onAbort, { once: true })
    })
}

const addToCartWithSignal = async (count: number, opts: { signal?: AbortSignal }) => {
    await sleep(1000, opts?.signal)
    return count + 1;
};

const removeFromCartWithSignal = async (count: number, opts: { signal?: AbortSignal }) => {
    await sleep(1000, opts?.signal)
    return Math.max(0, count - 1);
};

async function updateCartActionWithAbortController(prevCount: number, actionPayload: { type: string; signal: AbortSignal }) {
    switch (actionPayload.type) {
        case 'ADD': {
            try {
                return await addToCartWithSignal(prevCount, { signal: actionPayload.signal });
            } catch (err) {
                return prevCount + 1
            }
        }
        case 'REMOVE': {
            try {
                return await removeFromCartWithSignal(prevCount, { signal: actionPayload.signal });
            } catch (err) {
                return Math.max(0, prevCount - 1)
            }

        }
    }
    return prevCount;
}

const WithCancelingQueuedActions = () => {
    const [count, dispatchAction, isPending] = useActionState(updateCartActionWithAbortController, 0);
    const abortRef = useRef<AbortController | null>(null)

    const addAction = async () => {
        if (abortRef.current) {
            abortRef.current.abort()
        }

        abortRef.current = new AbortController()
        dispatchAction({ type: 'ADD', signal: abortRef.current.signal });
    };

    const removeAction = async () => {
        if (abortRef.current) {
            abortRef.current.abort()
        }

        abortRef.current = new AbortController()
        dispatchAction({ type: 'REMOVE', signal: abortRef.current.signal });
    };

    return (
        <div style={checkoutStyle}>
            <h2 style={{ margin: '0 0 8px 0' }}>Checkout</h2>
            <div style={rowStyle}>
                <span>Eras Tour Tickets</span>
                <QuantityStepper
                    value={count}
                    increaseAction={addAction}
                    decreaseAction={removeAction}
                />
            </div>
            <hr />
            <TotalManyStates quantity={count} isPending={isPending} />
        </div>
    );
};

const CancelingQueuedActions = () => {
    return (
        <>
            <h3>Canceling Queued Actions</h3>
            <WithCancelingQueuedActions />
        </>
    );
};

async function updateCartActionWithForm(prevCount: number, formData: FormData) {
    const type = formData.get('type')

    switch (type) {
        case 'ADD': {
            return await addToCart(prevCount);
        }
        case 'REMOVE': {
            return await removeFromCart(prevCount);
        }
    }
    return prevCount;
}

const UseWithForm = () => {
    const [count, dispatchAction, isPending] = useActionState(updateCartActionWithForm, 0);
    const [optimisticCount, setOptimisticCount] = useOptimistic(count);

    const formAction = async (formData: FormData) => {
        const type = formData.get('type')

        if (type === 'ADD') {
            setOptimisticCount(c => c + 1);
        } else {
            setOptimisticCount(c => c - 1);
        }

        return dispatchAction(formData)
    };

    return (
        <form action={formAction} style={checkoutStyle}>
            <h2 style={{ margin: '0 0 8px 0' }}>Checkout</h2>
            <div style={rowStyle}>
                <span>Eras Tour Tickets</span>
                <span style={stepperStyle}>
                    <span>{isPending && "🌀"}</span>
                    <span>{optimisticCount}</span>
                    <span style={buttonsStyle}>
                        <button type='submit' name='type' value="ADD">▲</button>
                        <button type='submit' name='type' value="REMOVE" >▼</button>
                    </span>
                </span>
            </div>
            <hr />
            <TotalManyStates quantity={count} isPending={isPending} />
        </form>
    );
};

const UsingWithFormActionProps = () => {
    return (
        <>
            <h3>Using With Form Action Props</h3>
            <UseWithForm />
        </>
    );
};

const addToCartError = async (count: number, quantity: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (quantity > 5) {
        return { count: 0, error: 'Quantity not available' }
    } else if (isNaN(quantity)) {
        throw new Error('Quantity must be a number')
    }
    return { count: count + 1 };
};

type CartState = { count: number; error: null | string };

const UseHandleErrors = () => {
    const [state, dispatchAction, isPending] = useActionState<CartState, number>(async (prevState, quantity) => {
        const result = await addToCartError(prevState.count, quantity)

        if (result.error) {
            return { ...prevState, error: `Could not add quantity ${quantity}: ${result.error}` }
        }

        if (!isPending) {
            return { count: result.count, error: null }
        }

        return { count: result.count, error: prevState.error }
    }, { count: 0, error: null });

    const handleAdd = (quantity: number) => {
        startTransition(() => {
            dispatchAction(quantity);
        });
    };

    return (
        <div style={checkoutStyle}>
            <h2 style={{ margin: '0 0 8px 0' }}>Checkout</h2>
            <div style={rowStyle}>
                <span>Eras Tour Tickets</span>
                <span style={stepperStyle}>
                    <span>{isPending && "🌀"}</span>
                    <span>{state.count}</span>
                    <span style={buttonsStyle}>
                        <button onClick={() => handleAdd(1)}>Add 1</button>
                        <button onClick={() => handleAdd(10)}>Add 10</button>
                        <button onClick={() => handleAdd(NaN)}>Add NaN</button>
                    </span>
                </span>
            </div>
            {state.error && <div>{state.error}</div>}
            <hr />
            <TotalManyStates quantity={state.count} isPending={isPending} />
        </div>
    );
};

const HandlingErrors = () => {
    return (
        <>
            <h3>Handling Errors</h3>
            <ErrorBoundary fallbackRender={({ resetErrorBoundary }) => (
                <div>
                    <h2>Something went wrong</h2>
                    <p>The action could not be completed.</p>
                    <button onClick={resetErrorBoundary}>Try again.</button>
                </div>
            )}>
                <UseHandleErrors />
            </ErrorBoundary>
        </>
    );
};
