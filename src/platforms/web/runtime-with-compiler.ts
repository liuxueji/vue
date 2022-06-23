import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import {
  shouldDecodeNewlines,
  shouldDecodeNewlinesForHref
} from './util/compat'
import type { Component } from 'types/component'
import type { GlobalAPI } from 'types/global-api'

const idToTemplate = cached(id => {
  const el = query(id) // 获取el元素
  return el && el.innerHTML // 拿到el中的innerHTML
})

const mount = Vue.prototype.$mount // 获取mount
Vue.prototype.$mount = function ( // 重写mount方法
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el) // 获取el元素

  /* istanbul ignore if */ // 挂载：通过新生成的dom，替换旧的dom
  if (el === document.body || el === document.documentElement) { // 判断el是否挂载到body或html
    __DEV__ &&
      warn(
         // 不要挂载Vue到<html>或<body> -要挂载到正常的元素
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {// 如果options中没有render，执行下面代码，如果有，用用户的
    let template = options.template // 取出对象中template
    if (template) { // 判断render是否有模板
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') { // 如果是 {template:'#template'} 这种形式的，就调用idToTemplate
          template = idToTemplate(template) // 拿到template中的innerHTML，作为新的模板
          /* istanbul ignore if */
          if (__DEV__ && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          } // 报错信息暂时不看
        }
      } else if (template.nodeType) { // 如果给的模板是一个nodeType（dom元素）， 补充：nodeType 属性可用来区分不同类型的节点，比如 元素, 文本 和 注释。在vue模板解析也遇到过
        template = template.innerHTML // 拿到模板中的innerHTML
      } else {
        if (__DEV__) {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) { // 如果没有模板则使用el对应的template
      // @ts-expect-error
      template = getOuterHTML(el)
    }
    if (template) { // 如果有模板，直接变成render函数
      /* istanbul ignore if */
      if (__DEV__ && config.performance && mark) {
        mark('compile')
      }
      // 解构为render函数，并且放到options.render中
      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: __DEV__,
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (__DEV__ && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating) // 调用了挂载
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
// 获取外部的HTML，但是火狐浏览器不认外部HTML，通过获取到div，并且拷贝一份，appendChild到容器中，在拿它里面的innerHTML
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue as GlobalAPI
