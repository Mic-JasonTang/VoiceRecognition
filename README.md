# Voice Recognition

[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![LICENSE](https://img.shields.io/badge/license-Anti%20996-blue.svg)](https://github.com/996icu/996.ICU/blob/master/LICENSE)

本项目基于 `Express` 和 `TensorFlow.js`所开发的语音识别案例。在启动程序后，可以通过 `http://127.0.0.1:3000` 进行访问。

## 第一次使用

### 安装环境依赖
  
  进入到VoiceRecognition目录，执行下面代码：
``` shell
npm install
```

### 启动服务

``` shell
node app.js
```
### 语音测试
  点击`语音测试`按钮，自动开始录制2s内的声音，录制结束后播放声音和显示预测结果。

  ![测试结果](https://github.com/Mic-JasonTang/VoiceRecognition/blob/master/public/images/turnon.png?raw=true)
  ![测试结果](https://github.com/Mic-JasonTang/VoiceRecognition/blob/master/public/images/turnoff.png?raw=true)

### 创建数据集
  点击`创建数据`按钮，自动开始录制2s内的声音，录制结束后播放声音并自动下载保存为`voice.txt`文件。

## 开发

### 项目目录结构

``` txt
root
    -- public
      -- fonts
      -- images
      -- js
      -- styles
      -- model
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

### 模型

模型为web_model格式，存放在在 `public` 目录下为 `model`（名字可自定义）的目录。
![模型结构](https://github.com/Mic-JasonTang/QuickDraw/blob/master/public/images/voice_recognition_model.png?raw=true)

### 路由

本项目使用 `Epxress` 作为 `Web Server`，使用方法可以参考 [这里](http://expressjs.com/en/guide/routing.html)。

## 部署

### 服务端口

默认使用 `3000` 作为 `Web` 对外开放服务端口