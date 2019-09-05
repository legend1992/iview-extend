<template>
  <div class="ui-list">
    <ive-checkbox-group :value="[0, 1]" :options="{
      0: '选项1',
      1: '选项2',
      2: '选项3',
    }" :parseIntKey="true"/>
    <ive-filter-form @query="query" :formConfig="formConfig" />
    <!-- <ive-edit-form
      :formConfig="formConfig"
    />-->
    <!-- <ive-edit-modal id="1" :modal="true" :formConfig="formConfigBatchEdit" :getDetailApi="getDetailApi" /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      formConfig: [
        {
          prop: 'x1',
          label: 'x1',
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
              placeholder: "请选择模式",
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
              placeholder: "请选择场景",
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
              placeholder: "请选择资源类型",
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
      ],
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
    }
  }
};
</script>

<style>
@import "styles/iview-extends2.css";
</style>
