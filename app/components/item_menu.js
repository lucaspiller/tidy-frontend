import React from 'react'
import { Link } from 'react-router'
import moment from 'moment'

export default class ItemMenu extends React.Component {
  formatDate(timestamp) {
    return moment(timestamp).format('MMMM Do YYYY, h:mma')
  }

  render() {
    let location
    if (this.props.item.metadata && this.props.item.metadata.location) {
      location = this.props.item.metadata.location.name
    }

    let date

    if (this.props.item.timestamp) {
      date = this.formatDate(this.props.item.timestamp)
    }

    const returnUrl = this.props.returnUrl
    const infoUrl   = this.props.infoUrl

    return (
      <div className="item-menu-component">
        <div className="top-menu">
          <nav className="back">
            <Link to={returnUrl}>
              Back
            </Link>
          </nav>

          <nav className="actions">
            <Link to={infoUrl}>
              Info
            </Link>
          </nav>
        </div>

        <div className="bottom-menu">
          <span className="location">
            {location}
          </span>

          <span className="date">
            {date}
          </span>
        </div>
      </div>
    )
  }
}
