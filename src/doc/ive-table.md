# ive-table change-list
记录ive-table的变更记录

## 2019/9
### 1. 2019/9/11 fix: 修复翻页后（比如翻到第2页）再查询页码未重置为1的问题
改动前
```
async getList(queryParams) {
  if (queryParams && queryParams instanceof Object) {
    this.queryParams = { ...queryParams };
  } else {
    queryParams = { ...this.queryParams };
  }

  try {
    ...
```
改动后
```
async getList(queryParams, pageIndex) {
  if (queryParams && queryParams instanceof Object) {
    this.queryParams = { ...queryParams };
  } else {
    queryParams = { ...this.queryParams };
  }
  if (pageIndex) {
    this.pager.pageIndex = pageIndex;
  }

  try {
    ...
```