import React from "react";

import styles from "./LoginModalStyles.css";

type Props = {};
type State = {
    email: string,
    password: string,
};

export class LoginModal extends React.Component<Props, State> {
    props: Props;
    state: State = {
        email: "",
        password: "",
    };

    handleFieldChange = (field: string, event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            const newState = Object.assign({}, this.state);
            newState[field] = event.target.value;
            this.setState(newState);
        }
    };

    handleLoginClicked = () => {
        console.log("Login clicked");
    };

    render() {
        return (
            <div className={styles.outerContainer}>
                <div className={styles.popupContainer}>
                    <div className={styles.titleContainer}>Please log in</div>
                    <div className={styles.contentContainer}>
                        <input
                            id="email_input"
                            type="text"
                            name="email"
                            value={this.state.newEmail}
                            placeholder={"Your e-mail address"}
                            onChange={this.handleFieldChange.bind(this, "newEmail")}
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
                        <button className={styles.loginButton}>Log in</button>
                    </div>
                </div>
            </div>
        );
    }
}
