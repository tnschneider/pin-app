import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSites } from 'siteActions.js';

class WebviewContainer extends Component{
	renderWebviews() {
		this.props.sites.map((site) => {
			let display = site.id === this.props.activeSiteId ? 'block' : 'none';
			return (
				<webview src={site.url} style={{ height: '100%', width: '100%', display: display }} />
			)
		});
	}
	
	componentDidMount() {
		//maybe put some stuff here
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
				{ this.renderWebviews() }
			</div>
		)
	}
}

export default connect((state) => ({
	sites: state.sites,
	activeSiteId: state.activeSiteId
}), { getSites })(WebviewContainer);