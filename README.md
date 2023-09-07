[ENGLISH](./README_EN.md)

<p align="center">
  <img src="./icon.png">
</p>
<h1 align="center">DataV</h1>
<p align="center">
    <a href="https://github.com/DataV-Team/datav/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/DataV-Team/datav.svg" alt="LICENSE" />
    </a>
    <a href="https://www.npmjs.com/package/@jiaminghi/data-view">
      <img src="https://img.shields.io/npm/v/@jiaminghi/data-view.svg" alt="LICENSE" />
    </a>
</p>

## DataV 是干什么的?

- DataV 是一个基于**Vue**的数据可视化组件库（当然也有[React 版本](https://github.com/DataV-Team/DataV-React)）
- 提供用于提升页面视觉效果的**SVG**边框和装饰
- 提供常用的**图表**如折线图等
- 飞线图/轮播表等其他组件

### npm 安装

```shell
$ npm install @jiaminghi/data-view
```

### 使用

```js
import Vue from "vue";
import DataV from "@jiaminghi/data-view";

Vue.use(DataV);

// 按需引入
import { borderBox1 } from "@jiaminghi/data-view";
Vue.use(borderBox1);
```

详细文档及示例请移步[HomePage](http://datav.jiaminghi.com).

### UMD 版

`UMD`版可直接使用`script`标签引入，`UMD`版文件位于项目`dist`目录下，引入后将自动把所有组件注册为**Vue 全局组件**，引入`DataV`前请确保已引入`Vue`。

[UMD 版使用示例](./umdExample.html)

### TODO

- **地图组件**
- **TS**重构组件库底层依赖

### 致谢

组件库的开发基于个人学习和兴趣，由于技术水平及经验的限制，组件尚有许多不完善之处，如有 BUG 可及时提交[issue](https://github.com/DataV-Team/DataV/issues/new?template=bug_report.md)或添加反馈群进行反馈，也欢迎提供指正和建议，感谢各位的支持。

### 反馈

![Feedback](./QQGroup.png)

### Demo

Demo 页面使用了全屏组件，请 F11 全屏后查看。

- [施工养护综合数据](http://datav.jiaminghi.com/demo/construction-data/index.html)

![construction-data](./demoImg/construction-data.jpg)

- [机电运维管理台](http://datav.jiaminghi.com/demo/manage-desk/index.html)

![manage-desk](./demoImg/manage-desk.jpg)

- [机电设备电子档案](http://datav.jiaminghi.com/demo/electronic-file/index.html)

![electronic-file](./demoImg/electronic-file.jpg)

## 修改成兼容 vue3 版改动

基于 DataV 2.10.0 版本的打包改动
由于 vue3 兼容 vue2 option API,且 datav 源码采用的 vue2api 在 vue3 中也兼容,改动内容如下

1. `decoration3` 和 `decoration6` 组件源码里将 `template` 的 `v-for` 绑定在 `rect` 上
2. 增加了打包成 `esm`,`iife`,`cjs` 格式,将依赖其余的库如`@jiaminghi/charts` 也打包进去(为了在 `vite` 中可以直接将使用 `esm` 格式,如果不打包,由于依赖的其他库作者是打包成 umd 模块,在开发过程中 vite 需要单独配置这些依赖或者单独引入才能进行依赖预购建成 esm 模块)
3. 修改了 rollup.config.mjs 和 rollup.terse 人.config.mjs 中的配置,增加了`esm`,`iife`,`cjs`入口文件,

## Vue2 版使用方式

和原来一样,只不过包名变成@iamzzg/data-view

## Vue3 版使用方式

`datav` 打包成 `vue3` 的版本在 `dist/vue3` 文件夹下

1. `umd` 使用方式
   未托管到 cdn,可以直接复制`dist/vue3/datav.map.vue.js`

```html
<script src="dist/vue3/datav.map.vue.js"></script>
<script>
  // app是createApp()的返回值
  app.use(datav);
</script>
```

2. `esm` 使用方式
   安装

```bash
npm i @iamzzg/data-view
```

全局注册

```js
import datav from "@iamzzg/data-view/dist/vue3/datav.map.vue.esm";

app.use(datav);
```

按需导入,和 vue2 方式一致

```js
import { borderBox1 } from "@iamzzg/data-view/dist/vue3/datav.map.vue.esm";
app.use(borderBox1);
```
