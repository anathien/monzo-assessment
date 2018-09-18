import React from "react";
import idx from "idx";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";
import { LoginModal } from "./components/LoginModal";
import { AppList } from "./views/AppList";
import { App } from "./views/App";

import "./styles/styles.css";
import styles from "./DevPortalStyles.css";

type Props = {};

type State = {};

class DevPortalComponent extends React.Component<Props, State> {
    props: Props;
    state: State;

    render() {
        return (
            <div className={styles.container}>
                Alma
                <div>
                    <Route exact path="/" render={() => <AppList />} />
                    <Route
                        path="/app/:appId"
                        render={routeParams => {
                            return (
                                <App appId={idx(routeParams || {}, _ => _.match.params.appId)} />
                            );
                        }}
                    />
                </div>
                <LoginModal />
            </div>
        );
    }
}

export const DevPortal = withRouter(DevPortalComponent);
