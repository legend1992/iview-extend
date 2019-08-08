<template>
  <Modal
    title="导入详情"
    :value="importModal"
    @input="$emit('close')"
  >

  <Upload
      multiple
      width=240
      ref="upload"
      action=""
      accept='application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      :format="format"
      :show-upload-list="false"
      :before-upload="handleUpload"
    >
      <Button icon="ios-cloud-upload-outline">选择导入文件</Button>
    </Upload>
    <div v-if="uploadFile.length !== 0">上传文件: {{ uploadFile[0].name }}
      <Button type="text" size="small" @click.stop="remove" >x</Button>
    </div>
    <div slot="footer" >
      <Button type="primary" @click="upload('yes')">覆盖导入：相同的字段直接覆盖</Button>
      <Button type="primary" @click="upload('no')">跳过导入：相同的字段不导入</Button>
    </div>
    
  </Modal>
</template>

<script>
export default {
  nmae: 'ive-import-data',
  data() {
    return {
      file: [],
      uploadFile: [],
      format: ['xls','xlsx'],
    }
  },
  props: {
    importModal: {
      type: Boolean,
      default: false,
    },
    importApi: {
      type: Function,
      required: true,
    },
  },
  methods: {
    handleUpload(file) {
      const keyID = Math.random().toString().substr(2);
      file.keyID = keyID;
      this.file.push(file);
      this.uploadFile.push(file);

      if (this.format.length) {
        const fileFormat = file.name.split('.').pop().toLocaleLowerCase();
        const checked = this.format.some(item => item.toLocaleLowerCase() === fileFormat);
        if (!checked) {
          this.$Notice.warning({
            title: '上传文件格式错误',
            desc: file.name + '的文件格式是不正确的,请选择xls和xlsx文件。'
          });
          this.remove();
        }
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
        this.remove();
        this.$emit('close');
      } catch(error) {
        this.$Message.warning({
          content: error,
          duration: 3
        });
        this.remove();
      }
     
    },
    remove() {
      this.uploadFile = [];
    },
  },
}
</script>
