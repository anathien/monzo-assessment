import React, { Fragment } from "react";
import idx from "idx";
// import moment from "moment";

import { getApps } from "./../utils/appUtils";
import AuthStateStore, { KEYS } from "./../stores/AuthStateStore";

import styles from "./AppStyles.css";

type Props = {
    appId: string,
};
type State = {
    app: Object,
};

export class App extends React.Component<Props, State> {
    props: Props;
    state: State = {
        app: {},
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
        // Note: I am very truly sorry. I can't even begin to tell you how suboptimal this is...
        getApps().then(apps => {
            this.setState({
                app: apps.find(app => app.id === this.props.appId) || {},
            });
        });
    };

    handleAppClicked = (appId: string) => {
        console.log("clicked", appId);
        window.location.href = `/apps/${appId}`;
    };

    render() {
        return (
            <Fragment>
                <h1>{idx(this.state, _ => _.app.name)}</h1>
                <div className={styles.gridList}>
                    {/* {this.state.apps.map(app => {
                        return (
                            <button
                                key={app.id}
                                className={styles.gridRow}
                                onClick={this.handleAppClicked.bind(this, app.id)}
                            >
                                <div className={styles.appIcon}>
                                    <img alt={app.name} src={app.logo} />
                                </div>
                                <div className={styles.appDescription}>
                                    <div className={styles.appName}>{app.name}</div>
                                    <div className={styles.appDate}>
                                        Created: {moment(app.created).format("LL")}
                                    </div>
                                </div>
                                <div className={styles.arrowContainer} />
                            </button>
                        );
                    })} */}
                </div>
            </Fragment>
        );
    }
}
