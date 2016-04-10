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
    this.updateShownState = () => {
      this.setState({
        shown: this.isShown()
      })
    }
    window.addEventListener('scroll', this.updateShownState)
    this.updateShownState()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateShownState)
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
    const height = rect.bottom - rect.top
    // we multiply the height by 2 so hopefully images can be loaded before
    // they are scrolled into view
    const visible = rect.bottom - height <= (window.innerHeight || document.documentElement.clientHeight) * 2
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
