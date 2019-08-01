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
        :show-upload-list="false"
        :on-error="handleError"
        :on-remove="handleRemoveUploadedFile"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-exceeded-size="handleExceededSize"
      >
        <Button icon="md-add">选择文件</Button>
      </Upload>
      <span class="fileUrl">{{ fileUrl }}</span>
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
import _ from "lodash";
export default {
  name: 'ive-upload',
  props: {
    action: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
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
      uploadedList: [],
      uploadedResultList: [],
      fileUrl: '',
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
    // handleRemoveUploadedFile(file, fileList) {
    //   const fileIndex = this.uploadedList.findIndex((item) => item === file);
    //   this.uploadedList.splice(fileIndex, 1);
    //   this.uploadedResultList.splice(fileIndex, 1);
    //   const value = this.uploadedResultList.length ? _.cloneDeep(this.uploadedResultList) : null;
    //   this.$emit('input', value);
    // },
    handleRemoveUploadedFile(file, fileList) {
      this.$emit('input', null);
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
    // handleSuccess(result, file, fileList) {
    //   this.uploadedResultList.push(result);
    //   this.uploadedList = [...fileList];
    //   this.$emit('input', _.cloneDeep(this.uploadedResultList));
    //   this.$emit('on-success', result);
    // },
    handleSuccess(result, file, fileList) {
      this.fileUrl = result;
      this.$emit('input', result);
      this.$emit('on-success', result);
    },
    handleExceededSize($event) {
      this.$emit('on-exceeded-size', $event);
    },
  },
};
</script>
