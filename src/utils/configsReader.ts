import Store from './store';
import * as configs from '@/configs/configs';

/**
 * 从public/configs.js配置文件中读取所有urls
 */
export function getUrls(): any {
  return getConfigs().urls;
}

export function getConfigs(): any {
  // 开发时读取src/common下的配置,部署时读取public目录下的配置.
  if ('development' === process.env.NODE_ENV) {
    return configs;
  } else {
    const _window: any = window;
    const configs = _window.__configs;
    return configs;
  }
}


export function getUrlByName(urlName: string): string {
  const urls = getUrls();
  const url = urls[urlName] as string;
  if (url) {
    return url;
  } else {
    throw new Error(`从配置文件中读取指定的url:${urlName} 失败...`);
  }
}

/**
 * 从public/configs.js配置文件中读取指定名字的配置.只找一层.
 * @deprecated 暂未使用.
 */
export function getConfigByName(configName: string) {
  const _window: any = window;
  const configs = _window.__configs;
  // const configs = Store.get('__configs')
  const config = configs[configName];
  if (config) {
    return config;
  } else {
    throw new Error(`从配置文件中读取指定配置:${configName} 失败...`);
  }
}
