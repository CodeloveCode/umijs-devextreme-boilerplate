export class SessionStorageUtils {
    static set = function (key: string, value: any) {
        if (value && value === Object(value)) {
            sessionStorage.setItem(key, '_isObj_' + JSON.stringify(value))
        } else {
            sessionStorage.setItem(key, value)
        }
    }

    static get = function (key: string) {
        let value = sessionStorage.getItem(key)
        if (value) {
            if (value.indexOf('_isObj_') === 0) {
                return JSON.parse(value.slice(7))
            }
            return value
        }
    }

    static remove = function (key: string) {
        return sessionStorage.removeItem(key)
    }

    static clear = function () {
        return sessionStorage.clear()
    }
}

export class LocalStorageUtils {
    static set(key: string, value: any) {
        if (value && value === Object(value)) {
            localStorage.setItem(key, '_isObj_' + JSON.stringify(value))
        } else {
            localStorage.setItem(key, value)
        }
    }

    static get(key: string) {
        let value = localStorage.getItem(key)
        if (value) {
            if (value.indexOf('_isObj_') === 0) {
                return JSON.parse(value.slice(7))
            }
            return value
        }
    }

    static remove(key: string) {
        return localStorage.removeItem(key)
    }

    static clear() {
        return localStorage.clear()
    }
}

// TODO:
export class CookiesUtils {
    static set(key: string, value: any) {
        if (value && value === Object(value)) {
            localStorage.setItem(key, '_isObj_' + JSON.stringify(value))
        } else {
            localStorage.setItem(key, value)
        }
    }

    static get(key: string) {
        let value = localStorage.getItem(key)
        if (value) {
            if (value.indexOf('_isObj_') === 0) {
                return JSON.parse(value.slice(7))
            }
            return value
        }
    }

    static remove(key: string) {
        return localStorage.removeItem(key)
    }

    static clear() {
        return localStorage.clear()
    }
}

