import React from "react";
import AuthStateStore, { KEYS } from "./../stores/AuthStateStore";
import { loginUser } from "../utils/authUtils";

import styles from "./LoginModalStyles.css";

type Props = {};
type State = {
    email: string,
    password: string,
    isVisible: boolean,
};

export class LoginModal extends React.Component<Props, State> {
    props: Props;
    state: State = {
        email: "",
        password: "",
        isVisible: AuthStateStore.get(KEYS.IS_AUTHENTICATED) !== true,
    };

    componentDidMount() {
        console.log(
            "AuthStateStore.get(KEYS.IS_AUTHENTICATED)",
            AuthStateStore.get(KEYS.IS_AUTHENTICATED) !== true
        );
        AuthStateStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        AuthStateStore.removeChangeListener(this.onChange);
    }

    onChange = (keys: Array<string>, namespace: string) => {
        if (keys.find(key => key === KEYS.IS_AUTHENTICATED).length > 0) {
            this.setState({
                isVisible: AuthStateStore.get(KEYS.IS_AUTHENTICATED) !== true,
            });
        }
    };

    handleFieldChange = (field: string, event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            const newState = Object.assign({}, this.state);
            newState[field] = event.target.value;
            this.setState(newState);
        }
    };

    handleLoginClicked = () => {
        loginUser(this.state.email, this.state.password);
    };

    render() {
        if (this.state.isVisible !== true) {
            return null;
        }

        return (
            <div className={styles.outerContainer}>
                <div className={styles.popupContainer}>
                    <div className={styles.titleContainer}>Please log in</div>
                    <div className={styles.contentContainer}>
                        <input
                            id="email_input"
                            type="text"
                            name="email"
                            value={this.state.email}
                            placeholder={"Your e-mail address"}
                            onChange={this.handleFieldChange.bind(this, "email")}
                        />
                        <input
                            id="password_input"
                            type="password"
                            name="password"
                            value={this.state.password}
                            placeholder={"Your password"}
                            onChange={this.handleFieldChange.bind(this, "password")}
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.loginButton} onClick={this.handleLoginClicked}>
                            Log in
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
