import notify from 'devextreme/ui/notify';
import { alert, confirm } from 'devextreme/ui/dialog';

// 成功消息通知.非模态
export function notifySuccess(message) {
  notify(
    {
      message: message,
      position: {
        my: 'center top',
        at: 'center top',
      },
    },
    'success',
    3000,
  );
}
// 警告消息通知.非模态
export function notifyWarning(message) {
  notify(
    {
      message: message,
      position: {
        my: 'center top',
        at: 'center top',
      },
    },
    'warning',
    3000,
  );
}

// 错误消息通知.非模态
export function notifyError(message) {
  notify(
    {
      message: message,
      position: {
        my: 'center top',
        at: 'center top',
      },
    },
    'error',
    3000,
  );
}

/**
 * 成功弹窗
 * @param {*} message
 */
export function alertSuccess(message): Promise<void> {
  return alert(message, '操作成功');
}
/**
 * 警告弹窗
 * @param {*} message
 */
export function alertWarning(message): Promise<void> {
  return alert(message, '警告!');
}
/**
 * 成功弹窗
 * @param {*} message
 */
export function confirmNotify(message): Promise<boolean> {
  return confirm(message, '操作确认');
}
/**
 * 错误弹窗
 * @param {*} message
 */
export function confirmError(message): Promise<boolean> {
  return confirm(message, '操作确认');
}
