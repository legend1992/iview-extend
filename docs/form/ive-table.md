# ive-table
## 一、代码示例
### html
```html
<template>
  <div>
    <ive-table
      ref="table"
      :columns="columns"
      :getListApi="getListApi"
      :deleteApi="deleteApi"
      @showEditModal="showEditModal"
      @showBatchEditModal="showBatchEditModal"
      @remove="remove"
      @upload-success="uploadSuccess"
    >
      <template slot-scope="{ row }" slot="id">
        <span>{{ row.id }}</span>
      </template>
    </ive-table>
  </div>
</template>
```
### js
```js
export default {
  data() {
    return {
      columns: [
        {
          title: 'id',
          slot: 'id',
        }, {
          title: '列2',
          key: 'c2',
        }, {
          title: '操作',
          slot: 'action',
        },
      ],
      getListApi: () => ({
        data: {
          count: 3,
          data: [{
            id: 1,
          },{
            id: 2,
          },{
            id: 3,
          }],
        },
      }),
      actions: {
        add: true,
        edit: true,
        remove: true,
        export: true,
        exportAll: true,
        import: true,
        batchRemove: true,
        batchEdit: true,
      },
      importApi: (formData) => {}
      deleteApi: (id) => {},
      exportAllUrl: '/exportAll',
    }
  },
  methods: {
    showEditModal(id, row) {
      console.log(id, row);
    },
    showBatchEditModal(selectData) {
      console.log(selectData);
    },
    async remove(id, modal, row) {
      // 如果没传deleteApi，则会执行此方法，删除逻辑需自行实现
      // await remove(id);
      modal.remove();
    },
    uploadSuccess(resData) {
      console.log(resData);
    }
  },
}
```
## 二、属性、事件及方法说明
### 属性（props）
| 属性 | 说明 | 类型 | 默认值 |
| ------ | ------ | ------ | ------ |
| columns | 表格列的配置描述，具体项见<a href="http://v3.iviewui.com/components/table#column" target="_blank">iview文档</a>，用法一致 | Array | 无（必填） |
| getListApi | 获取表格数据的接口 | Function | 无（必填） |
| actions | 操作配置: {<br>add: 添加,<br>edit: 编辑<br>remove: 删除<br>export: 导出<br>exportAll: 全部导出<br>import: 导入<br>batchRemove: 批量删除<br>batchEdit: 批量编辑<br>} | Object | {<br>add: true,<br>edit: true<br>remove: true<br>export: false<br>exportAll: false<br>import: false<br>batchRemove: false<br>batchEdit: false<br>} |
| importApi | 导入文件的接口（接收包含选择文件的formData为参数）（只在actions.import为true时需要） | Function | 无 |
| deleteApi | 删除数据的接口（接收表格行数据的id）（只在actions.remove为true时需要，若action.remove为true时deleteApi不存在，则会$emit('remove')事件，详见下文） | Function | null |
| exportAllUrl | 导出所有数据的url（只在actions.exportAll为true时需要） | String | javascript:; |
| filename | 导出文件的文件名（只在actions.export为true时需要） | String | 导出数据 |
| exportColumns | 导出文件的列的配置，具体项同columns（只在actions.export为true时需要） | Array | [] |
### 事件（events）
| 事件名 | 说明 | 返回值 |
| ------ | ------ | ------ |
| showEditModal | 用户点击添加按钮触发 | 无 |
| showEditModal | 用户点击编辑按钮/批量编辑数据只有一条时触发 | id(行数据id), row(行数据) |
| showBatchEditModal | 用户点击批量编辑且数据大于一条时触发 | selectionData: 用户选中的所有数据 |
| remove | 用户点击删除按钮时且deleteApi为null时触发 | id(行数据id), modal(确认弹窗实例，删除成功后需要手动调用modal.remove()关闭弹窗)), row(行数据) |
| upload-success | 导入文件成功后触发 | resData(后台返回的结果) |
### 作用域插槽（slot-scope）
如果需要在某列用作用域插槽，将插槽标签上slot的值和columns中该列对应项的slot赋值一致即可