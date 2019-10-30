import iview from 'iview';

let instance = null;
const titleMap = {
  info: '信息提示框',
  confirm: '确认框',
};
let inputValue;
function promptOptions(content) {
  let title;
  let placeholder;
  inputValue = undefined;
  if (typeof content === 'string') {
    title = content;
    placeholder = '请输入';
  } else {
    title = (content && content.title) || '请输入';
    placeholder = (content && content.placeholder) || '请输入';
  }
  return {
    render: h => h('div', null, [
      h('h3', {
        class: 'confirm-input',
      }, title),
      h('Input', {
        props: {
          autofocus: true,
          placeholder,
          value: content.value,
        },
        on: {
          input: (val) => {
            inputValue = val;
          },
        },
      }),
    ]),
  };
}
function initMethod(method, content) {
  return new Promise((resolve) => {
    let options;
    if (method === 'prompt') {
      options = promptOptions(content);
    } else {
      options = {
        title: titleMap[method],
        content,
      };
    }
    Object.assign(options, {
      loading: method !== 'info',
      onOk: () => {
        if (method === 'prompt') {
          resolve({
            modal: instance.$Modal,
            value: inputValue,
          });
        } else {
          resolve(instance.$Modal);
        }
      },
      onCancel: () => {
        resolve(false);
      },
    });
    const $method = method === 'prompt' ? 'confirm' : method;
    instance.$Modal[$method](options);
  });
}
function createModal(Vue) {
  const modal = {};
  instance = new Vue();
  Vue.use(iview);
  const methods = ['info', 'confirm', 'prompt'];
  methods.forEach((name) => {
    modal[name] = content => initMethod(name, content);
  });
  return modal;
}

export default createModal;
