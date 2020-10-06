
/**
 * 提供对sessionStorage的访问.
 */
export default function Store() {
}

Store.set = function (key: string, value: any) {
    if (value && value === Object(value)) {
        sessionStorage.setItem(key, '_isObj_' + JSON.stringify(value))
    } else {
        sessionStorage.setItem(key, value)
    }
}

Store.get = function (key: string) {
    let value = sessionStorage.getItem(key)
    if (value) {
        if (value.indexOf('_isObj_') === 0) {
            return JSON.parse(value.slice(7))
        }
        return value
    }
}

Store.remove = function (key: string) {
    return sessionStorage.removeItem(key)
}
Store.clear = function () {
    return sessionStorage.clear()
}
