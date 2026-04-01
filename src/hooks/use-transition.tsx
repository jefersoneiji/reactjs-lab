import { memo, startTransition, useState, useTransition } from "react"

export const UseTransitionLab = () => {
    return (
        <>
            <h2>Use Transition Lab</h2>
            <PerformNonBlockingUpdatesWithActions />
            <ExposingActionPropFromComponents />
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

const ContactTab = () => {
    return (
        <>
            <p>
                You can find me online here:
            </p>
            <ul>
                <li>admin@mysite.com</li>
                <li>+1234566789</li>
            </ul>
        </>
    )
}

const SlowPost = ({ index }: { index: number }) => {
    let startTime = performance.now()
    while (performance.now() - startTime < 1) { }

    return (
        <li style={{}}>
            Post #{index + 1}
        </li>
    )
}

const PostsTab = memo(() => {
    console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost/>')

    let items = []
    for (let i = 0; i < 500; i++) {
        items.push(<SlowPost key={i} index={i} />)
    }
    return <ul style={{}}>{items}</ul>
})

const AboutTab = () => {
    return <p>Welcome to my profile!</p>
}

const TabButton = ({ action, children, isActive }: { action: () => void | Promise<void>; children: React.ReactNode; isActive: boolean }) => {
    const [isPending, startTransaction] = useTransition()

    if (isActive) {
        return <b>{children}</b>
    }

    if (isPending) {
        return <b style={{}}>{children}</b>
    }

    return (
        <button onClick={async () => {
            startTransaction(async () => {
                await action()
            })
        }}>
            {children}
        </button>
    )

}
const TabContainer = () => {
    const [tab, setTab] = useState('about')

    return (
        <>
            <TabButton isActive={tab === 'about'} action={() => setTab('about')}>
                About
            </TabButton>

            <TabButton isActive={tab === 'posts'} action={() => setTab('posts')}>
                Posts (slow)
            </TabButton>

            <TabButton isActive={tab === 'contact'} action={() => setTab('contact')}>
                Contact
            </TabButton>

            <hr />

            {tab === 'about' && <AboutTab />}
            {tab === 'posts' && <PostsTab />}
            {tab === 'contact' && <ContactTab />}
        </>
    )
}
const ExposingActionPropFromComponents = () => {
    return (
        <>
            <h3>Exposing Action Prop from Components</h3>
            <TabContainer />
        </>
    )
}