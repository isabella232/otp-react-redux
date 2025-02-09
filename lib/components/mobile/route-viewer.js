import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { ComponentContext } from '../../util/contexts'
import DefaultMap from '../map/default-map'
import { setViewedRoute, setMainPanelContent } from '../../actions/ui'
import RouteViewer from '../viewers/route-viewer'

import MobileContainer from './container'
import MobileNavigationBar from './navigation-bar'

class MobileRouteViewer extends Component {
  static propTypes = {
    setMainPanelContent: PropTypes.func,
    setViewedRoute: PropTypes.func
  }

  static contextType = ComponentContext

  _backClicked = () => {
    this.props.setViewedRoute(null)
    this.props.setMainPanelContent(null)
  }

  render () {
    const { ModeIcon } = this.context
    return (
      <MobileContainer>
        <MobileNavigationBar
          headerText={<FormattedMessage id='components.RouteViewer.header' />}
          onBackClicked={this._backClicked}
          showBackButton
        />
        <div className='viewer-map'>
          <DefaultMap />
        </div>

        <div className='viewer-container'>
          <RouteViewer hideBackButton ModeIcon={ModeIcon} />
        </div>
      </MobileContainer>
    )
  }
}

// connect to the redux store

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = {
  setMainPanelContent,
  setViewedRoute
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileRouteViewer)
