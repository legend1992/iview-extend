import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import '../utils';
import iveTimeline from '../../src/components/ive-timeline.vue';

describe('ive-timeline.vue', () => {
  let wrapper;
  const items = [
    {
      text: 111, status: 0, updatedBy: 'local', create_time: '2019-10-10 18:00:00',
    },
    {
      text: 222, status: 1, updatedBy: 'local', create_time: '2019-10-10 18:00:01',
    },
    {
      text: 333, status: 2, updatedBy: 'local', create_time: '2019-10-10 18:00:02',
    },
    {
      text: 444, status: 3, updatedBy: 'local', create_time: '2019-10-10 18:00:03',
    },
  ];
  beforeEach(() => {
    wrapper = mount(iveTimeline, {
      propsData: {
        items,
      },
    });
  });
  afterEach(() => {
    wrapper = null;
  });
  it('renders the correct markup', () => {
    expect(wrapper.classes()).to.eql(['ive-timeline', 'ivu-timeline']);
    const timelineItems = wrapper.findAll('li.ivu-timeline-item');
    expect(timelineItems.length).to.equal(4);
    items.forEach((item, index) => {
      // color
      const color = wrapper.vm.colorMap[item.status];
      expect(timelineItems.at(index).props('color')).to.equal(color);
      // text
      const text = timelineItems.at(index).find('.ivu-timeline-item-content').text();
      expect(text).to.equal(`${item.text}`);
    });
  });
  it('check slots', () => {
    wrapper = mount(iveTimeline, {
      propsData: {
        items,
      },
      scopedSlots: {
        itemSlot: `<div class="slot-wrapper" slot-scope="item">
          <h2>{{ item.status }}</h2>
          <span>
            {{ item.updatedBy }}更新于{{ item.create_time }}
          </span>
        </div>`,
      },
    });
    const timelineItems = wrapper.findAll('li.ivu-timeline-item');
    expect(timelineItems.length).to.equal(4);
    items.forEach((item, index) => {
      expect(timelineItems.at(index).find('.slot-wrapper').exists()).to.equal(true);
      // text
      const h2text = timelineItems.at(index).find('.slot-wrapper h2').text();
      const spantext = timelineItems.at(index).find('.slot-wrapper span').text();
      expect(h2text).to.equal(`${item.status}`);
      expect(spantext).to.equal(`${item.updatedBy}更新于${item.create_time}`);
    });
  });
});
