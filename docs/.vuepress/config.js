module.exports = {
  title: 'iview-extends2',
  description: '基于iview拓展的一些组件，适用于vue',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      {
        text: '组件',
        link: '/components/',
        items: [
          {
            text: '导航',
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
          // {
          //   text: '表单',
          //   items: [
          //     {
          //       text: 'ive-checkbox-group 多选框',
          //       link: '/components/ive-checkbox-group'
          //     },
          //     {
          //       text: 'ive-date-picker 日期选择器',
          //       link: '/components/ive-date-picker'
          //     },
          //     {
          //       text: 'ive-date-range-picker 日期范围选择器',
          //       link: '/components/ive-date-range-picker'
          //     },
          //     {
          //       text: 'ive-input 输入框',
          //       link: '/components/ive-input'
          //     },
          //     {
          //       text: 'ive-input-number 数字输入框',
          //       link: '/components/ive-input-number'
          //     },
          //     {
          //       text: 'ive-radio 单选框',
          //       link: '/components/ive-radio'
          //     },
          //     {
          //       text: 'ive-select 选择器',
          //       link: '/components/ive-select'
          //     },
          //     {
          //       text: 'ive-textarea 多行文本',
          //       link: '/components/ive-textarea'
          //     },
          //     {
          //       text: 'ive-table 表格',
          //       link: '/components/ive-table'
          //     },
          //     {
          //       text: 'ive-upload 单张图片上传',
          //       link: '/components/ive-upload'
          //     },
          //     {
          //       text: 'ive-import-data 数据导入',
          //       link: '/components/ive-import-data'
          //     },
          //     {
          //       text: 'ive-filter-form 条件查询',
          //       link: '/components/ive-filter-form'
          //     },
          //     {
          //       text: 'ive-edit-form 表单',
          //       link: '/components/ive-edit-form'
          //     },
          //     {
          //       text: 'ive-edit-modal 编辑表单对话框',
          //       link: '/components/ive-edit-modal'
          //     },
          //   ],
          // },
          // {
          //   text: '视图',
          //   items: [
          //     {
          //       text: 'iveModal 对话框',
          //       link: '/views/iveModal'
          //     },
          //     {
          //       text: 'ive-icon-tooltip 文字提示',
          //       link: '/views/ive-icon-tooltip'
          //     },
          //     {
          //       text: 'ive-timeline 时间轴',
          //       link: '/views/ive-timeline'
          //     },
          //   ],
          // },
          // {
          //   text: '其它',
          //   items: [
          //     {
          //       text: 'ive-spin 加载圈',
          //       link: '/components/ive-spin'
          //     },
          //     {
          //       text: 'ive-contextmenu 右键菜单',
          //       link: '/components/ive-contextmenu'
          //     },
          //     {
          //       text: 'ive-editor 富文本编辑器',
          //       link: '/components/ive-editor'
          //     },
          //   ],
          // },
        ],
      },
      { text: 'github', link: 'https://github.com/legend1992/iview-extend' },
    ],
    sidebar: [
      {
        title: '导航',
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
    ],
    lastUpdated: 'Last Updated',
    smoothScroll: true,
  },
  markdown: {
    lineNumbers: true,
  },
}