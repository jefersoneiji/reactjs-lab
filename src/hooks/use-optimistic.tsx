import { startTransition, useOptimistic, useRef, useState } from "react";

export const UseOptimisticLab = () => {
    return (
        <>
            <h2>UseOptimistic Lab</h2>
            <OptimisticallyUpdateForms />
        </>
    );
};

async function deliver_message(message: string) {
    await new Promise(res => setTimeout(res, 1000));
    return message;
}

interface IThread {
    messages: Array<{ text: string, sending: boolean; }>;
    send_message_action: (form_data: FormData) => Promise<void>;
}

const Thread = ({ messages, send_message_action }: IThread) => {
    const form_ref = useRef<null | HTMLFormElement>(null);

    function form_action(form_data: FormData) {
        add_optimistic_message(form_data.get('message') as string);
        form_ref.current!.reset();
        startTransition(async () => { await send_message_action(form_data); });
    }

    const [optimistic_messages, add_optimistic_message] = useOptimistic(messages, (state, new_message: string) => [{ text: new_message, sending: true }, ...state]);
    return (
        <>
            <form action={form_action} ref={form_ref}>
                <input type="text" name="message" placeholder="Hello!" />
                <button type="submit">Send</button>
            </form>
            {
                optimistic_messages.map((message, index) => (
                    <div key={index}>
                        {message.text}
                        {!!message.sending && <small> (Sending...)</small>}
                    </div>
                ))
            }
        </>
    );
};

const App = () => {
    const [messages, setMessages] = useState([{ text: 'Hello there!', sending: false, key: 1 }]);
    
    async function send_message_action(form_data: FormData) {
        const sent_message = await deliver_message(form_data.get('message') as string);
        startTransition(() => {
            setMessages(messages => [{ text: sent_message, sending: false, key: messages.length + 1 }, ...messages]);
        });
    }
    return <Thread messages={messages} send_message_action={send_message_action} />;
};

const OptimisticallyUpdateForms = () => {
    return (
        <>
            <h3>Optimistically update forms</h3>
            <App />
        </>
    );
};;