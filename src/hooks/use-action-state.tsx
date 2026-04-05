import { startTransition, useActionState, useDebugValue, useState } from "react";

export const UseActionStateLab = () => {
    return (
        <>
            <h2>Use Action State Lab</h2>
            <AddingStateToAnAction />
            <DeferringFormattingOfADebugValue />
        </>
    );
};


const useCounter = (initialValue?: number): [() => void, () => void, number] => {
    const [count, setCount] = useState(initialValue || 0);

    useDebugValue(count > 0 ? "Value greater than zero." : "Value is zero.");

    const increaseCounter = () => setCount(v => v + 1);
    const decreaseCounter = () => setCount(v => v - 1);

    return [increaseCounter, decreaseCounter, count];
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

const useDateFormatter = (initialValue?: Date): [() => void, () => void, string] => {
    const [date, setDate] = useState<string>(
        initialValue ? initialValue.toString() : new Date().toString()
    );

    useDebugValue(date, date => new Date(date).toLocaleString());

    const dateToIso = () => setDate(v => new Date(v).toISOString());
    const dateToString = () => setDate(v => new Date(v).toString());

    return [dateToIso, dateToString, date];
};

const DateApp = () => {
    const [dateToIso, dateToString, date] = useDateFormatter();

    return (
        <>
            <p>current date is: {date}</p>
            <button onClick={() => dateToIso()}>Date To ISO</button>
            <button onClick={() => dateToString()}>Date To String</button>
        </>
    );
};

const DeferringFormattingOfADebugValue = () => {
    return (
        <>
            <h3>Deferring formatting of a debug value</h3>
            <DateApp />
        </>
    );
};

