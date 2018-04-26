import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSites, addSite, setActiveSiteId, deleteSite } from '../actions/siteActions.js';
import { Link } from 'react-router-dom';
import LeftNav from '../components/leftNav.js';
import TopNav from '../components/topNav.js';
import WebviewSwitcher from '../components/webviewSwitcher.js';

class Main extends Component {
	constructor(props) {
		super(props);
		this.switcher = React.createRef();
		
		this.activePageBack = () => {
			this.switcher.current.activeViewBack();
		}

		this.activePageRefresh = () => {
			this.switcher.current.activeViewRefresh();
		}

		this.activePageForward = () => {
			this.switcher.current.activeViewForward();
		}
	}

	render() {
		return(
			<div>
				<LeftNav sites={this.props.sites} 
						 activeSiteId={this.props.activeSiteId} 
						 setActiveSiteId={this.props.setActiveSiteId}
						 addSite={this.props.addSite}
						 deleteSite={this.props.deleteSite} />
				<TopNav activePageBack={this.activePageBack}
						activePageRefresh={this.activePageRefresh}
						activePageForward={this.activePageForward}/>
				<WebviewSwitcher ref={this.switcher} sites={this.props.sites} activeSiteId={this.props.activeSiteId} />
			</div>
		)
	}
}

let mapState = state => {
	return {
		sites: state.sites.sites,
		activeSiteId: state.sites.activeSiteId
	};
}

let mapDispatch = dispatch => {
	return {
		addSite: (site) => { dispatch(addSite(site)) },
		getSites: () => { dispatch(getSites()) },
		setActiveSiteId: (id) => { dispatch(setActiveSiteId(id)) },
		deleteSite: (id) => { dispatch(deleteSite(id)) }
	};
}

export default connect(mapState, mapDispatch)(Main);