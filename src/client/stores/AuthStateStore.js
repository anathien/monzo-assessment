// Note: I had a state store lying around from another project, just modified it for this
// exercise.

import EventEmitter from "events";

const CHANGE_EVENT = "change";

export const KEYS = {
    IS_AUTHENTICATED: "is_authenticated",
    AUTH_TOKEN: "auth_token",
    AUTH_EXPIRY: "auth_expiry",
    AUTH_EMAIL: "auth_email",
    // AUTH_DATE: "auth_date",  // At the moment I'm using Date.now for simplicity
};

const approvedKeys = [
    KEYS.IS_AUTHENTICATED,
    KEYS.AUTH_TOKEN,
    KEYS.AUTH_EXPIRY,
    KEYS.AUTH_EMAIL,
    // KEYS.AUTH_DATE
];

const isApprovedKey = key => {
    return approvedKeys.indexOf(key) > -1;
};

const state: Map<string, ?string | ?boolean | ?number> = new Map();

class AuthState extends EventEmitter {
    get = (key: string): void | ?string | ?boolean | ?number => {
        if (isApprovedKey(key)) {
            return state.get(key);
        }
    };

    set = (key: string, value: ?string | ?boolean | ?number, emit: boolean = true) => {
        if (key != null && isApprovedKey(key)) {
            state.set(key, value);
            if (emit) {
                this.emitChange([key]);
            }
            return value;
        }
        console.warn("You must provide a `key: string` and a `value: string | boolean | number`");
        console.warn(`Provided key ${key} : value: `, value);
    };

    setBulk = (data: Array<{ key: string, value: ?string | ?boolean | ?number }>) => {
        if ((data || []).every(item => isApprovedKey(item.key))) {
            (data || []).forEach(dataItem => {
                this.set(dataItem.key, dataItem.value, false);
            });
            this.emitChange((data || []).map(dataItem => dataItem.key));
        }
    };

    getFullState() {
        return state;
    }

    emitChange(keys) {
        this.emit(CHANGE_EVENT, keys);
    }

    addChangeListener(cb) {
        this.addListener(CHANGE_EVENT, cb);
    }

    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }
}

const store = new AuthState();

export default store;
