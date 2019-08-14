<template>
  <Modal
    class="ive-import-modal"
    title="导入详情"
    :mask-closable="false"
    :value="importModal"
    @input="$emit('close')"
  >
    <Upload
      ref="upload"
      action=""
      :accept="accept"
      :format="format"
      :show-upload-list="false"
      :before-upload="handleUpload"
    >
      <Button icon="ios-cloud-upload-outline">选择导入文件</Button>
    </Upload>
    <div v-show="hasFile" class="file-wrapper">上传文件: {{ uploadFile[0] && uploadFile[0].name }}
      <Button class="delete" type="text" size="small" title="删除" @click.stop="remove">X</Button>
    </div>
    <div slot="footer">
      <Button type="error" :disabled="!hasFile" :title="exportButtonTitle" @click="upload('yes')">覆盖导入：唯一字段相同时直接覆盖</Button>
      <Button type="primary" :disabled="!hasFile" :title="exportButtonTitle" @click="upload('no')">跳过导入：唯一字段相同时不导入</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  nmae: 'ive-import-data',
  data() {
    return {
      uploadFile: [],
    }
  },
  props: {
    accept: {
      type: String,
      default: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    format: {
      type: Array,
      default: () => ['xls','xlsx'],
    },
    importModal: {
      type: Boolean,
      default: false,
    },
    importApi: {
      type: Function,
      required: true,
    },
  },
  computed: {
    hasFile() {
      return this.uploadFile.length !== 0;
    },
    exportButtonTitle() {
      return this.hasFile ? '点击导入' : '请先选择文件';
    },
  },
  methods: {
    formatCheck(file) {
      let checked = true;
      if (this.format && this.format.length) {
        const fileFormat = file.name.split('.').pop().toLocaleLowerCase();
        checked = this.format.some(item => item.toLocaleLowerCase() === fileFormat);
        if (!checked) {
          this.$Notice.warning({
            title: '上传文件格式错误',
            desc: `${file.name}的文件格式是不正确的,请选择${this.format.toString()}格式的文件`
          });
        }
      }
      return checked;
    },
    handleUpload(file) {
      if (this.formatCheck(file)) {
        this.uploadFile = [file];
      }
      return false;
    },
    async upload(cover) {
      if (this.uploadFile.length === 0) {
        this.$Message.warning('没有选择上传文件！');
        return;
      }
      try {
        const formData = new FormData();
        this.uploadFile.forEach((file) => {
          formData.append('file', file);
        });
        formData.append('cover', cover);
        await this.importApi(formData);
        this.$emit('upload-success');
      } catch(error) {
        this.$Message.warning({
          content: error,
          duration: 3
        });
      }
      this.remove();
    },
    remove() {
      this.uploadFile = [];
    },
  },
}
</script>
