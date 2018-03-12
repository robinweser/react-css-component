import React, { Component } from 'react'
import { render } from 'react-dom'
import { renderToString } from 'react-dom/server'
import { JSDOM } from 'jsdom'

import Style from '../UniversalStyle'

afterEach(() => {
  global.window = undefined
  global.document = undefined
})

describe('UniversalComponent Component', () => {
  it('should render a style element on the server', () => {
    const css = '.class1 { color: red } .class2 { color: blue }'

    const markup = renderToString(<Style css={css} />)
    expect(markup).toMatchSnapshot()
  })

  it('should render a style element on the client', () => {
    const { window } = new JSDOM('<html><body></body></html>')

    global.window = window
    global.document = window.document

    const div = document.createElement('div')
    const css = '.class1 { color: red } .class2 { color: blue }'

    render(<Style css={css} />, div)

    expect(div.innerHTML).toMatchSnapshot()
    expect(document.head.childNodes.length).toBe(0)
  })

  it('should move the style to the document.head if the component unmounts', () => {
    const { window } = new JSDOM('<html><body></body></html>')

    global.window = window
    global.document = window.document

    const div = document.createElement('div')
    const css = '.class1 { color: red } .class2 { color: blue }'

    class Wrapper extends Component {
      constructor(props, context) {
        super(props, context)

        this.state = {
          isVisible: true,
        }

        window.hide = () => {
          this.setState({ isVisible: false })
        }
      }

      render() {
        if (this.state.isVisible) {
          return <Style css={css} />
        }

        return null
      }
    }

    render(<Wrapper />, div)

    expect(div.innerHTML).toMatchSnapshot()
    expect(document.head.childNodes.length).toBe(0)

    window.hide()

    expect(div.innerHTML).toBe('')
    expect(document.head.childNodes.length).toBe(1)
    expect(
      document.getElementById('__react_css_component_id-0').textContent
    ).toBe(css)
  })

  it('should move each different style to the document.head if the component unmounts', () => {
    const { window } = new JSDOM('<html><body></body></html>')

    global.window = window
    global.document = window.document

    const div = document.createElement('div')
    const css1 = '.class1 { color: red } .class2 { color: blue }'
    const css2 = '.class3 { color: green }'

    class Wrapper extends Component {
      constructor(props, context) {
        super(props, context)

        this.state = {
          isVisible: true,
        }

        window.hide = () => {
          this.setState({ isVisible: false })
        }
      }

      render() {
        if (this.state.isVisible) {
          return [
            <Style key="style-1" css={css1} />,
            <Style key="style-2" css={css2} />,
          ]
        }

        return null
      }
    }

    render(<Wrapper />, div)

    expect(div.innerHTML).toMatchSnapshot()
    expect(document.head.childNodes.length).toBe(0)

    window.hide()

    expect(div.innerHTML).toBe('')
    expect(document.head.childNodes.length).toBe(2)
    expect(
      document.getElementById('__react_css_component_id-0').textContent
    ).toBe(css1)
    expect(
      document.getElementById('__react_css_component_id-1').textContent
    ).toBe(css2)
  })

  it('should only move the style once to the document.head', () => {
    const { window } = new JSDOM('<html><body></body></html>')

    global.window = window
    global.document = window.document

    const div = document.createElement('div')
    const css = '.class1 { color: red } .class2 { color: blue }'

    class Wrapper extends Component {
      constructor(props, context) {
        super(props, context)

        this.state = {
          isVisible: true,
        }

        window.hide = () => {
          this.setState({ isVisible: false })
        }
      }

      render() {
        if (this.state.isVisible) {
          return [
            <Style key="style-1" css={css} />,
            <Style key="style-2" css={css} />,
          ]
        }

        return null
      }
    }

    render(<Wrapper />, div)

    expect(div.innerHTML).toMatchSnapshot()
    expect(document.head.childNodes.length).toBe(0)

    window.hide()

    expect(div.innerHTML).toBe('')
    expect(document.head.childNodes.length).toBe(1)
    expect(
      document.getElementById('__react_css_component_id-0').textContent
    ).toBe(css)
  })
})
