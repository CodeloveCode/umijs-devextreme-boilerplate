import { Response } from 'umi';
// import { staffPhoto } from "";

export default {
    'POST /sys/login': (req: any, res: Response) => {
        res.status(200).json({ code: 200, message: '操作成功！', data: 'a1620edc-2a96-4ec0-9925-75432a494ffe' }).end('OK')
    },
    'POST /sys/profile': (req: any, res: Response) => {
        res.status(200).json({
            "code": 200,
            "message": "操作成功！",
            "data": {
                "userId": "1",
                "mobile": "vskysoft",
                "mailbox": "vskysoft",
                "workNumber": "vskysoft",
                "userName": "vskysoft",
                "company": "南京维思凯",
                "companyId": "1300243876568641536",
                "departmentName": null,
                "departmentId": null,
                "staffPhoto": "",
                "level": "saasAdmin",
                "permissions": {
                    "apis": [],
                    "menus": [],
                    "apps": [
                        "1"
                    ],
                    "points": []
                },
                "authCacheKey": null
            }
        }).end('OK')
    },
    'DELETE /sys/logout': (req: any, res: Response) => {
        res.status(200).json({
            "code": 200,
            "message": "操作成功！",
            "data": null
        }).end('OK')
    },
    // 'POST /api/todos/create': (req: any, res: any) => {
    //     // 添加跨域请求头
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    // },
}
// TODO:让request请求时,自动加上header: Authorization: a1620edc-2a96-4ec0-9925-75432a494ffe