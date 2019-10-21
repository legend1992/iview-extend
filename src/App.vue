<template>
  <div class="ui-list">
    <ive-radio v-model="selected" :options="options" type="button" @input="input" />

    <p @contextmenu.prevent="$refs.menu.open($event, { a: 1 })">
      Right click on me
    </p>
    <p @contextmenu.prevent="$refs.menu.open($event, { b: 2, c: 3 }, menuOptions2)">
      Right click on me
    </p>
    <ive-contextmenu ref="menu" :options="menuOptions" @click="menuClick" />
    <ive-editor v-model="editorValue"/>
    <ive-timeline :items="timelineItems" >
      <template slot="itemSlot" slot-scope="item">
        <h2>{{ item.status }}</h2>
        <span>
          {{ item.updatedBy }}更新于{{ item.create_time }}
        </span>
      </template>
    </ive-timeline>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: '',
      options: ['全部', '草稿', '待审核', '已发布', '已驳回'],
      menuOptions: [
        {
          name: '1',
          onClick(...args) {
            console.log(...args);
          },
        },
      ],
      menuOptions2: [
        {
          name: '2',
        },
        {
          name: '3',
        },
      ],
      editorValue: '',
      timelineItems: [
        { text: 111, status: 0, updatedBy: 'local', create_time: '2019-10-10 18:00:00' },
        { text: 222, status: 1, updatedBy: 'local', create_time: '2019-10-10 18:00:01' },
        { text: 333, status: 2, updatedBy: 'local', create_time: '2019-10-10 18:00:02' },
        { text: 444, status: 3, updatedBy: 'local', create_time: '2019-10-10 18:00:03' },
      ],
    };
  },
  watch: {
    editorValue(e) {
      console.log(e);
    },
  },
  methods: {
    input(e) {
      console.log(e);
    },
    onCtxOpen(locals) {
      console.log(locals);
      this.menuData = locals;
    },
    menuClick(...parameters) {
      console.log(...parameters);
    },
  },
};
</script>

<style>
@import "styles/iview-extends2.css";
.ui-list {
  margin-left: 1em;
}
h2 + * {
  margin-left: 2em !important;
  margin-bottom: 1em;
}
</style>
