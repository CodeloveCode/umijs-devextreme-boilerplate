import React from 'react'

/**
 * 读取外部配置文件中的configs对象.
 */
export default () => {
    const _document: any = document
    const configs = _document['$configs']
    const urls = configs.urls

    const urlBook = urls.uri_company + '/book'
    fetch(urlBook)
    // do fetch...
    console.log('url_company', urls.uri_company)
    return (
        <h1>{urls.uri_company}</h1>
    )
}