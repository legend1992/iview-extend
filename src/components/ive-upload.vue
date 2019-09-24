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
    </Row>
  </div>
</template>
<script>
export default {
  name: "ive-upload",
  props: {
    value: undefined,
    action: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: "file"
    },
    accept: {
      type: String,
      default: "image/jpg, image/png, image/jpeg",
    },
    format: {
      type: Array,
      default: () => ['jpg', 'png', 'jpeg'],
    },
    maxSize: {
      type: Number
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
          if (widthType === 'object' && width.toString() === '[object Object]') {
            const { max: maxWidth, min: minWidth } = width;
            result = [maxWidth, minWidth].every((value) => value === undefined || typeof value === 'number');
          } else if (width && widthType !== 'number') {
            result = false;
          }
          if (heightType === 'object' && height.toString() === '[object Object]') {
            const { max: maxHeight, min: minHeight } = height;
            result = [maxHeight, minHeight].every((value) => value === undefined || typeof value === 'number');
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
      fileUrl: ""
    };
  },
  watch: {
    value(value) {
      this.fileUrl = value;
    }
  },
  methods: {
    checkFormat(file) {
      let checked = true;
      if (this.format && this.format.length) {
        const fileFormat = file.name.split('.').pop().toLocaleLowerCase();
        checked = this.format.some(item => item.toLocaleLowerCase() === fileFormat);
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
          image.onerror = (e) => {
            resolve(e);
          };
          image.src = data;
        };
        reader.readAsDataURL(file);
      });
    },
    async pickFile(file) {
      if (this.checkFormat(file)) {
        if (this.resolutionRatio) {
          const result = await this.checkResolutionRatio(file);
          if (!result) {
            this.$refs.upload.post(file);
          } else {
            this.$Message.warning(result);
            this.$emit('resolution-ratio-error', result);
          }
        } else {
          this.$refs.upload.post(file);
        }
      }
      return false;
    },
    handleRemoveUploadedFile(file, fileList) {
      this.$emit("input", null);
    },
    handleError($event) {
      this.$emit("on-error", $event);
    },
    handleProgress($event) {
      this.$emit("on-progress", $event);
    },
    handleSuccess(result) {
      this.fileUrl = result;
      this.$emit("input", result);
      this.$emit("on-success", result);
    },
    handleExceededSize($event) {
      this.$Message.warning('图片尺寸超出限制');
      this.$emit("on-exceeded-size", $event);
    }
  },
  created() {
    this.fileUrl = this.value;
  },
};
</script>
