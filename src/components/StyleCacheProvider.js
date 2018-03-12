import { Component } from 'react'
import PropTypes from 'prop-types'

import { CONTEXT_NAMESPACE } from '../utils/namespace'

export default class StyleCacheProvider extends Component {
  constructor(props, context) {
    super(props, context)
    this.cache = {}
  }

  getChildContext() {
    return {
      [CONTEXT_NAMESPACE]: this.cache,
    }
  }

  render() {
    return this.props.children
  }
}

StyleCacheProvider.childContextTypes = {
  [CONTEXT_NAMESPACE]: PropTypes.object,
}
