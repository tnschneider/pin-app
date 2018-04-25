import React, { Component } from 'react';

import Settings from './containers/settings';
import Main from './containers/main';

import {
  HashRouter as Router,
  Route,
} from 'react-router-dom';

export default class extends Component {
	render() {
		return (
			<Router>
				<div>
					<Route exact path="/" component={Main} />
					<Route path="/settings" component={Settings} />
				</div>
			</Router>
		)
	}
}