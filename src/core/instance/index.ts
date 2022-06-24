import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'

// Vue的构造函数
function Vue(options) {
  this._init(options)
}

// Vue.prototype._init
initMixin(Vue)
// Vue.prototype.$set  Vue.prototype.$delete  Vue.prototype.$watch
stateMixin(Vue)
// Vue.prototype.$on  Vue.prototype.$once  Vue.prototype.$off  Vue.prototype.$emit
eventsMixin(Vue)
// Vue.prototype._update  Vue.prototype.$forceUpdate  Vue.prototype.$destroy
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue as unknown as GlobalAPI
