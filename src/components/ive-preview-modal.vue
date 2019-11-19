<template>
  <Modal class="album-modal" :value="value" @input="$emit('input', $event); selectedIndex=0" fullscreen footer-hide>
    <div v-if="fileList.length" class="content-wrapper">
      <h3 class="title">
        <span class="rotate-wrapper">
          <Icon type="ios-sync" title="旋转" @click="rotateImg()"/>
        </span>
      </h3>
      <div class="preview-wrapper">
        <Icon type="md-arrow-round-back" @click="prevPic()"/>
        <div class="img-wrapper">
          <img ref="bigImg"
            :src="fileList[selectedIndex].src"
            @mousewheel="imgScale($event)"
            @load="imgLoad()"
            @error="imgLoad()"
            v-drag
          />
        </div>
        <Icon type="md-arrow-round-forward" @click="nextPic()"/>
      </div>
      <div id="imgList-wrapper">
        <Icon type="ios-arrow-dropleft" v-if="ulWidth > outerWidth" @click="movePicToRight()" />
        <div class="inner-wrapper">
          <ul :style="ulStyle">
            <li v-for="(img, i) of fileList" :key="img.src + i" :class="{'active':selectedIndex===i}" @click="selectPic(i)">
              <span class="number">{{ i+1 }}</span>
              <img v-if="showPicNumber>i" :src="img.smsrc" :alt="img.title" @error="imgReLoad(i)"/>
            </li>
          </ul>
        </div>
        <Icon type="ios-arrow-dropright" v-if="ulWidth > outerWidth" @click="movePicToLeft()"/>
      </div>
    </div>
  </Modal>
</template>
<script>
export default {
  name: "ive-preview-modal",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => []
    },
    selectedIdx: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      imgWrapperLeft: 0,
      showPicNumber: 20,
      movePicNumbers: 5,
      outerWidth: document.documentElement.clientWidth - 60,
      selectedIndex: 0,
    };
  },
  watch: {
    selectedIdx(value) {
      this.selectedIndex = value;
    },
  },
  computed: {
    imgWrapperMoveDistance() {
      return this.movePicNumbers * 90;
    },
    ulWidth() {
      return this.fileList.length * 90 - 10;
    },
    ulStyle() {
      return {
        'width': this.ulWidth + 'px',
        'left': this.imgWrapperLeft + 'px'
      };
    },
  },
  methods: {
    imgLoad(){
      this.fileList[this.selectedIndex].loading = true;
    },
    imgReLoad(i){
      if(this.fileList[i].smsrc === this.fileList[i].src){
        return;
      }
      this.fileList[i].smsrc = this.fileList[i].src;
    },
    getOuterWidth() {
      if(this.fileList.length){
        this.$nextTick(()=> {
          this.outerWidth = this.$el.querySelector('#imgList-wrapper>div.inner-wrapper').clientWidth - 20;
          this.showPicNumber = Math.ceil(this.outerWidth / 90);
        })
      }
    },
    windowResize() {
      this.getOuterWidth();
      window.onresize = ()=> {
        this.getOuterWidth();
        this.resetImg();
      }
    },
    //移动向左
    movePicToLeft() {
      let maxDistance = this.ulWidth - this.outerWidth + this.imgWrapperLeft;
      let distance = maxDistance > this.imgWrapperMoveDistance
          ? this.imgWrapperMoveDistance
          : maxDistance;
      this.imgWrapperLeft -= distance;
      this.showSmallPic();
    },
    //移动向右
    movePicToRight() {
      let maxDistance = Math.abs(this.imgWrapperLeft);
      let distance = maxDistance > this.imgWrapperMoveDistance
          ? this.imgWrapperMoveDistance
          : maxDistance;
      this.imgWrapperLeft += distance;
    },
    showSmallPic() {
      let newNumber = Math.ceil((this.outerWidth - this.imgWrapperLeft) / 90);
      this.showPicNumber = this.showPicNumber > newNumber ? this.showPicNumber : newNumber;
    },
    //切换图片
    selectPic(index) {
      if (this.selectedIndex === index) {
        return;
      }
      this.selectedIndex = index;
      this.resetImg();
      this.selectPicAndMoveWrapper();
    },
    //上一张图片
    prevPic() {
      if (this.selectedIndex === 0) {
        this.selectedIndex = this.fileList.length - 1;
      } else {
        this.selectedIndex--;
      }
      this.resetImg();
      this.selectPicAndMoveWrapper();
    },
    //下一张图片
    nextPic() {
      if (this.selectedIndex === this.fileList.length - 1) {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex++;
      }
      this.resetImg();
      this.selectPicAndMoveWrapper();
    },
    selectPicAndMoveWrapper() {
      if (this.outerWidth === 0) {
        this.getOuterWidth();
      }
      setTimeout(() => {
        let activePic = this.$el.querySelector("#imgList-wrapper li.active");
        let activePicLeft = activePic.offsetLeft;
        let activePicWidth = activePic.clientWidth;
        if (activePicLeft < Math.abs(this.imgWrapperLeft)) {
          this.imgWrapperLeft = -activePicLeft + 10;
        } else if (
          activePicLeft + activePicWidth >
          this.outerWidth - this.imgWrapperLeft
        ) {
          this.imgWrapperLeft -=
            activePicLeft +
            activePicWidth -
            (this.outerWidth - this.imgWrapperLeft) +
            10;
        }
        this.showSmallPic();
      });
    },
    //旋转图片
    rotateImg(deg) {
      if (deg !== undefined) {
        this.deg = deg;
      } else {
        this.deg += 90;
      }
      this.$refs.bigImg.style.transform = "translate3d(-50%, -50%, 0) rotateZ(" + this.deg + "deg)";
    },
    //缩放图片
    imgScale({ wheelDelta }) {
      const bigImgRef = this.$refs.bigImg;
      let scale = wheelDelta > 0 ? 1.2 : 1 / 1.2;
      let width = bigImgRef.clientWidth * scale;
      let height = bigImgRef.clientHeight * scale;
      if ((width < 300 || height < 200) && wheelDelta < 0) {
        return;
      }
      Object.assign(bigImgRef.style, {
        maxWidth: 'unset',
        maxHeight: 'unset',
        width: `${width}px`,
        height: `${height}px`,
      });
    },
    //重置图片
    resetImg() {
      //取消旋转
      this.rotateImg(0);
      //尺寸复原
      const bigImgRef = this.$refs.bigImg;
      Object.assign(bigImgRef.style, {
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        top: '50%',
        left: '50%',
      });
    }
  },
  mounted() {
    this.windowResize();
  },
  directives: {
    drag(el) {
      el.onmousedown = (e) => {
        const disx = e.pageX - el.offsetLeft;
        const disy = e.pageY - el.offsetTop;
        document.onmousemove = (e2) => {
          el.style.left = `${e2.pageX - disx}px`;
          el.style.top = `${e2.pageY - disy}px`;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    },
  },
};
</script>
