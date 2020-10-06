import { Response } from 'umi';
import Mock from "mockjs";

var Random = Mock.Random;
Random.date();
Random.email();
Random.url();
Random.image();
var appListMock = Mock.mock({
    'list|50': [{
        "id|+1": 1,
        "name": "系统管理",
        "logo": "@image",
        "homeUrl": "@url",
        "description": "应用管理",
        "type": 1,
        "enableState": 1,
        "companyId": null,
        "code": "point-dept",
        "createTime": "@date",
    }],
});
var appList = appListMock.list
// console.log('appList', appList)
// const appList = [
// {
//     "id": "2",
//     "name": "系统管理",
//     "logo": "data:image/png;base64,base64str的内容",
//     "homeUrl": null,
//     "description": "应用管理",
//     "type": 1,
//     "enableState": 1,
//     "companyId": null,
//     "code": "point-dept",
//     "createTime": "2020-09-09 17:00:06"
// },
// {
//     "id": "3",
//     "name": "系统管理",
//     "logo": "data:image/png;base64,base64str的内容",
//     "homeUrl": null,
//     "description": "应用管理",
//     "type": 1,
//     "enableState": 1,
//     "companyId": null,
//     "code": "point-dept",
//     "createTime": "2020-09-09 17:00:06"
// }]

export default {
    'GET /sys/app/list': (req: any, res: Response) => {
        res.status(200).json({ code: 200, message: 'OK', data: appList }).end('OK')
    },
    // 'POST /api/todos/create': (req: any, res: any) => {
    //     // 添加跨域请求头
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    // },
}