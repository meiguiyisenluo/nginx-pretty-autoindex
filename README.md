## 开发
npm run dev

/src/App.vue中的 baseServer 与 endPoint 替换为自己实际的 服务器 与 路由 

/src/router/index.js 中的 /share 替换为自己实际的路由

如果不清楚路由要填什么的可参考源码和下方的nginx配置

## 打包
npm run build

## 部署
nginx配置如下，替换一下path-to-your-dist

```nginx
location /share {
    alias <path-to-your-dist>;
    index index.html;

    # history router
    try_files $uri $uri/ /share/index.html;
}

location /shareserver {
    # nginx autoindex
    alias /www/share;
    autoindex on;
    # 返回json
    autoindex_format json;
    autoindex_exact_size off;
        autoindex_localtime on;
    charset utf-8;

    # optionally allow CORS, if this frontend is running somewhere else
    add_header Access-Control-Allow-Origin *;

    # 防止nginx自动读取index.html 而不反回json
    index sdafshdkfjlgydfgdf.html;
}
```
