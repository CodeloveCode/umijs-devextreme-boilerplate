import moment from "moment";
/**
 * 将Date对象或者合法的日期字符串格式化成'YYYY-MM-DD'
 * @param {Date|string} datetime 
 * @returns {string}
 */
function getDateStr(datetime: Date | string): string {
    return moment(datetime).format('YYYY-MM-DD')
}

/**
 * 将Date对象或者合法的日期字符串格式化成'HH:mm:ss'
 * @param {Date|string} datetime 
 * @returns {string}
 */
function getTimeStr(datetime: Date | string): string {
    return moment(datetime).format('HH:mm:ss')
}

/**
 * 将Date对象或者合法的日期字符串格式化成'YYYY-MM-DD HH:mm:ss'
 * @param {Date|string} datetime 
 * @returns {string}
 */
function getDateTimeStr(datetime: Date | string): string {
    return moment(datetime).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 将Date格式化成带T和Z关键字的UTC日期字符串,如:
 * "2020-08-24T14:05:00+08:00" 北京时间
 * 或者
 * "2020-08-24T09:05:00Z" 标准时间
 * @param {Date|string} datetime 
 */
function getUTCStr(datetime: Date | string): string {
    return moment(datetime).format('YYYY-MM-DDTHH:mm:ssZ')
}

export { getDateStr, getTimeStr, getDateTimeStr, getUTCStr }