import { useId } from "react";

export const UseIdLab = () => {
    return (
        <>
            <h2>UseId Lab</h2>
            <GenerateUniqueIDForAccessibility />
        </>
    );
};

const PasswordField = () => {
    const password_hint_id = useId();

    return (
        <>
            <label>
                Password:
                <input type="password" aria-describedby={password_hint_id} />
            </label>
            <p id={password_hint_id}>
                The password should contain at leas 18 characters
            </p>
        </>
    );
};

const GenerateUniqueIDForAccessibility = () => {
    return (
        <>
            <h3>Generate Unique ID for accessibility attributes</h3>
            
            <h4>Choose password</h4>
            <PasswordField />
            
            <h4>Confirm Password</h4>
            <PasswordField />
        </>
    );
};