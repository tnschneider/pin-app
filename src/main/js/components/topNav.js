import React, { Component } from 'react';
import Card from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back.js';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward.js';
import Refresh from 'material-ui/svg-icons/navigation/refresh.js';

class TopNav extends Component{
	render(){
		return(
			<div className="top-nav-ghost">
				<Card className="top-nav">
					<IconButton><ArrowBack /></IconButton>
					<IconButton><Refresh /></IconButton>
					<IconButton><ArrowForward /></IconButton>
				</Card>
			</div>
			
		)
	}
}

export default TopNav;