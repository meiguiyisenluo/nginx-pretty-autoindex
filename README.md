## 开发

RouterConfig.js 中的
autoindex_server: 服务器地址
autoindex_endpoint: nginx autoindex json 路由
web_endpoint: 本项目打包dist的服务路由

如果不清楚路由要填什么的可参考源码和下方的 nginx 配置 或者使用完全一样的配置

npm install
npm run dev

## 打包

npm run build

## 部署

nginx 配置如下，替换一下 path-to-your-dist

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
