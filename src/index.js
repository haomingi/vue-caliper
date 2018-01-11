/**
 * Created by 001758 on 2018/1/9.
 */
import vueCaliper from './vue-caliper.vue'

/* istanbul ignore next */
vueCaliper.install = function (Vue) {
  Vue.component(vueCaliper.name, vueCaliper)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueCaliper)
}
export default vueCaliper
