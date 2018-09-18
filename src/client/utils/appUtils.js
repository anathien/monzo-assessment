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
    } catch (e) {
        console.error("The following error occured while getting user list: ", e);
    }
};
