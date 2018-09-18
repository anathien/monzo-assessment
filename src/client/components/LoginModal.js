import React from "react";

import styles from "./LoginModalStyles.css";

type Props = {};

export class LoginModal extends React.Component<Props> {
    props: Props;

    render() {
        return (
            <div className={styles.outerContainer}>
                <div className={styles.popupContainer}>I iz modal</div>
            </div>
        );
    }
}
