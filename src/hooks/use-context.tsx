import { createContext, useContext, useState } from "react";
import './use-context.css'

export const UseContextLab = () => {
    return (
        <>
            <h2>Use Context Lab</h2>
            <PassingDataDeeplyIntoTheTree />
            <UpdatingDataPassedViaContext />
            <SpecifyingAFallbackDefaultValue />
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
        <button className={className} style={{ marginLeft: 8 }}>
            {children}
        </button>
    )
}

const ContextApp = () => {
    return (
        <ThemeContext value='dark'>
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

const ThemeWithPropsContext = createContext<{ theme: 'light' | 'dark'; toggleTheme: () => void } | null>(null)

const PanelWithProp = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const context = useContext(ThemeWithPropsContext)
    const { theme } = context!

    const className = 'panel-' + theme
    return (
        <section className={className}>
            <h1>{title}</h1>
            {children}
        </section>
    )
}

const FormWithProp = () => {
    const context = useContext(ThemeWithPropsContext)
    const { theme, toggleTheme } = context!

    return (
        <>
            <PanelWithProp title='Welcome'>
                <Button>Sign up</Button>
                <Button>Log in</Button>
            </PanelWithProp>
            <label>
                <input
                    type='checkbox'
                    checked={theme === 'dark'}
                    onChange={() => toggleTheme()}
                />
                Use dark mode
            </label>
        </>
    )
}

const ContextWithProp = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const toggleTheme = () => setTheme(t => t === 'light' ? "dark" : 'light')

    return (
        <ThemeWithPropsContext value={{ theme, toggleTheme }}>
            <FormWithProp />
        </ThemeWithPropsContext >
    );
};

const UpdatingDataPassedViaContext = () => {
    return (
        <>
            <h3>Updating Data Passed Via Context</h3>
            <ContextWithProp />
        </>
    );
};

const ThemeWithDefaultValue = createContext<{ theme: 'light' | 'dark'; toggleTheme: () => void }>({ theme: 'light', toggleTheme: () => { } })

const PanelWithDefaultValue = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const { theme } = useContext(ThemeWithDefaultValue)

    const className = 'panel-' + theme
    return (
        <section className={className}>
            <h1>{title}</h1>
            {children}
        </section>
    )
}

const FormWithDefaultValue = () => {
    const { theme, toggleTheme } = useContext(ThemeWithDefaultValue)

    return (
        <>
            <PanelWithDefaultValue title='Welcome'>
                <Button>Sign up</Button>
                <Button>Log in</Button>
            </PanelWithDefaultValue>
            <label>
                <input
                    type='checkbox'
                    checked={theme === 'dark'}
                    onChange={() => toggleTheme()}
                />
                Use dark mode
            </label>
        </>
    )
}

const ContextWithDefaultValue = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const toggleTheme = () => setTheme(t => t === 'light' ? "dark" : 'light')

    return (
        <ThemeWithDefaultValue value={{ theme, toggleTheme }}>
            <FormWithDefaultValue />
        </ThemeWithDefaultValue >
    );
};

const SpecifyingAFallbackDefaultValue = () => {
    return (
        <>
            <h3>Specifying a fallback default value</h3>
            <ContextWithDefaultValue />
        </>
    );
};
