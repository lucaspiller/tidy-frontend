import React from 'react'
import throttle from 'lodash/throttle'

export default class InfiniteScrollList extends React.Component {
  componentWillMount() {
    this.checkLoadMore = throttle(() => {
      if (this.shouldLoadMore()) {
        this.props.onLoadMore()
      }
    }, 50)

    window.addEventListener('scroll', this.checkLoadMore)
    this.checkLoadMore()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkLoadMore)
  }

  shouldLoadMore() {
    const triggerPoint = document.body.scrollHeight - (window.innerHeight * 5)
    return document.body.scrollTop >= triggerPoint
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.props.children}
      </div>
    )
  }
}
