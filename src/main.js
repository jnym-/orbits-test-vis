import Vue from 'vue';
import App from './App.vue';
import ImpVis from '@impvis/components';
import '@impvis/components/dist/impvis-components.css';
import titleMixin from './mixins/titleMixin'

Vue.use(ImpVis);
Vue.mixin(titleMixin);
Vue.config.productionTip = false;
Vue.config.silent = true; //surpress vue warnings

//export const bus = new Vue();//bus for title bar to talk to guidance

new Vue({
  render: h => h(App),
}).$mount('#app');press