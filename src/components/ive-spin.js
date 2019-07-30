export default {
  name: 'ive-spin',
  functional: true,
  render(h) {
    return h(
      'span',
      {},
      [
        h(
          'Spin',
          {
            class: 'ive-spin',
            props: {
              size: 'large',
            },
          },
        )
      ]
    )
  }
};
