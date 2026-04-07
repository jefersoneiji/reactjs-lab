import { createContext, useContext } from "react";
import './use-context.css'

export const UseContextLab = () => {
    return (
        <>
            <h2>Use Context Lab</h2>
            <PassingDataDeeplyIntoTheTree />
        </>
    );
};

const ThemeContext = createContext<'dark' | 'light' | null>(null)

const Form = () => {
    return (
        <Panel title='Welcome'>
            <Button>Sign up</Button>
            <Button>Log in</Button>
        </Panel>
    )
}

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const theme = useContext(ThemeContext)
    const className = 'panel-' + theme
    return (
        <section className={className}>
            <h1>{title}</h1>
            {children}
        </section>
    )
}

const Button = ({ children }: { children: React.ReactNode }) => {
    const theme = useContext(ThemeContext)
    const className = 'button-' + theme
    return (
        <button className={className}>
            {children}
        </button>
    )
}

const ContextApp = () => {
    return (
        <ThemeContext value="dark">
            <Form />
        </ThemeContext >
    );
};

const PassingDataDeeplyIntoTheTree = () => {
    return (
        <>
            <h3>Passing Data Deeply Into The Tree</h3>
            <ContextApp />
        </>
    );
};
