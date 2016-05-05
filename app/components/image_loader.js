import React from 'react'

export default class ImageLoader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fullSizeLoaded: false
    }
  }

  componentDidMount() {
    const { fullSrc } = this.props
    this.loadFullImage(fullSrc)
  }

  componentWillReceiveProps(props, _state) {
    const { fullSrc } = props
    this.loadFullImage(fullSrc)
  }

  loadFullImage(fullSrc) {
    // Check if it's already loaded or loading
    if (this.state.fullSizeLoaded || this.state.fullSizeLoading) {
      return true
    }

    // Check we have everything we need to load it
    if (!fullSrc) {
      return false
    }

    // otherwise load it!
    const _this = this
    var image = new Image()
    image.onload = () => {
      this.setState({
        fullSizeLoading: false,
        fullSizeLoaded:  true
      })
    }
    image.src = fullSrc

    this.setState({ fullSizeLoading: true })
  }

  render() {
    const style = {
      width: this.props.width,
      height: this.props.height
    }

    if (this.state.fullSizeLoaded) {
      return (
        <img src={this.props.fullSrc} className="loaded" style={style} />
      )
    } else {
      return (
        <img src={this.props.thumbnailSrc} className="loading" style={style} />
      )
    }
  }
}
