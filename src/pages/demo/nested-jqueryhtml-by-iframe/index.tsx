import React, { SyntheticEvent, useEffect, useRef } from 'react';
import data from './testJqueryHtml.html';

// 尝试将其他系统现有的jquery制作的html 直接嵌入到 React组件中.
// PS: 如果html中有外部的script引用,如Jquery这些,建议用nginx建立一个文件服务器提供服务.修改html中的链接到文件服务器的对应url.

// 方法1:读取html内容后,使用iframe的document.write写入.
export default () => {
  const initContent = (
    event: React.SyntheticEvent<HTMLIFrameElement, Event>,
  ) => {
    let frame = event.target as HTMLIFrameElement;
    // @ts-ignore
    frame?.contentWindow.document.write(data);
  };
  return (
    <div>
      <iframe
        title="component-ui"
        onLoad={initContent}
        style={{ width: '100%', border: '0px', height: '1100px' }}
        // sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads-without-user-activation allow-modals allow-storage-access-by-user-activation"
        scrolling="auto"
      />
    </div>
  );
};
