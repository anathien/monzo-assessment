import React, { Fragment } from "react";
import idx from "idx";
// import moment from "moment";

import { getApps, getUsers } from "./../utils/appUtils";
import AuthStateStore, { KEYS } from "./../stores/AuthStateStore";

import styles from "./AppStyles.css";

type Props = {
    appId: string,
};
type State = {
    app: Object,
    users: Array<Object>,
};

export class App extends React.Component<Props, State> {
    props: Props;
    state: State = {
        app: {},
        users: [],
    };

    componentDidMount() {
        AuthStateStore.addChangeListener(this.onChange);
        if (AuthStateStore.get(KEYS.IS_AUTHENTICATED) === true) {
            this.refreshApp();
        }
    }

    componentWillUnmount() {
        AuthStateStore.removeChangeListener(this.onChange);
    }

    onChange = (keys: Array<string>, namespace: string) => {
        if (keys.find(key => key === KEYS.IS_AUTHENTICATED) != null) {
            if (AuthStateStore.get(KEYS.IS_AUTHENTICATED) === true) {
                this.refreshApp();
            }
        }
    };

    refreshApp = () => {
        // TODO: validate on appId being present
        // Note: I am very truly sorry. I can't even begin to tell you how suboptimal this is...
        Promise.all([getApps(), getUsers(this.props.appId)]).then(promiseResults => {
            console.log("promiseResults", promiseResults);
            this.setState({
                app: promiseResults[0].find(app => app.id === this.props.appId) || {},
                users: promiseResults[1],
            });
        });
    };

    render() {
        return (
            <Fragment>
                <h1>{idx(this.state, _ => _.app.name)}</h1>
                <div className={styles.userTitle}>Users:</div>
                <div className={styles.gridList}>
                    {this.state.users.map(user => {
                        return (
                            <div key={user.id} className={styles.gridRow}>
                                <div className={styles.userIcon}>
                                    <img alt={user.name} src={user.avatar} />
                                </div>
                                <div className={styles.userDescription}>
                                    <div className={styles.userName}>{user.name}</div>
                                    <div className={styles.userEmail}>{user.email}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Fragment>
        );
    }
}
