import React from 'react'
import PropTypes from 'prop-types'

const proxyMethods = [
  'getOffset',
  'getScroll',
  'setScroll',
  'getViewportSize',
  'getScrollSize',
  'getStartAndEnd',
  'getItemSizeAndItemsPerRow',
  'getSpaceBefore',
  'getSizeOf',
  'scrollTo',
  'scrollAround',
  'getVisibleRange'
]

function requestPage (call, page, cb) {
  const promise = call(page, cb)
  if (promise && promise.then) {
    promise
      .then((res) => cb(null, res))
      .then(null, cb)
  }
}

/**
 * Like `.slice`, but doesn't care about array bounds.
 *
 * [0, 1].slice(1, 3) === [1]
 * eagerSlice([0, 1], 1, 3) === [1, undefined, undefined]
 */
function eagerSlice (list, start, end) {
  const sliced = []
  for (let i = start; i < end; i++) {
    sliced.push(list[i])
  }
  return sliced
}

/**
 * Adds simple lazy loading to react-list.
 */
class LazyList extends React.Component {
  constructor (props) {
    super(props)

    this._list = null
    this._loadingPages = {}
    this.updateFrame = this.updateFrame.bind(this)
  }

  componentDidMount () {
    this.updateScrollParent()
    this.updateFrame()
  }

  componentDidUpdate () {
    this.updateScrollParent()
    this.updateFrame()
  }

  updateScrollParent () {
    const prev = this.scrollParent
    const list = this.getList()
    this.scrollParent = list.scrollParent

    if (prev === this.scrollParent) {
      return
    }
    if (prev) {
      prev.removeEventListener('scroll', this.updateFrame)
    }
    if (this.props.onRequestPage) {
      this.scrollParent.addEventListener('scroll', this.updateFrame)
    }
  }

  getList () {
    return this._list
  }

  isLoadingPage (page) {
    return !!this._loadingPages[page]
  }

  itemNeedsLoad (idx) {
    const { items, pageSize } = this.props
    const page = Math.floor(idx / pageSize)
    return items[idx] != null || this.isLoadingPage(page)
  }

  updateFrame () {
    const {
      pageSize, loadMargin,
      items, length,
      onRequestPage
    } = this.props

    // Item range that should be loaded right about now.
    let [topItem, bottomItem] = this.getVisibleRange()

    if (topItem === undefined || bottomItem === undefined) {
      return
    }

    topItem = Math.max(topItem - loadMargin, 0)
    bottomItem = Math.min(bottomItem + loadMargin, length)

    const almostVisibleItems = eagerSlice(items, topItem, bottomItem)

    const unloadedPages = almostVisibleItems.reduce((pages, item, idx) => {
      if (item == null) {
        const page = Math.floor((topItem + idx) / pageSize)
        if (!this.isLoadingPage(page) && pages.indexOf(page) === -1) {
          return [...pages, page]
        }
      }
      return pages
    }, [])

    unloadedPages.forEach((page) => {
      this._loadingPages[page] = true
      requestPage(onRequestPage, page, () => {
        // Always delete after completion. If there was an error, we can retry
        // later. If there wasn't, we don't need to keep this around :)
        delete this._loadingPages[page]
      })
    })
  }

  render () {
    return React.cloneElement(this.props.children, {
      ref: (list) => {
        this._list = list
      }
    })
  }
}

if (process.env.NODE_ENV !== 'production') {
  LazyList.propTypes = {
    /**
     * Total amount of items, on all pages.
     */
    length: PropTypes.number.isRequired,
    /**
     * Items per page.
     */
    pageSize: PropTypes.number,
    /**
     * When to begin loading the next page.
     */
    loadMargin: PropTypes.number,
    /**
     * Loaded items. NULLs in this array indicate unloaded items.
     */
    items: PropTypes.array,

    /**
     * Callback to begin loading a page.
     */
    onRequestPage: PropTypes.func.isRequired
  }
}

LazyList.defaultProps = {
  pageSize: 25,
  loadMargin: 5
}

proxyMethods.forEach((name) => {
  LazyList.prototype[name] = function (...args) {
    return this.getList()[name](...args)
  }
})

export default LazyList
