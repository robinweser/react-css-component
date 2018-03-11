import { Component } from 'react'

import { ID_NAMESPACE } from '../utils/namespace'
import appendStyle from '../utils/appendStyle'
import isDOMReady from '../utils/isDOMReady'

const idCache = {}

export default class ClientStyle extends Component {
  constructor(props, context) {
    super(props, context)

    if (!idCache[props.css]) {
      // generating a unique style id to prevent duplicate nodes
      // within client-sides document.head
      const uniqueId = Object.keys(idCache).length
      idCache[props.css] = ID_NAMESPACE + uniqueId
    }

    if (isDOMReady()) {
      appendStyle(idCache[props.css], props.css)
      this.isReady = true
    }
  }

  componentDidMount() {
    if (!this.isReady && isDOMReady()) {
      appendStyle(idCache[this.props.css], this.props.css)
    }
  }

  render() {
    return null
  }
}
