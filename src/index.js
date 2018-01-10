/**
 * Created by 001758 on 2018/1/9.
 */
import vueCaliper from './vue-caliper.vue'

const MyPlugin = {
  install (vue, options) {
    vue.component(vueCaliper.name, vueCaliper)
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MyPlugin)
}
export default MyPlugin
