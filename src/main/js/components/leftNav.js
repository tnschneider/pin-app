import React, { Component } from 'react';
import Card from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class LeftNav extends Component{
	render(){
		return(
			<Card className="left-nav">
				{this.props.sites.map((site, index) => {
					let isActive = site.id === this.props.activeSiteId;
					return (
						<FloatingActionButton key={index} mini={true} onClick={() => { this.props.setActiveSiteId(site.id); }}>
							<img src={ `https://api.statvoo.com/favicon/?url=${site.hostname()}` } />
						</FloatingActionButton>
					)
				})}
			</Card>
		)
	}
}

export default LeftNav;