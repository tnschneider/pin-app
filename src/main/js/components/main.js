import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';


class Main extends Component {
	render() {
		return(
			<Paper style={{ width: '100vw', height: '100vh' }}>
				<AppBar
					title="Title"
					iconClassNameRight="muidocs-icon-navigation-expand-more"
				/>
				<webview src="http://www.google.com" style={{ height: '100%', width: '100%' }}></webview>
			</Paper>
		)
	}
}

export default Main;
