<template>
  <div class="ive-upload">
    <Row type="flex">
      <Upload
        ref="upload"
        :before-upload="pickFile"
        :action="action"
        :data="data"
        :name="name"
        :accept="accept"
        :max-size="maxSize"
        :multiple="multiple"
        :show-upload-list="false"
        :on-error="handleError"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-exceeded-size="handleExceededSize"
      >
        <Button icon="md-add" :loading="loading">选择文件</Button>
      </Upload>
      <ul v-if="fileList.length && isImg" class="imgList">
        <li v-for="(item, index) in fileList" :key="item">
          <img :src="item" :alt="item || `图片${index}`">
          <div class="cover">
            <i class="ivu-icon ivu-icon-ios-eye-outline" @click="preview(index)"></i>
            <i class="ivu-icon ivu-icon-ios-trash-outline" @click="remove(index)"></i>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li v-for="item in fileList" :key="item">{{item}}</li>
      </ul>
    </Row>
    <ive-preview-modal v-model="previewModal" @input="selectedIdx = 0" :selectedIdx="selectedIdx" :fileList="previewFileList" />
  </div>
</template>
<script>
export default {
  name: 'ive-upload',
  props: {
    value: undefined,
    action: {
      type: String,
      default: '',
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
    maxSize: {
      type: Number,
    },
    // 分辨率
    resolutionRatio: {
      type: Object,
      default: null,
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
    multiple: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      loading: false,
      fileList: [],
      previewModal: false,
      selectedIdx: -1,
      totalPicked: 0,
    };
  },
  computed: {
    isImg() {
      return this.format.join() === ['jpg', 'png', 'jpeg'].join();
    },
    previewFileList() {
      return this.fileList.map((item) => ({
        src: item,
        smsrc: item,
      }));
    },
  },
  watch: {
    value(value) {
      this.formatImgList(value);
    },
    'fileList.length': function (e) {
      this.totalPicked = e;
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
          this.$emit('format-error', fileFormat, this.format);
        }
      }
      return checked;
    },
    checkResolutionRatio(file) {
      return new Promise((resolve) => {
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
            } else if (typeof width === 'object' && width.toString() === '[object Object]') {
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
              } else if (typeof height === 'object' && height.toString() === '[object Object]') {
                const { max, min } = height;
                if (typeof max === 'number' && imgHeight > max) {
                  result = `图片最大高度为${max}`;
                } else if (typeof min === 'number' && imgHeight < min) {
                  result = `图片最小高度为${min}`;
                }
              }
            }
            resolve(result);
          };
          image.onerror = (err) => {
            resolve(err);
          };
          image.src = data;
        };
        reader.readAsDataURL(file);
      });
    },
    pickFile(file) {
      (async () => {
        if (this.checkFormat(file)) {
          if (this.resolutionRatio) {
            const result = await this.checkResolutionRatio(file);
            if (!result) {
              this.upload(file);
            } else {
              this.$Message.warning(result);
              this.$emit('resolution-ratio-error', result);
            }
          } else {
            this.upload(file);
          }
        }
      })();
      return false;
    },
    upload(file) {
      this.totalPicked++;
      if (this.totalPicked > this.limit) {
        this.$Message.warning(`最多可上传${this.limit}份文件`);
        this.$emit('on-exceeded-limit', this.limit);
        return;
      }
      this.loading = true;
      this.$refs.upload.post(file);
    },
    handleError($event) {
      this.loading = false;
      this.$emit('on-error', $event);
    },
    handleProgress($event) {
      this.$emit('on-progress', $event);
    },
    handleSuccess(result) {
      this.loading = false;
      let value = result;
      if (this.multiple) {
        if (Array.isArray(result)) {
          this.fileList = this.fileList.concat(result);
        } else {
          this.fileList.push(result);
        }
        this.fileList = Array.from(new Set(this.fileList));
        value = this.fileList;
      } else {
        this.fileList = [result];
      }
      this.$emit('input', value);
      this.$emit('on-success', value);
    },
    formatSize() {
      let { maxSize } = this;
      if (maxSize < 1024) {
        maxSize = `${maxSize} KB`;
      } else {
        maxSize = `${(maxSize / 1024).toFixed(2)} MB`;
      }
      return maxSize;
    },
    handleExceededSize($event) {
      this.loading = false;
      const maxSize = this.formatSize();
      this.$Message.warning(`文件大小限制在 ${maxSize} 以内`);
      this.$emit('on-exceeded-size', $event);
    },
    formatImgList(value) {
      if (Array.isArray(value)) {
        if (this.multiple) {
          this.fileList = value;
        } else {
          this.fileList = value[0] ? [value[0]] : [];
        }
      } else if (value) {
        this.fileList = [value];
      } else {
        this.fileList = [];
      }
      this.totalPicked = this.fileList.length;
    },
    remove(index) {
      this.fileList.splice(index, 1);
      let value = this.fileList.length ? this.fileList : '';
      this.totalPicked = this.fileList.length;
      this.$emit('input', value);
    },
    preview(index) {
      this.previewModal = true;
      this.selectedIdx = index;
    },
  },
  created() {
    this.formatImgList(this.value);
  },
};
</script>
