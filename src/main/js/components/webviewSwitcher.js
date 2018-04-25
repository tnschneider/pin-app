import React, { Component } from 'react';

class WebviewSwitcher extends Component{
	render(){
		let activeSite = this.props.sites.find(x => x.id === this.props.activeSiteId);

		if(!activeSite){
			return(
				<div>
					<h3>Loading...</h3>
				</div>
			)
		}

		return(
			<div>
				{this.props.sites.map((site, index) => {
					let visibility = site.id === this.props.activeSiteId ? 'visible' : 'hidden';
					return (
						<webview src={site.url} key={index} style={{ visibility: visibility, position: 'fixed', top: 0, bottom: 0, left: 60, right: 0 }} />
					)
				})}
			</div>
		);
	}
}

export default WebviewSwitcher;