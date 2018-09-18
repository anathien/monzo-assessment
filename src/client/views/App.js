import React from "react";
import idx from "idx";
// import moment from "moment";

import { getApps, getUsers, updateApp } from "./../utils/appUtils";
import AuthStateStore, { KEYS } from "./../stores/AuthStateStore";

import backIconBlack from "../assets/chevron-left-solid-black.svg";
import backIcon from "../assets/chevron-left-solid.svg";
import nextIcon from "../assets/chevron-right-solid.svg";

import styles from "./AppStyles.css";

type Props = {
    appId: string,
};

type State = {
    app: Object,
    appName: string,
    users: Array<Object>,
    userOffset: number,
};

const PAGE_SIZE = 25;

export class App extends React.Component<Props, State> {
    props: Props;
    state: State = {
        app: {},
        appName: "",
        users: [],
        userOffset: 0,
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
        Promise.all([getApps(), getUsers(this.props.appId, 0)]).then(promiseResults => {
            console.log("promiseResults", promiseResults);
            const app = promiseResults[0].find(app => app.id === this.props.appId) || {};
            this.setState({
                app,
                appName: app.name || "",
                users: promiseResults[1],
                userOffset: 0,
            });
        });
    };

    handlePreviousButtonClicked = () => {
        const newOffset = this.state.userOffset - PAGE_SIZE;
        getUsers(this.props.appId, newOffset).then(users => {
            this.setState({
                users: users,
                userOffset: newOffset,
            });
        });
    };

    handleNextButtonClicked = () => {
        const newOffset = this.state.userOffset + PAGE_SIZE;
        getUsers(this.props.appId, newOffset).then(users => {
            this.setState({
                users: users,
                userOffset: newOffset,
            });
        });
    };

    handleNameChanged = (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
            this.setState({
                appName: event.target.value,
            });
        }
    };

    handleSaveClicked = () => {
        const newApp = Object.assign({}, this.state.app);
        newApp.name = this.state.appName;
        console.log("--> newApp", newApp);
        updateApp(newApp).then(() => {
            this.setState({
                app: newApp,
            });
        });
    };

    render() {
        if (idx(this.state, _ => _.app.id) == null) {
            return null;
        }

        const isPreviousActive = this.state.userOffset > 0;
        // Note: There should be a way to figure out how many page there are in total and base it on
        // that and the current offset. As it now stands, the only way we know we're at the end of
        // the list is if we get an empty array or less than 25 items on the next page request.
        // For this exercise, I am going to ignore this and just always set it to true.
        const isNextActive = true;

        // Note: this could be moved to a component
        const pagingControl = (
            <div className={styles.pagingContainer}>
                <button
                    className={styles.pagingButton}
                    disabled={!isPreviousActive}
                    onClick={this.handlePreviousButtonClicked}
                >
                    <img src={backIcon} alt="Previous page" />
                </button>
                <div className={styles.pagingIndicator}>
                    Page {Math.floor(this.state.userOffset / PAGE_SIZE) + 1}
                </div>
                <button
                    className={styles.pagingButton}
                    disabled={!isNextActive}
                    onClick={this.handleNextButtonClicked}
                >
                    <img src={nextIcon} alt="Next page" />
                </button>
            </div>
        );

        const saveButtonStyle =
            this.state.appName === idx(this.state, _ => _.app.name) ? styles.hidden : "";

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.appIcon}>
                        <img
                            alt={idx(this.state, _ => _.app.name)}
                            src={idx(this.state, _ => _.app.logo)}
                        />
                    </div>
                    <input
                        id="app_name"
                        type="text"
                        name="app_name"
                        value={this.state.appName}
                        placeholder={"Your app's name"}
                        onChange={this.handleNameChanged}
                    />
                    <button
                        className={`${styles.saveButton} ${saveButtonStyle}`}
                        onClick={this.handleSaveClicked}
                    >
                        Save
                    </button>
                </div>
                <div className={styles.gridHeader}>
                    <div className={styles.userTitle}>Users:</div>
                    {pagingControl}
                </div>
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
                {pagingControl}
            </div>
        );
    }
}
