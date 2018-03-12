import React from 'react'
import { render } from 'react-dom'
import { renderToString } from 'react-dom/server'
import { JSDOM } from 'jsdom'

import Style from '../ClientStyle'

afterEach(() => {
  global.window = undefined
  global.document = undefined
})

describe('ClientStyle Component', () => {
  it('should render nothing, but apply a style node to the document.head', () => {
    const { window } = new JSDOM('<html><body></body></html>')

    global.window = window
    global.document = window.document

    const div = document.createElement('div')
    const css = '.class1 { color: red } .class2 { color: blue }'

    render(<Style css={css} />, div)

    expect(
      document.getElementById('__react_css_component_id-0').textContent
    ).toBe(css)
    expect(div.innerHTML).toBe('')
  })

  it('should not throw on the server', () => {
    const css = '.class1 { color: red } .class2 { color: blue }'

    const markup = renderToString(<Style css={css} />)
    expect(markup).toBe('')
  })
})
