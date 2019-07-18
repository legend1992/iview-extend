import Vue from 'vue';

const instance = new Vue();
const methods = ('info confirm').split(' ');
function modal() {
  return modal.confirm();
}

function createModal(method, content) {
  return new Promise((resolve) => {
    let options;
    if (method === 'info') {
      options = {
        title: '信息提示框',
      }
    } else {
      options = {
        title: '确认框',
        loading: true,
        onOk: () => {
          resolve(instance.$Modal);
        },
        onCancel: () => {
          resolve(false);
        },
      }
    }
    Object.assign(options, {
      content,
    });

    instance.$Modal[method](options);
  });
}

methods.forEach((name) => {
  modal[name] = content => createModal(name, content);
});

export default modal;
 