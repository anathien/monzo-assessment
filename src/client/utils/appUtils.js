import request from "superagent";
import idx from "idx";
import AuthStateStore, { KEYS } from "./../stores/AuthStateStore";

export const getApps = async (): Array<Object> => {
    try {
        const appResponse = await request
            .get("https://guarded-thicket-22918.herokuapp.com/apps")
            .set("Authorization", AuthStateStore.get(KEYS.AUTH_TOKEN));

        if (appResponse != null && appResponse.status === 200) {
            return idx(appResponse, _ => _.body.apps) || [];
        }

        return [];
    } catch (e) {
        console.error("The following error occured while getting app list: ", e);
        return [];
    }
};

export const getApp = async (): Object => {
    const appResponse = await request
        .get(
            "https://guarded-thicket-22918.herokuapp.com/apps/caea55bb-1e01-4a35-8a23-e5431bf114b8"
        )
        .set("Authorization", AuthStateStore.get(KEYS.AUTH_TOKEN));

    console.log("appre", appResponse);
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
