const components = {};
const requireComponent = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /ive-[a-z][-\w]+\.(vue|js)$/,
);
requireComponent.keys().forEach((fileName) => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);
  // 获取组件名
  const componentName = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '');

  components[componentName] = componentConfig.default;
});

export default components;
