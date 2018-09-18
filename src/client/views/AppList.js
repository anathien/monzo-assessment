import React from "react";
import moment from "moment";

import { getApps } from "./../utils/appUtils";
import AuthStateStore, { KEYS } from "./../stores/AuthStateStore";

import styles from "./AppListStyles.css";

type Props = {};
type State = {
    apps: Array<Object>,
};

export class AppList extends React.Component<Props, State> {
    props: Props;
    state: State = {
        apps: [],
    };

    componentDidMount() {
        if (AuthStateStore.get(KEYS.IS_AUTHENTICATED) === true) {
            getApps();
        }
    }

    aaa = () => {
        // Note: As the util always resolves, there's no need for a catch block
        getApps().then(apps => {
            this.setState({
                apps,
            });
        });
    };

    handleAppClicked = (appId: string) => {};

    render() {
        return (
            <div className={styles.gridList}>
                {this.state.apps.map(app => {
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
                })}
                <button onClick={this.aaa}>refresh</button>
            </div>
        );
    }
}
