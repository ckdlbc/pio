import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Pio, { trackEvent } from '../../src/index';

import { sync } from 'vuex-router-sync';

sync(store, router, { moduleName: 'router' });

// new Pio.Track('xxx', {
//   uid: () => store.getters.fullPath,
//   debug: true,
//   router
// })

Vue.use(Pio, {
  token: 'xxx',
  uid: () => store.getters.fullPath,
  debug: true,
  router
});

trackEvent('buy', { price: '￥123', id: 'xxxx-xxxx-xxxx' });
new Function();
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
