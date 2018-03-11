import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { CONTEXT_NAMESPACE, ID_NAMESPACE } from '../utils/namespace'
import appendStyle from '../utils/appendStyle'

const idCache = {}

export default class Style extends Component {
  static contextTypes = {
    [CONTEXT_NAMESPACE]: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)

    if (!idCache[props.css]) {
      // generating a unique style id to prevent duplicate nodes
      // within client-sides document.head
      const uniqueId = Object.keys(idCache).length
      idCache[props.css] = ID_NAMESPACE + uniqueId
    }

    if (context[CONTEXT_NAMESPACE]) {
      // add the rendered css to the cache to only render once during SSR
      if (!context[CONTEXT_NAMESPACE][props.css]) {
        context[CONTEXT_NAMESPACE][props.css] = true
        this.isFirstOccurence = true
      }
    } else {
      // if no cache is provided, render multiple times
      this.isFirstOccurence = true
    }
  }

  componentWillUnmount() {
    if (this.isFirstOccurence) {
      const css = this.props.css
      const id = idCache[css]

      // inject the style into the head if it unmounts
      // to ensure its existence for other instances
      // using the same CSS rendered
      appendStyle(id, css)
    }
  }

  render() {
    // only actually render the style node
    // if its the first occurence
    if (this.isFirstOccurence) {
      return <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
    }

    return null
  }
}
