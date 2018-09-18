import request from "superagent";
import idx from "idx";
import AuthStateStore, { KEYS } from "./../stores/AuthStateStore";

export const loginUser = async (email: string, password: string) => {
    console.log("got called!");
    try {
        const loginResponse = await request
            .post("https://guarded-thicket-22918.herokuapp.com/login")
            .set("Content-Type", "application/json")
            .send({ email: email, password: password, expiry: "5m" });

        if (loginResponse != null && loginResponse.status === 200) {
            const authToken = idx(loginResponse, _ => _.body.accessToken);

            const tokenResponse = await request
                .get("https://guarded-thicket-22918.herokuapp.com/")
                .set("Authorization", authToken);

            if (tokenResponse != null && tokenResponse.status === 200) {
                AuthStateStore.setBulk([
                    { key: KEYS.IS_AUTHENTICATED, value: true },
                    { key: KEYS.AUTH_TOKEN, value: authToken },
                    { key: KEYS.AUTH_EXPIRY, value: idx(tokenResponse, _ => _.body.token.exp) },
                    { key: KEYS.AUTH_EMAIL, value: idx(tokenResponse, _ => _.body.token.email) },
                ]);
            } else {
                resetAuthStateStore();
            }

            console.log("tokenResponse", tokenResponse);
        } else {
            resetAuthStateStore();
        }

        console.log("response: ", loginResponse);
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
};

// # Obtain an access token
// curl -H "Content-Type: application/json" -X POST -d '{"email":"mondo@example.com","password":"hunter2"}' https://guarded-thicket-22918.herokuapp.com/login
// # Status: 200
// # {
// #     "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1vbmRvQGV4YW1wbGUuY29tIiwiaWF0IjoxNDU0NTMzMDc4LCJleH# AiOjE0NTQ1MzQ4Nzh9.9nnNyJaR-oZeOjlGFUrimSuLzRUJ3kfzuxbQwTuODBg"
// # }
//
// # Test your access token
// curl -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1vbmRvQGV4YW1wbGUuY29tIiwiaWF0IjoxNDU0NTMzMDc4LCJleHAiOjE0NTQ1MzQ4Nzh9.9nnNyJaR-oZeOjlGFUrimSuLzRUJ3kfzuxbQwTuODBg" https://guarded-thicket-22918.herokuapp.com/
// # Status: 401
// # {
// #     "message": "The API is alive and your access token is valid :)",
// #     "token": {
// #         "email": "mondo@example.com",
// #         "iat": 1454533078,
// #         "exp": 1454534878
// #     }
// # }
//
// # Login failure
// $ curl -H "Content-Type: application/json" -X POST -d '{"email":"mondo@example.com","password":"not hunter2"}' https://guarded-thicket-22918.herokuapp.com/login
// # Status: 200
// # {
// #     "error": "Cannot log in with the given email and password."
// # }
//
// # Get a short-lived access token to test re-authentication
// curl -H "Content-Type: application/json" -X POST -d '{"email":"mondo@example.com","password":"hunter2","expiry":"10s"}' https://guarded-thicket-22918.herokuapp.com/login
//
