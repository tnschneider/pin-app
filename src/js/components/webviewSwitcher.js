import React, { Component } from 'react';

class WebviewSwitcher extends Component {
	constructor(props) {
		super(props);

		this.activeViewBack = () => {
			document.querySelector('.webview').goBack();
		}
	
		this.activeViewRefresh = () => {
			document.querySelector('.webview').reload();
		}
	
		this.activeViewForward = () => {
			document.querySelector('.webview').goForward();
		}
	}

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
					let isActiveSite = site.id === this.props.activeSiteId;
					let visibility = isActiveSite ? 'visible' : 'hidden';

					return (
						<webview is="?" 
								 src={site.url} 
								 key={index} 
								 class={`webview ${ isActiveSite ? 'active' : 'inactive' }`} 
								 style={{ visibility: visibility, position: 'fixed', top: 0, bottom: 0, left: 48, right: 0 }} />
					)
				})}
			</div>
		);
	}
}

export default WebviewSwitcher;