import iview from 'iview';
let instance = null;
const titleMap = {
  info: '信息提示框',
  confirm: '确认框',
};
function initMethod(method, content) {
  return new Promise((resolve) => {
    let options = {
      loading: true,
      onOk: () => {
        resolve(instance.$Modal);
      },
      onCancel: () => {
        resolve(false);
      },
    }
    Object.assign(options, {
      title: titleMap[method],
      content,
    });

    instance.$Modal[method](options);
  });
}
const createModal = function(Vue) {
  const modal = {};
  instance = new Vue();
  Vue.use(iview);
  const methods = ['info', 'confirm'];
  methods.forEach((name) => {
    modal[name] = content => initMethod(name, content);
  });
  return modal;
};

export default createModal;
