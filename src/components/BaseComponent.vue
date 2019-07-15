<script>
export default {
  name: "BaseComponent",
  props: {
    tagName: {
      type: String,
      default: 'Input',
    },
    value: {
      default: '',
    },
    props: {
      type: Object,
      default: () => ({}),
    }
  },
  render(h) {
    const { tagName, value, props } = this;
    return h(
      tagName,
      {
        props: {
          ...props,
          value,
        },
        on: {
          input: (e) => this.$emit('input', e),
        },
      },
      this.$slots.default,
    );
  }
};
</script>
