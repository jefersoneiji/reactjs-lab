import { startTransition, useState, useTransition } from "react"

export const UseTransitionLab = () => {
    return (
        <>
            <h2>Use Transition Lab</h2>
            <PerformNonBlockingUpdatesWithActions />
        </>
    )
}

async function updateQuantity(newQuantity: number): Promise<number> {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve(newQuantity)
        }, 2000)
    })
}

const Item = ({ action }: { action: (value: number) => Promise<void> }) => {
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        startTransition(async () => {
            await action(Number(event.target.value))
        })
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start'
        }}>
            <span>Eras Tour Tickets</span>
            <label htmlFor="name" style={{
                flex: 1,
                textAlign: 'right'
            }}>Quantity: </label>
            <input
                type="number"
                onChange={handleChange}
                defaultValue={1}
                min={1}
                style={{
                    marginLeft: '4px',
                    width: '60px',
                    padding: '4px'
                }}
            />
        </div>
    )
}

const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

const Total = ({ quantity, isPending }: { quantity: number; isPending: boolean }) => {
    return (
        <div style={{
            height: '50px',
            lineHeight: '25px',
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-between'
        }}>
            <span>Total: </span>
            <span>
                {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
            </span>
        </div>
    )
}

const UpdateTotal = () => {
    const [quantity, setQuantity] = useState(1)
    const [isPending, startTransition] = useTransition()

    const updateQuantityAction = async (newQuantity: number) => {
        startTransition(async () => {
            const savedQuantity = await updateQuantity(newQuantity)
            startTransition(() => {
                setQuantity(savedQuantity)
            })
        })
    }

    return (
        <>
            <div>
                <h4>Checkout</h4>
                <Item action={updateQuantityAction} />
                <hr />
                <Total quantity={quantity} isPending={isPending} />
            </div>
        </>
    )
}

const PerformNonBlockingUpdatesWithActions = () => {
    return (
        <>
            <h3>Perform non-blocking updates with Actions</h3>

            <UpdateTotal />
        </>
    )
}