import React from 'react'
import { findDOMNode } from 'react-dom'
import throttle from 'lodash/throttle'

export default class LazyImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shown: false
    }
  }

  componentDidMount() {
    this.updateShownState = throttle(() => {
      if (this.isShown()) {
        window.removeEventListener('scroll', this.updateShownState)

        this.setState({
          shown: true
        })
      }
    }, 50)

    window.addEventListener('scroll', this.updateShownState)
    this.updateShownState()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateShownState)
  }

  isShown() {
    if (!this.element) {
      this.element = findDOMNode(this)
      if (!this.element) {
        return false
      }
    }

    if (!this.triggerPoint) {
      const rect = this.element.getBoundingClientRect()
      // we multiply the height by 2 so hopefully images can be loaded before
      // they are scrolled into view
      this.triggerPoint = rect.top - (rect.height * 2) + document.body.scrollTop
    }

    const visible = (document.body.scrollTop + window.innerHeight) >= this.triggerPoint
    return visible
  }

  render() {
    const { src, width, height } = this.props
    const { shown } = this.state
    let style = {}

    if (shown) {
      style.backgroundImage = `url("${src}")`
    }

    return (
      <div className="image" width={width} height={height} style={style} />
    )
  }
}
