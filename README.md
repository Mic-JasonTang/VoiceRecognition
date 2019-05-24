# Express Bone

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

本项目为 `Express` 的骨架程序，开发者可以基于本项目进行 `TensorFlow.js` 方向的案例开发。在启动骨架程序后，可以通过 `http://127.0.0.1:3000` 进行访问。

## 第一次使用

### 安装环境依赖

``` shell
npm install
```

### 启动服务

``` shell
node app.js
```

## 开发

### 项目目录结构

``` txt
root
    -- public
      -- fonts
      -- images
      -- js
      -- styles
    -- routes
        -- views
        -- index.js
    -- templates
        -- views
    -- app.js
```

### 前端

本项目使用 `Pug` 作为前端开发语言，使用方法可以参考 [这里](https://pugjs.org/api/getting-started.html)

### 资源文件

本项目的资源文件存放在 `public` 目录下。

### 安装模型

开发者可以在 `public` 目录下新建名为 `model`（名字可自定义）的目录，并将 `TensorFlow.js` 的模型文件放置在该目录下。

### 路由

本项目使用 `Epxress` 作为 `Web Server`，使用方法可以参考 [这里](http://expressjs.com/en/guide/routing.html)。

## 部署

### 项目依赖

请将 `Web` 项目开发过程中所使用到的 `node.js` 包添加到 `package.json` 文件当中，格式如下：

``` json
{
  "dependencies": {
    "express": "^4.16.3",
    "pug": "^2.0.0-rc.2",
    "新增的包":"新增的包的版本号"
  }
}
```

### 服务端口

请使用 `3000` 作为 `Web` 对外开放服务端口，如有特殊需求，请邮件至 [innocamp@blackwalnut.tech](mailto:innocamp@blackwalnut.tech)