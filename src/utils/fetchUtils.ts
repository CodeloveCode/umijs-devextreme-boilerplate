import { notifySuccess, notifyWarning, notifyError } from "./devExtremeUtils";

/*
 * 参考:https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
 *
 */
/**
 * 
 * @param {*} url 
 */
function _get(url: string) {
    // fetch()
    return _fetch(url, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit.要发送cookie则使用include
        // headers: {
        //     'user-agent': 'Mozilla/4.0 MDN Example',
        //     'content-type': 'application/json'
        // },
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
}

/**
 * 
 * @param {*} url 
 * @param {*} params 一个对象.
 */
function _post(url: string, params = {}) {
    return _fetch(url, {
        body: JSON.stringify(params),
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            // 'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // *client, no-referrer
    })
}

function _put() {

}

function _destroy() {

}

/**
 * https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
 * 1. 为fetch增加错误处理.fetch默认不会对400,500等状态码reject
 * 
 * @param {*} url 
 * @param {*} options 
 */
function _fetch(url: string, options: RequestInit) {
    return fetch(url, options)
        .then(checkResponseStatus)
        .then(response => response.json()) // 目前本项目都是json类型的请求参数和回应.
        .catch(error => {
            notifyError(JSON.stringify(error))
        })
}

function checkResponseStatus(response: Response) {
    if (response.status >= 200 && response.status <= 300 && response.ok) {
        return response
    }

    const error = new Error(response.statusText)
    error.name = response.status as unknown as string
    Object.defineProperty(error, 'response', response)
    throw error
}

// function _get(){

// }
export { _get, _post, _put, _destroy }
