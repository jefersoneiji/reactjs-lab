import './use-callback.css';

import { memo, useCallback, useState, type FormEvent } from "react";

export const UseCallbackLab = () => {
    return (
        <>
            <h2>UseCallback Lab</h2>
            <PreventComponentReRenders />
        </>
    );
};

const PreventComponentReRenders = () => {
    const [is_dark, setIsDark] = useState(false);
    return (
        <>
            <h3>Prevent unnecessary component re-renders</h3>
            <label>
                <input type='checkbox' checked={is_dark} onChange={e => setIsDark(e.target.checked)} />
                Dark Mode
            </label>
            <hr />
            <ProductPage referrer_id="wizard_of_oz" product_id={123} theme={is_dark ? 'dark' : 'light'} />
        </>
    );
};

interface IProductPage {
    product_id: number,
    referrer_id: string,
    theme: string;
}

interface order_details {
    street: string,
    city: string,
    zipCode: string,
    count: number;
}
const ShippingForm = memo(({ onSubmit }: { onSubmit: (input: order_details) => void; }) => {
    const [count, setCount] = useState(1);

    console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
    let start_time = performance.now();
    while (performance.now() - start_time < 500) {
        // do nothing for 500 ms to emulate extremely slow code
    }

    function handle_submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const form_data = new FormData(e.currentTarget);
        const order_details = {
            ...Object.fromEntries(form_data),
            count
        } as order_details;
        console.log('Order details are: ', order_details);
        onSubmit(order_details);
    }

    return (
        <form onSubmit={handle_submit} >
            <p><b>Note: <code>Shipping Form</code> is artificially slowed down!</b></p>
            <label>
                Number of items:
                <button type="button" onClick={() => setCount(c => c - 1)}>-</button>
                {count}
                <button type="button" onClick={() => setCount(c => c + 1)}>+</button>
            </label>
            <label>
                Street:
                <input name="street" />
            </label>
            <label>
                City:
                <input name="city" />
            </label>
            <label>
                Postal Code:
                <input name="zipCode" />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
});

const ProductPage = ({ product_id, referrer_id, theme }: IProductPage) => {
    const handle_submit = useCallback((order_details: order_details) => {
        return post('/product/' + product_id + '/buy', {
            referrer: referrer_id,
            order_details
        });
    }, [product_id, referrer_id]);

    return (
        <div className={theme}>
            <ShippingForm onSubmit={handle_submit} />
        </div>
    );
};

function post(url: string, data: { referrer: string, order_details: any; }) {
    console.log('POST/ ' + url);
    console.log('data is: ', data);
}