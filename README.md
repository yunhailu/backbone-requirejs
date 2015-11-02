# backbone-requirejs

自己摸索出的一套backbone+requirejs的基础架构，对于spa项目开发相当高效。

有全局路由和404路由，可以很好的处理这方面的需求，爱上express的路由机制之后，再用其他的路由确实感觉挫的很，所以这个简单架构算是我将之前用nodejs时的思维搬到了backbone。
性能如何有待验证，但是对于我的项目需求足以满足。

一个视图对应一个model，可能有些浪费，但是用起来方便。支持多视图同步render，分解复杂模块，项目中有演示。

模块化支持routers 、events、template、ui分离。

打包流程没弄进来，以后有机会再另说。
