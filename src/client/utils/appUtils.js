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

export const getUsers = async (appId: string, offset: number): Array<Object> => {
    try {
        const userResponse = await request
            .get(`https://guarded-thicket-22918.herokuapp.com/apps/${appId}/users?offset=${offset}`)
            .set("Authorization", AuthStateStore.get(KEYS.AUTH_TOKEN));

        console.log("userResponse", userResponse);

        if (userResponse != null && userResponse.status === 200) {
            return idx(userResponse, _ => _.body.users) || [];
        }

        return [];
    } catch (e) {
        console.error("The following error occured while getting user list: ", e);
        return [];
    }
};

export const updateApp = async updatedApp => {
    try {
        // TODO: updatedApp should really be nullchecked here
        const updateResponse = await request
            .put(`https://guarded-thicket-22918.herokuapp.com/apps/${updatedApp.id}`)
            .set("Authorization", AuthStateStore.get(KEYS.AUTH_TOKEN))
            .set("Content-Type", "application/json")
            .send({ app: updatedApp });

        console.log("updateResponse", updateResponse);
        //
        // if (updateResponse != null && updateResponse.status === 200) {
        //     return idx(updateResponse, _ => _.body.users) || [];
        // }
        //
        // return [];
    } catch (e) {
        console.error("The following error occured while getting user list: ", e);
        // return [];
    }
};

// # Update an app
// curl -H "Content-Type: application/json" -H "Authorization: $token" -X PUT -d '{"name":"New Name"}' https://guarded-thicket-22918.herokuapp.com/apps/ebdb9723-39ba-4157-9d36-aa483581aa13
// # {
// #     "app": {
// #         "id": "ebdb9723-39ba-4157-9d36-aa483581aa13",
// #         "name": "New Name",
// #         "created": "2016-01-25T03:57:53.873Z",
// #         "logo": "http://lorempixel.com/400/400/animals"
// #     }
// # }

// # List users of an app (first page of 25 users)
// curl -H "Authorization: $token" https://guarded-thicket-22918.herokuapp.com/apps/ebdb9723-39ba-4157-9d36-aa483581aa13/users
// # {
// #     "users": [
// #         {
// #             "id": "6b09a204-0653-4303-9370-222b06c478a8",
// #             "name": "Madeline Runte",
// #             "email": "Viviane.Beatty58@yahoo.com",
// #             "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/chrisstumph/128.jpg"
// #         },
// #         {
// #             "id": "f73b5837-6035-40d8-8008-c0e71605670b",
// #             "name": "Marlin Goodwin",
// #             "email": "Zechariah.Fisher@yahoo.com",
// #             "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/HenryHoffman/128.jpg"
// #         },
// #         // and so on...
// #     ]
// # }
//
// # List users of an app (second page of 25 users)
// curl -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1vbmRvQGV4YW1wbGUuY29tIiwiaWF0IjoxNDU0NTM1MDg4LCJleHAiOjE0NTQ1MzY4ODh9.7ehzJgS_OojT37j076I05l1ZNKc62AKOpL-aeqR0GkM" https://guarded-thicket-22918.herokuapp.com/apps/ebdb9723-39ba-4157-9d36-aa483581aa13/users?offset=25
