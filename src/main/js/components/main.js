import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';


class Main extends Component {
	render() {
		return(
			<Paper style={{ width: '100vw', height: '100vh' }}>
				<AppBar
					title="Pin App"
					iconElementRight={<Link to={"/settings"}><FlatButton label="Settings"/></Link>}
				/>
			</Paper>
		)
	}
}

export default Main;
