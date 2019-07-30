<template>
  <div>
    <Row type="flex" justify="space-between">
      <Upload
        ref="upload"
        :before-upload="pickFile"
        :action="action"
        :multiple="multiple"
        :data="data"
        :name="name"
        :accept="accept"
        :max-size="maxSize"
        @on-error="handleError"
        @on-progress="handleProgress"
        @on-success="handleSuccess"
        @on-exceeded-size="handleExceededSize"
      >
        <Button icon="md-add">选择文件</Button>
      </Upload>
      <Button v-if="uploadByManual" icon="ios-cloud-upload-outline" @click="handleUpload">点击上传</Button>
    </Row>
    <ul v-if="uploadByManual && fileList.length" class="ivu-upload-list manual-upload-list">
      <li v-for="(file, index) in fileList" :key="file.name + index" class="ivu-upload-list-file">
        <span><i class="ivu-icon ivu-icon-md-document"></i>{{ file.name }}</span>
        <i class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove" @click="handleRemove(index)"></i>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'ive-upload',
  props: {
    action: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    name: {
      type: String,
      default: 'file',
    },
    accept: {
      type: String,
      default: '',
    },
    'max-size': {
      type: Number,
    },
    'upload-by-manual': {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    pickFile (file) {
      if (this.uploadByManual) {
        this.fileList.push(file);
      } else {
        this.$refs.upload.post(file);
      }
      return false;
    },
    handleRemove(index) {
      this.fileList.splice(index, 1);
    },
    handleUpload() {
      this.$emit('on-upload', this.fileList);
    },
    handleError($event) {
      this.$emit('on-error', $event);
    },
    handleProgress($event) {
      this.$emit('on-progress', $event);
    },
    handleSuccess($event) {
      this.$emit('on-success', $event);
    },
    handleExceededSize($event) {
      this.$emit('on-exceeded-size', $event);
    },
  },
};
</script>
