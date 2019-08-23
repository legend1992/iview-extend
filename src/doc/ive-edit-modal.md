# ive-edit-modal change-list
记录ive-edit-modal的变更记录

## 2019/8
### 1. 2019/8/23 refactor: 完善submit事件的处理
改动前
```
handleSubmit() {
  if (this.editApi) {
    const reqData = this.$refs.baseForm.getData();
    if (reqData) {
      this.submit(this.setReqData(reqData));
    }
  } else {
    this.$emit('close');
  }
}
```
改动后
```
handleSubmit() {
  const reqData = this.$refs.baseForm.getData();
  if (reqData) {
    if (this.editApi) {
      this.submit(this.setReqData(reqData));
    } else {
      this.$emit('submit', reqData);
    }
  }
}
```