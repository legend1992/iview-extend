import { expect } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import VueRouter from 'vue-router';
import '../utils';
import iveBreadCrumb from '../../src/components/ive-bread-crumb.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
const routes = [
  {
    path: '/foo',
    component: { template: '<div>foo</div>' },
    children: [{
      path: 'child',
      meta: { title: 'child' },
      component: { template: '<div>foo-child</div>' },
    }],
  },
];
const router = new VueRouter({
  routes,
});

describe('ive-bread-crumb.vue', () => {
  it('renders the correct markup', () => {
    const wrapper = mount(iveBreadCrumb, {
      localVue,
      router,
    });
    expect(wrapper.classes()).to.be.an('array').that.include.members(['ive-bread-crumb', 'ivu-breadcrumb']);
    wrapper.vm.$router.push('foo');
    expect(wrapper.find('.ivu-breadcrumb-item-link').text()).to.equal('/foo');
  });
  it('check computed: titleList', () => {
    const wrapper = mount(iveBreadCrumb, {
      localVue,
      router,
    });
    const { $router } = wrapper.vm;
    $router.push('/');
    expect(wrapper.vm.titleList.length).to.equal(0);
    $router.push('foo');
    expect(wrapper.vm.titleList.length).to.equal(1);
    $router.push('foo/child');
    expect(wrapper.vm.titleList.length).to.equal(2);
    expect(wrapper.findAll('.ivu-breadcrumb-item-link').at(1).text()).to.equal('child');
  });
});
