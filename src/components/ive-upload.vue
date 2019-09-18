<template>
  <div class="ive-upload">
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
      <span class="fileUrl" :title="fileUrl">{{ fileUrl }}</span>
      <Button
        v-if="uploadByManual"
        icon="ios-cloud-upload-outline"
        @click="handleUpload">
        点击上传
      </Button>
    </Row>
    <ul v-if="uploadByManual && fileList.length" class="ivu-upload-list manual-upload-list">
      <li v-for="(file, index) in fileList" :key="file.name + index" class="ivu-upload-list-file">
        <span>
          <i class="ivu-icon ivu-icon-md-document"></i>
          {{ file.name }}
        </span>
        <i
          class="ivu-icon ivu-icon-ios-close ivu-upload-list-remove"
          @click="handleRemove(index)">
        </i>
      </li>
    </ul>
  </div>
</template>
<script>
// import _ from "lodash";

export default {
  name: 'ive-upload',
  props: {
    value: undefined,
    action: {
      type: String,
      required: true,
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
      default: 'image/jpg, image/png, image/jpeg',
    },
    format: {
      type: Array,
      default: () => ['jpg', 'png', 'jpeg'],
    },
    'max-size': {
      type: Number,
    },
    'upload-by-manual': {
      type: Boolean,
      default: false,
    },
    // 分辨率
    resolutionRatio: {
      type: Object,
      default: () => ({}),
      validator(val) {
        let result = true;
        if (val) {
          const { width, height } = val;
          const widthType = typeof width;
          const heightType = typeof height;
          if (
            widthType === 'object'
            && width.toString() === '[object Object]'
          ) {
            const { max: maxWidth, min: minWidth } = width;
            result = [maxWidth, minWidth].every(
              value => value === undefined || typeof value === 'number',
            );
          } else if (width && widthType !== 'number') {
            result = false;
          }
          if (
            heightType === 'object'
            && height.toString() === '[object Object]'
          ) {
            const { max: maxHeight, min: minHeight } = height;
            result = [maxHeight, minHeight].every(
              value => value === undefined || typeof value === 'number',
            );
          } else if (height && heightType !== 'number') {
            result = false;
          }
        }
        return result;
      },
    },
  },
  data() {
    return {
      fileList: [],
      uploadedList: [],
      uploadedResultList: [],
      fileUrl: '',
    };
  },
  watch: {
    value(value) {
      this.fileUrl = value;
    },
  },
  methods: {
    checkFormat(file) {
      let checked = true;
      if (this.format && this.format.length) {
        const fileFormat = file.name
          .split('.')
          .pop()
          .toLocaleLowerCase();
        checked = this.format.some(
          item => item.toLocaleLowerCase() === fileFormat,
        );
        if (!checked) {
          this.$Message.error(`请选择后缀为${this.format.toString()}的文件`);
        }
      }
      return checked;
    },
    checkResolutionRatio(file) {
      let result = '';
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const image = new Image();
        image.onload = () => {
          const imgWidth = image.width;
          const imgHeight = image.height;
          const { width, height } = this.resolutionRatio;
          if (typeof width === 'number' && imgWidth !== width) {
            result = `图片宽度需等于${width}`;
          } else if (
            typeof width === 'object'
            && width.toString() === '[object Object]'
          ) {
            const { max, min } = width;
            if (typeof max === 'number' && imgWidth > max) {
              result = `图片最大宽度为${max}`;
            } else if (typeof min === 'number' && imgWidth < min) {
              result = `图片最小宽度为${min}`;
            }
          }
          if (!result) {
            if (typeof height === 'number' && imgHeight !== height) {
              result = `图片高度需等于${height}`;
            } else if (
              typeof height === 'object'
              && height.toString() === '[object Object]'
            ) {
              const { max, min } = height;
              if (typeof max === 'number' && imgHeight > max) {
                result = `图片最大高度为${max}`;
              } else if (typeof min === 'number' && imgHeight < min) {
                result = `图片最小高度为${min}`;
              }
            }
          }
          if (!result) {
            this.$refs.upload.post(file);
          } else {
            this.$Message.warning(result);
            this.$emit('resolution-ratio-error', result);
          }
        };
        image.src = data;
      };
      reader.readAsDataURL(file);
    },
    pickFile(file) {
      if (this.uploadByManual) {
        this.fileList.push(file);
      } else if (this.checkFormat(file)) {
        if (this.resolutionRatio) {
          this.checkResolutionRatio(file);
        } else {
          this.$refs.upload.post(file);
        }
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
    handleRemoveUploadedFile() {
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
    handleSuccess(result) {
      this.fileUrl = result;
      this.$emit("input", result);
      this.$emit("on-success", result);
    },
    handleExceededSize($event) {
      this.$Message.warning('图片尺寸超出限制');
      this.$emit('on-exceeded-size', $event);
    },
  },
};
</script>
