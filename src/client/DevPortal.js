import React from "react";
import idx from "idx";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";

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
                    <Route exact path="/" render={() => <div>korte</div>} />

                    <Route path="/apps" render={() => <div>blah</div>} />

                    <Route
                        path="/apps/:appId"
                        render={routeParams => {
                            return (
                                <div>
                                    Id: {idx(routeParams || {}, _ => _.match.params.reportId)}
                                    >
                                </div>
                            );
                        }}
                    />
                </div>
            </div>
        );
    }
}

export const DevPortal = withRouter(DevPortalComponent);
