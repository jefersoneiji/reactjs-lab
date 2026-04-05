import { startTransition, useActionState, useOptimistic } from "react";

export const UseActionStateLab = () => {
    return (
        <>
            <h2>Use Action State Lab</h2>
            <AddingStateToAnAction />
            <UsingMultipleActionTypes />
            <UsingWithUseOptimistic />
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

