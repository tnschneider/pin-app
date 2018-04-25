import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import routes from './routes';
import { AppContainer } from 'react-hot-loader';
import Root from './routes'

import store from './store'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const render = (Component) => {
	ReactDOM.render(
		
		<AppContainer>
			<Provider store={store}>
				<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
					<Component />
				</MuiThemeProvider>
			</Provider>
		</AppContainer>,
		
		document.getElementById('root')
	)
}

render(Root)

if (module.hot) {
  module.hot.accept('./routes.js', () => {
	  const newRoot = require('./routes').default;
	  render(newRoot)
  })
}