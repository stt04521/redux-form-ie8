import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {
  App,
  Code,
  Markdown,
  Values,
  generateExampleBreadcrumbs
} from 'redux-form-website-template'
injectTapEventPlugin()
const dest = document.getElementById('content')
const reducer = combineReducers({
  form: reduxFormReducer // mounted under "form"
})
const store =
  (window.devToolsExtension ? window.devToolsExtension()(createStore) : createStore)(reducer)

const showResults = values =>
  new Promise(resolve => {
    setTimeout(() => {  // simulate server latency
      window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
      resolve()
    }, 500)
  })

let render = () => {
  const MaterialUiForm = require('./MaterialUiForm').default
  const readme = require('./MaterialUi.md')
  const raw = require('!!raw!./MaterialUiForm')
  const asyncValidateraw = require('!!raw!./asyncValidate')
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <App
          /**
           * This <App/> component only provides the site wrapper.
           * Remove it on your dev server if you wish. It will not affect the functionality.
           */
          version="6.0.0"
          path="/examples/material-ui/"
          breadcrumbs={generateExampleBreadcrumbs('material-ui', 'Material Ui Form Example', '6.0.0')}>

          <Markdown content={readme}/>

          <h2>Form</h2>

          <MaterialUiForm onSubmit={showResults}/>

          <Values form="MaterialUiForm"/>

          <h2>Code</h2>

          <h4>asyncValidate.js</h4>

          <Code source={asyncValidateraw}/>

          <h4>MaterialUiForm.js</h4>

          <Code source={raw}/>

        </App>
      </MuiThemeProvider>
    </Provider>,
    dest
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(
      <RedBox error={error} className="redbox"/>,
      dest
    )
  }
  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }
  const rerender = () => {
    setTimeout(render)
  }
  module.hot.accept('./MaterialUiForm', rerender)
  module.hot.accept('./MaterialUi.md', rerender)
  module.hot.accept('!!raw!./MaterialUiForm', rerender)
  module.hot.accept('!!raw!./asyncValidate', rerender)
}

render()
