import Vue from 'vue';
import iview from 'iview';
Vue.use(iview);

const instance = new Vue();
const methods = ['info', 'confirm'];
const titleMap = {
  info: '信息提示框',
  confirm: '确认框',
};
const modal = {};

function createModal(method, content) {
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

methods.forEach((name) => {
  modal[name] = content => createModal(name, content);
});

export default modal;
