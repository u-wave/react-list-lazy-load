import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
// LazyList wraps around ReactList--so we need both!
import LazyList from 'react-list-lazy-load'
import ReactList from 'react-list'

const randBetween = (min, max) =>
  Math.floor(min + (Math.random() * (max - min)))

// Utility to create arrays with test data
const array = (len, val = () => null) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(val(i))
  }
  return arr
}

function mergePage (items, newItems, offset) {
  const merged = items.slice()
  newItems.forEach((item, idx) => {
    merged[idx + offset] = item
  })
  return merged
}

class App extends Component {
  static propTypes = {
    pageSize: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    minLoadTime: PropTypes.number.isRequired,
    maxLoadTime: PropTypes.number.isRequired
  }

  state = {
    items: array(25, (i) => `item #${i}`)
  }

  // Simulate a network request for `limit` items
  fetch (page, cb) {
    const { minLoadTime, maxLoadTime, pageSize } = this.props
    setTimeout(() => {
      // Generate a new page of items
      const data = array(pageSize, (i) => `item #${(page * pageSize) + i}`)

      cb(data)
    }, randBetween(minLoadTime, maxLoadTime))
  }

  handleRequestPage = (page, cb) => {
    const { pageSize } = this.props

    // Simulate a network request or other async operation
    this.fetch(page, (data) => {
      // Merge the new page into the current `items` collection and rerender
      this.setState({
        items: mergePage(this.state.items, data, page * pageSize)
      })

      // Tell LazyList that the page was loaded
      cb()
    })
  }

  render () {
    const { totalItems } = this.props
    const { items } = this.state
    return (
      <LazyList
        pageSize={this.props.pageSize}
        items={items}
        length={totalItems}
        onRequestPage={this.handleRequestPage}
      >
        <ReactList
          type='uniform'
          length={totalItems}
          itemRenderer={(index, key) => (
            // If `items[index] == null`, the page is still being loaded.
            items[index] != null ? (
              <div key={key}>
                #{index}
                <strong>{items[index]}</strong>
              </div>
            ) : <div key={key}>Loading …</div>
          )}
        />
      </LazyList>
    )
  }
}

ReactDOM.render(
  <App
    pageSize={10}
    totalItems={1000}
    minLoadTime={250}
    maxLoadTime={1250}
  />,
  document.getElementById('example')
)
