import { useEffect, useEffectEvent, useState } from "react";

export const UseEffectEvenLab = () => {
    return (
        <>
            <h2>UseEffectEvent Lab</h2>
            <ReadingLatestPropsAndState />
        </>
    );
};

const random_number = () => {
    const min = Math.ceil(1);
    const max = Math.floor(10);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const products = [
    { id: 1, item: "Apple", price: 1.5 },
    { id: 2, item: "Banana", price: 0.9 },
    { id: 3, item: "Orange", price: 1.2 },
    { id: 4, item: "Milk", price: 3.8 },
    { id: 5, item: "Bread", price: 4.5 },
    { id: 6, item: "Eggs (dozen)", price: 7.9 },
    { id: 7, item: "Cheese", price: 12.3 },
    { id: 8, item: "Chicken Breast", price: 18.5 },
    { id: 9, item: "Rice (1kg)", price: 6.4 },
    { id: 10, item: "Coffee", price: 14.9 }
];

const log_visit = (url: string, items: number) => console.log('[LOG]: visited url is: ', url, " and number of items is: ", items);

const cart_items = products.slice(random_number());

const Page = ({ url }: { url: string; }) => {
    const number_of_items = cart_items.length

    const on_navigate = useEffectEvent((visited_url: string) => {
        log_visit(visited_url, number_of_items);
    });

    useEffect(() => {
        on_navigate(url);
    }, [url]);

    return <p>current url is: {url}</p>;
};

const App = () => {
    const [current_page, setCurrentPage] = useState('/');
    return (
        <>
            <p>Set Page</p>
            <button onClick={() => setCurrentPage('/')}>home</button>
            <button onClick={() => setCurrentPage('/checkout')}>checkout</button>
            <Page url={current_page} />
        </>
    );
};

const ReadingLatestPropsAndState = () => {
    return (
        <>
            <h3>Reading the latest props and state</h3>
            <App />
        </>
    );
};