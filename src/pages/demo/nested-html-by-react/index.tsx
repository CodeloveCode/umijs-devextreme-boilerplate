import React, { SyntheticEvent, useEffect, useRef } from 'react';
import data from './testJqueryHtml.html';

// 尝试将其他系统现有的jquery制作的html 直接嵌入到 React组件中.
// PS: 如果html中有外部的script引用,如Jquery这些,建议用nginx建立一个文件服务器提供服务.修改html中的链接到文件服务器的对应url.

// 方法3:使用React的dangerouslySetInnerHTML属性,来安全的注入html 的文本内容.(会自动转义,防止XSS攻击)
export default () => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: data }} />
    </div>
  );
};
