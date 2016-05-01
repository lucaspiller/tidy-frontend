import React from 'react'
import { findDOMNode } from 'react-dom'

export default class StickyHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sticky: false
    }
  }

  componentDidMount() {
    this.updateStickyState = () => {
      const sticky = this.isSticky()
      if (sticky != this.state.sticky) {
        this.setState({
          sticky: sticky
        })
      }
    }

    window.addEventListener('scroll', this.updateStickyState)
    this.updateStickyState()
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateStickyState)
  }

  isSticky() {
    if (!this.element) {
      this.element = findDOMNode(this)
      if (!this.element) {
        return false
      }
    }

    if (!this.triggerPoint) {
      this.triggerPoint = this.element.getBoundingClientRect().top
    }

    const sticky = document.body.scrollTop >= this.triggerPoint
    return sticky
  }

  render() {
    const { sticky } = this.state
    let className = 'content'

    if (sticky) {
      className += ' sticky'
    }

    return (
      <header>
        <div className={className}>
          {this.props.children}
        </div>
      </header>
    )
  }
}
