import { warn } from 'core/util/index'

export * from './attrs'
export * from './class'
export * from './element'

/**
 * Query an element selector if it's not an element already.
 */
export function query(el: string | Element): Element {
  if (typeof el === 'string') {
    const selected = document.querySelector(el) // 获取el元素
    if (!selected) { // 如果不存在el元素，就提示错误，并返回一个div元素
      __DEV__ && warn('Cannot find element: ' + el)
      return document.createElement('div')
    }
    return selected // 返回el
  } else {
    return el
  }
}
