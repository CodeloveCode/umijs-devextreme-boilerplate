import React, { useEffect, useRef } from 'react';

// iframe的src中,如果是跨域地址,建议配置一个本地代理服务器.进行转发.
// 配置后访问:http://localhost:8000/component-ui/login.html,实际访问:http://118.31.184.21:8899/component-ui/login.html
export default () => {
  return (
    <div>
      <iframe
        title="component-ui"
        src={'http://localhost:8000/bbb/s?wd=vskysoft'}
        style={{ width: '100%', border: '0px', height: '1100px' }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        scrolling="auto"
      />
    </div>
  );
};
