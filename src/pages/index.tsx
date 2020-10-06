import React, { Fragment } from 'react';
import { Redirect } from 'umi';
// import Portal from './portal';

// 访问根路径,默认访问portal
// export default () => <Redirect to="/home" />;
export default () => {
    return (
        <Fragment>
            <h1>Home Page</h1>
        </Fragment>
    )
}