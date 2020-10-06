import { createLogger } from 'redux-logger';
// import { RequestConfig } from 'umi';
// import { authorizationRequestInterceptor, errorConfig, notLoginResponseInterceptor } from './utils/umi-request-enhancer';

import themes from 'devextreme/ui/themes';
import { notifyError } from './utils/devExtremeUtils';
import zhMessages from 'devextreme/localization/messages/zh.json';
import jaMessages from 'devextreme/localization/messages/ja.json';
import enMessages from 'devextreme/localization/messages/en.json';
import { locale, loadMessages } from 'devextreme/localization';

// 配置dvaJs的Effects的全局异常处理.
export const dva = {
  config: {
    onAction: createLogger(),
    onError(e: Error) {
      console.error(e.message);
      notifyError(e.message);
    },
  },
};


// 配置umi-request.
// export const request: RequestConfig = {
//   timeout: 20000 * 600,
//   errorConfig,
//   middlewares: [],
//   requestInterceptors: [authorizationRequestInterceptor],
//   responseInterceptors: [notLoginResponseInterceptor],
// };

// themes.current("material.purple.dark");

// devextreme组件国际化.加载所有国际化字典,并根据浏览器语言自动设置.
loadMessages(zhMessages);
loadMessages(enMessages);
loadMessages(jaMessages); // 日语
locale(navigator.language);
