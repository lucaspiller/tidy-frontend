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
    const height = rect.bottom - rect.top
    const visible = rect.bottom - height <= (window.innerHeight || document.documentElement.clientHeight)
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
