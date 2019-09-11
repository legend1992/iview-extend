<template>
  <div class="ui-list">
    <h2>ive-checkbox-group</h2>
    <ive-checkbox-group
      :value="[0, 1]"
      :options="{
      0: '选项1',
      1: '选项2',
      2: '选项3',
    }"
      :parseIntKey="true"
    />
    <h2>ive-date-picker</h2>
    <ive-date-picker v-model="date" placeholder="请选择" :disabledDate="new Date('2019-9-5')" />
    <h2>ive-date-range-picker</h2>
    <ive-date-range-picker
      v-model="rangeDate"
      :placeholder="['请选择开始时间', '请选择结束时间']"
      @input="dateRangeInput"
    />
    <h2>ive-icon-tooltip</h2>
    <ive-icon-tooltip />
    <h2>ive-input</h2>
    <ive-input />
    <h2>ive-input-number</h2>
    <ive-input-number v-bind="numberProps"/>
    <h2>ive-radio</h2>
    <ive-radio v-bind="radioProps" />
    <h2>ive-select</h2>
    <ive-select v-bind="selectProps" @input="selectInput" />
    <h2>ive-filter-form</h2>
    <ive-filter-form @query="query" :formConfig="formConfig" />
    <h2>ive-edit-form</h2>
    <ive-edit-form :formConfig="formConfig" />
    <!-- <ive-edit-modal id="1" :modal="true" :formConfig="formConfigBatchEdit" :getDetailApi="getDetailApi" /> -->
  </div>
</template>

<script>
export default {
  data() {
    const oneDay = 24 * 60 * 60 * 1000;
    return {
      date: "2019-9-1",
      rangeDate: ["2019-9-15", "2019-9-16"],
      numberProps: {
        value: 99.13,
        max: 100,
        min: 99,
        placeholder: '输入数字',
        parseIntValue: true,
        // step: 0.1,
      },
      radioProps: {
        value: 1,
        // options: [0, 1, 2],
        parseIntKey: true,
        options: {
          0: '选项1',
          1: '选项2',
          2: '选项3',
        },
        // disabled: true,
      },
      selectProps: {
        // value: 1,
        options: [0, 1, 2, 3],
        // disabled: true,
        // value: [0, 1, 2, 3],
        // options: {
        //   0: '选项1',
        //   1: '选项2',
        //   2: '选项3',
        // },
        // multiple: true,
        // maxTagCount: 2,
        // maxTagPlaceholder: e => `more ${e}`,
        // maxTagSelect: 3,
        // parseIntKey: true,
        // clearable: true,
        filterable: true,
      },
      formConfig: [
        {
          prop: "x1",
          label: "x1"
        }
      ],
      formConfigBatchEdit: [
        {
          prop: "startAt",
          label: "开始时间",
          itemConfig: {
            tagName: "ive-date-picker",
            props: {
              type: "datetime"
            },
            on: {
              // input: this.getStartAtVal
            }
          }
        },
        {
          prop: "endAt",
          label: "结束时间",
          itemConfig: {
            tagName: "ive-date-picker",
            props: {
              type: "datetime",
              disabledDate: null
            }
          }
        },
        {
          prop: "mode",
          label: "模式",
          required: true,
          itemConfig: {
            tagName: "ive-select",
            props: {
              placeholder: "请选择模式"
              // options: replyMode
            }
          }
        },
        {
          prop: "scene",
          label: "场景",
          required: true,
          itemConfig: {
            tagName: "ive-select",
            props: {
              placeholder: "请选择场景"
              // options: replyScene
            },
            on: {
              // input: this.getSceneVal
            }
          }
        },
        {
          prop: "detail",
          label: "场景细项",
          required: true,
          itemConfig: {
            tagName: "ive-select",
            props: {
              placeholder: "请选择场景细项",
              options: []
            }
          }
        },
        {
          prop: "active",
          label: "是否启用",
          required: true,
          itemConfig: {
            tagName: "ive-select",
            value: 1,
            props: {
              placeholder: "是否启用",
              // options: replyActive,
              parseIntKey: true
            }
          }
        },
        {
          prop: "text",
          label: "文案",
          required: true,
          itemConfig: {
            props: {
              maxlength: 256
            }
          },
          rules: [
            {
              // validator: this.$utils.strLengthCheck(31)
            },
            {
              // validator: this.$utils.strRegularPattern()
            }
          ]
        },
        {
          prop: "resourceType",
          label: "资源类型",
          itemConfig: {
            tagName: "ive-select",
            props: {
              placeholder: "请选择资源类型"
              // options: replyResourceType
            },
            on: {
              // input: this.getResourceVal
            }
          }
        },
        {
          prop: "resource",
          label: "资源数据",
          itemConfig: {
            props: {
              maxlength: 255
            }
          }
        }
      ]
    };
  },
  methods: {
    query(e) {
      console.log(e);
    },
    getDetailApi() {
      return {
        data: {
          data: {
            x1: "xxx"
          }
        }
      };
    },
    dateRangeInput(e) {
      console.log(e);
    },
    selectInput(e) {
      console.log(e);
    },
  }
};
</script>

<style>
@import "styles/iview-extends2.css";
.ui-list {
  margin-left: 1em;
}
h2 + * {
  margin-left: 2em!important;
  margin-bottom: 1em;
}
</style>
