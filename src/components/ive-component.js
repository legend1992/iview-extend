export default {
  name: "ive-component",
  props: {
    tagName: {
      type: String,
      default: 'Input',
    },
    value: undefined,
    props: {
      type: Object,
      default: () => ({}),
    }
  },
  render(h) {
    const {
      tagName,
      value,
      props,
      $slots: {
        default: defaultSlots,
      },
    } = this;
    const renderSlots = () => {
      let slots = [];
      if (defaultSlots && defaultSlots.length) {
        defaultSlots.forEach((defaultSlot) => {
          const {
            tag,
            text,
            children,
            data: {
              slot: slotName,
            },
          } = defaultSlot;
          if (children || text) {
            slots.push(
              h(
                tag,
                {
                  slot: slotName,
                },
                children || text,
              )
            );
          }
        });
      }
      return slots;
    };
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
      renderSlots(),
    );
  }
};
