module.exports = {
  title: 'iview-extends2',
  description: '基于iview拓展的一些组件，适用于vue',
  base: '/iview-extends/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      {
        text: '组件',
        items: [
          {
            text: '导航类',
            items: [
              {
                text: 'ive-page 分页',
                link: '/navigator/ive-page'
              },
              {
                text: 'ive-bread-crumb 面包屑',
                link: '/navigator/ive-bread-crumb'
              },
            ],
          },
          {
            text: '视图类',
            items: [
              {
                text: 'iveModal 对话框',
                link: '/views/iveModal'
              },
              {
                text: 'ive-icon-tooltip 文字提示',
                link: '/views/ive-icon-tooltip'
              },
              {
                text: 'ive-timeline 时间轴',
                link: '/views/ive-timeline'
              },
            ],
          },
          {
            text: '表单类',
            items: [
              {
                text: 'ive-checkbox-group 多选框',
                link: '/form/ive-checkbox-group'
              },
              {
                text: 'ive-date-picker 日期选择器',
                link: '/form/ive-date-picker'
              },
              {
                text: 'ive-date-range-picker 日期范围选择器',
                link: '/form/ive-date-range-picker'
              },
              {
                text: 'ive-input 输入框',
                link: '/form/ive-input'
              },
              {
                text: 'ive-input-number 数字输入框',
                link: '/form/ive-input-number'
              },
              {
                text: 'ive-radio 单选框',
                link: '/form/ive-radio'
              },
              {
                text: 'ive-select 选择器',
                link: '/form/ive-select'
              },
              {
                text: 'ive-textarea 多行文本',
                link: '/form/ive-textarea'
              },
              {
                text: 'ive-table 表格',
                link: '/form/ive-table'
              },
              {
                text: 'ive-upload 单张图片上传',
                link: '/form/ive-upload'
              },
              {
                text: 'ive-import-data 数据导入',
                link: '/form/ive-import-data'
              },
              {
                text: 'ive-filter-form 条件查询',
                link: '/form/ive-filter-form'
              },
              {
                text: 'ive-edit-form 表单',
                link: '/form/ive-edit-form'
              },
              {
                text: 'ive-edit-modal 编辑表单对话框',
                link: '/form/ive-edit-modal'
              },
            ],
          },
          {
            text: '其它',
            items: [
              {
                text: 'ive-spin 加载圈',
                link: '/others/ive-spin'
              },
              {
                text: 'ive-contextmenu 右键菜单',
                link: '/others/ive-contextmenu'
              },
              {
                text: 'ive-editor 富文本编辑器',
                link: '/others/ive-editor'
              },
            ],
          },
        ],
      },
      { text: 'github', link: 'https://github.com/legend1992/iview-extend' },
    ],
    sidebar: [
      {
        title: '导航类',
        children: [
          {
            title: 'ive-page 分页',
            path: '/navigator/ive-page',
          },
          {
            title: 'ive-bread-crumb 面包屑',
            path: '/navigator/ive-bread-crumb',
          },
        ]
      },
      {
        title: '视图类',
        children: [
          {
            title: 'iveModal 对话框',
            path: '/views/iveModal',
          },
          {
            title: 'ive-icon-tooltip 文字提示',
            path: '/views/ive-icon-tooltip',
          },
          {
            title: 'ive-timeline 时间轴',
            path: '/views/ive-timeline',
          },
        ]
      },
      {
        title: '表单类',
        children: [
          {
            title: 'ive-checkbox-group 多选框',
            path: '/form/ive-checkbox-group'
          },
          {
            title: 'ive-date-picker 日期选择器',
            path: '/form/ive-date-picker'
          },
          {
            title: 'ive-date-range-picker 日期范围选择器',
            path: '/form/ive-date-range-picker'
          },
          {
            title: 'ive-input 输入框',
            path: '/form/ive-input'
          },
          {
            title: 'ive-input-number 数字输入框',
            path: '/form/ive-input-number'
          },
          {
            title: 'ive-radio 单选框',
            path: '/form/ive-radio'
          },
          {
            title: 'ive-select 选择器',
            path: '/form/ive-select'
          },
          {
            title: 'ive-textarea 多行文本',
            path: '/form/ive-textarea'
          },
          {
            title: 'ive-table 表格',
            path: '/form/ive-table'
          },
          {
            title: 'ive-upload 单张图片上传',
            path: '/form/ive-upload'
          },
          {
            title: 'ive-import-data 数据导入',
            path: '/form/ive-import-data'
          },
          {
            title: 'ive-filter-form 条件查询',
            path: '/form/ive-filter-form'
          },
          {
            title: 'ive-edit-form 表单',
            path: '/form/ive-edit-form'
          },
          {
            title: 'ive-edit-modal 编辑表单对话框',
            path: '/form/ive-edit-modal'
          },
        ],
      },
      {
        title: '其它',
        children: [
          {
            title: 'ive-spin 加载圈',
            path: '/others/ive-spin',
          },
          {
            title: 'ive-contextmenu 右键菜单',
            path: '/others/ive-contextmenu',
          },
          {
            title: 'ive-editor 富文本编辑器',
            path: '/others/ive-editor',
          },
        ]
      },
    ],
    lastUpdated: 'Last Updated',
    smoothScroll: true,
  },
  markdown: {
    lineNumbers: true,
  },
}