import React from 'react'
import { findDOMNode } from 'react-dom'

export default class LazyImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shown: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.updateShownState.bind(this))
    this.updateShownState()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateShownState.bind(this))
  }

  updateShownState() {
    this.setState({
      shown: this.isShown()
    })
  }

  isShown() {
    if (this.state.shown) {
      return true
    }

    const element = findDOMNode(this)
    if (!element) {
      return false
    }

    const rect = element.getBoundingClientRect()

    const visible = rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)

    return visible
  }

  render() {
    const { src, width, height } = this.props
    const { shown } = this.state

    return (
      <div width={width} height={height}>
        { shown ? (
        <img src={src} />
        ) : '' }
      </div>
    )
  }
}
