import request from "superagent";
import idx from "idx";
import moment from "moment";
import AuthStateStore, { KEYS } from "./../stores/AuthStateStore";

export const loginUser = async (email: string, password: string) => {
    console.log("got called!");
    try {
        const loginResponse = await request
            .post("https://guarded-thicket-22918.herokuapp.com/login")
            .set("Content-Type", "application/json")
            .send({ email: email, password: password, expiry: "30s" });

        if (loginResponse != null && loginResponse.status === 200) {
            const authToken = idx(loginResponse, _ => _.body.accessToken);

            const tokenResponse = await request
                .get("https://guarded-thicket-22918.herokuapp.com/")
                .set("Authorization", authToken);

            if (tokenResponse != null && tokenResponse.status === 200) {
                const authExpiry = idx(tokenResponse, _ => _.body.token.exp);
                const authEmail = idx(tokenResponse, _ => _.body.token.email);

                AuthStateStore.setBulk([
                    { key: KEYS.IS_AUTHENTICATED, value: true },
                    { key: KEYS.AUTH_TOKEN, value: authToken },
                    { key: KEYS.AUTH_EXPIRY, value: authExpiry },
                    { key: KEYS.AUTH_EMAIL, value: authEmail },
                ]);

                sessionStorage.setItem(KEYS.IS_AUTHENTICATED, true);
                sessionStorage.setItem(KEYS.AUTH_TOKEN, authToken);
                sessionStorage.setItem(KEYS.AUTH_EXPIRY, authExpiry);
                sessionStorage.setItem(KEYS.AUTH_EMAIL, authEmail);
            } else {
                resetAuthStateStore();
            }
        } else {
            resetAuthStateStore();
        }
    } catch (e) {
        console.error("The following error occured while logging in user: ", e);
        resetAuthStateStore();
    }
};

const resetAuthStateStore = () => {
    AuthStateStore.setBulk([
        { key: KEYS.IS_AUTHENTICATED, value: false },
        { key: KEYS.AUTH_TOKEN, value: null },
        { key: KEYS.AUTH_EXPIRY, value: 0 },
        { key: KEYS.AUTH_EMAIL, value: null },
    ]);
    sessionStorage.clear();
};

export const restoreAuthStateStoreFromSession = () => {
    const authToken = sessionStorage.getItem(KEYS.AUTH_TOKEN);
    const authEmail = sessionStorage.getItem(KEYS.AUTH_EMAIL);
    const isAuthenticatedRaw = sessionStorage.getItem(KEYS.IS_AUTHENTICATED);
    const isAuthenticated = isAuthenticatedRaw === true || isAuthenticatedRaw === "true";
    const authExpiryRaw = sessionStorage.getItem(KEYS.AUTH_EXPIRY);
    const authExpiry =
        typeof authExpiryRaw === "string" ? parseInt(authExpiryRaw, 10) : authExpiryRaw;

    // TODO: here we should really re-check the auth token instead and use server time instead of
    // both server and client time.
    if (isAuthenticated === true && authExpiry > moment().unix()) {
        AuthStateStore.setBulk([
            { key: KEYS.IS_AUTHENTICATED, value: isAuthenticated },
            { key: KEYS.AUTH_TOKEN, value: authToken },
            { key: KEYS.AUTH_EXPIRY, value: authExpiry },
            { key: KEYS.AUTH_EMAIL, value: authEmail },
        ]);
    } else {
        resetAuthStateStore();
    }
};
