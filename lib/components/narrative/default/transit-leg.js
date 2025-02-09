import coreUtils from '@opentripplanner/core-utils'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage, FormattedTime } from 'react-intl'

import FormattedDuration from '../../util/formatted-duration'
import Icon from '../../util/icon'
import SpanWithSpace from '../../util/span-with-space'
import { capitalizeFirst } from '../../../util/ui'
import ViewTripButton from '../../viewers/view-trip-button'
import ViewStopButton from '../../viewers/view-stop-button'

const { getMapColor } = coreUtils.itinerary

export default class TransitLeg extends Component {
  static propTypes = {
    itinerary: PropTypes.object,
    LegIcon: PropTypes.elementType.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  _onLegClick (e, leg, index) {
    if (this.props.active) {
      this.props.setActiveLeg(null)
    } else {
      this.props.setActiveLeg(index, leg)
    }
  }

  _onClick = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render () {
    const { active, index, leg, LegIcon } = this.props
    const { expanded } = this.state
    const numStops = leg.to.stopIndex - leg.from.stopIndex - 1

    return (
      <div
        className={`leg${active ? ' active' : ''} transit-leg`}>
        <button
          className={`header`}
          onClick={(e) => this._onLegClick(e, leg, index)}
        >
          <div className='mode-icon-container'>
            <LegIcon leg={leg} />
          </div>
          <div className='route-name'>
            <div>
              {leg.routeShortName && <span className='route-short-name'>{leg.routeShortName}</span>}
              {leg.routeLongName && <span className='route-long-name'>{leg.routeLongName}</span>}
            </div>
            {leg.headsign && <div className='headsign'>
              <FormattedMessage
                id='common.routing.routeToHeadsign'
                values={{headsign: leg.headsign}}
              />
            </div>}
          </div>
          {leg.realTime ? <Icon type='rss' /> : null}
        </button>
        <div className='step-by-step'>
          <div className='transit-leg-body'>
            {/* 'from' Stop Row */}
            <div className='from-row'>
              <div className='time-cell'>
                <FormattedTime value={leg.startTime} />
              </div>
              <div className='trip-line-cell'>
                <div className='trip-line-top' style={{ backgroundColor: getMapColor(leg.mode) }} />
                <div className='stop-bubble' />
              </div>
              <div className='stop-name-cell'>
                <div style={{ float: 'right' }}>
                  <ViewStopButton stopId={leg.from.stopId} />
                </div>
                {formatLocation(leg.from.name)}
              </div>
            </div>

            {/* Trip Details Row (intermediate stops, alerts, etc.) ${getMapColor(leg.mode)} */}
            <div className='trip-details-row'>
              <div className='time-cell' />
              <div className='trip-line-cell'>
                <div className='trip-line-middle' style={{ backgroundColor: getMapColor(leg.mode) }} />
              </div>
              <div className='trip-details-cell'>
                {/* Intermediate Stops (expandable) */}
                <div className='intermediate-stops'>
                  <div>
                    {/* Trip Viewer Button */}
                    <div style={{float: 'right'}}>
                      <ViewTripButton
                        fromIndex={leg.from.stopIndex}
                        toIndex={leg.to.stopIndex}
                        tripId={leg.tripId}
                      />
                    </div>

                    {/* Expand Stops Button */}
                    <button className='clear-button-formatting' onClick={this._onClick}>
                      <Icon type={`caret-${expanded ? 'down' : 'right'}`} />
                      <SpanWithSpace className='transit-duration' margin={0.5}>
                        <FormattedDuration duration={leg.duration} />
                      </SpanWithSpace>
                      <FormattedMessage id='components.TransitLeg.expandStops' values={{numStops}} />
                    </button>
                    <div style={{ clear: 'both' }} />
                  </div>

                  {/* Expanded Stops */}
                  {expanded &&
                    <div>
                      <div className='stop-list'>
                        {leg.intermediateStops.map((s, i) => (
                          <div className='stop-item item' key={i}>
                            <div className='trip-line-stop' style={{ backgroundColor: getMapColor(leg.mode) }} />
                            <span className='stop-name'>{formatLocation(s.name)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                </div>

                {/* Service Alerts for Leg */}
                {leg.alerts &&
                  <div>
                    <div className='item'><Icon type='exclamation-circle' />
                      <FormattedMessage id='components.TransitLeg.info' />
                    </div>
                    {expanded &&
                      <div>
                        {leg.alerts.map((alert, i) => (
                          <div className='alert-item item' key={i}>
                            <SpanWithSpace margin={0.5}>{alert.alertDescriptionText}</SpanWithSpace>
                            {alert.alertUrl
                              ? <FormattedMessage
                                id='components.TransitLeg.moreInfo'
                                values={{
                                  alertLink: contents => <a href={alert.alertUrl} target='_blank'>{contents}</a>
                                }}
                              />
                              : null
                            }
                          </div>
                        ))}
                      </div>
                    }
                  </div>
                }

                {/* General Info */}
                <div className='item info-item'>
                  <span className='agency-info'>
                    <FormattedMessage
                      id='components.TransitLeg.serviceOperator'
                      values={{
                        agencyName: leg.agencyName,
                        operatorLink: contents => (
                          <a href={leg.agencyUrl}>{contents}</a>
                        )
                      }}
                    />
                  </span>
                  {
                    // route info included?
                    // <span className='route-info'><a target='_blank' href={leg.routeUrl}>Route information</a></span>
                  }
                </div>
              </div>
            </div>

            {/* 'to' stop row */}
            <div className='to-row'>
              <div className='time-cell'>
                <FormattedTime value={leg.endTime} />
              </div>
              <div className='trip-line-cell'>
                <div className='trip-line-bottom' style={{ backgroundColor: getMapColor(leg.mode) }} />
                <div className='stop-bubble' />
              </div>
              <div className='stop-name-cell'>
                <div style={{ float: 'right' }}>
                  <ViewStopButton stopId={leg.to.stopId} />
                </div>
                {formatLocation(leg.to.name)}
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

function formatLocation (str) {
  return str
    .trim()
    .toLowerCase()
    .replace('/', ' / ')
    .replace('-', ' - ')
    .replace('@', ' @ ')
    .replace('(', '( ')
    .replace('  ', ' ')
    .split(' ')
    .map(s => {
      if (['ne', 'sw', 'nw', 'se'].includes(s)) return s.toUpperCase()
      return capitalizeFirst(s)
    })
    .join(' ')
    .replace('( ', '(')
}
