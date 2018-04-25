import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSites, addSite, setActiveSiteId } from '../actions/siteActions.js';
import { Link } from 'react-router-dom';
import LeftNav from '../components/leftNav.js';
import TopNav from '../components/topNav.js';
import WebviewSwitcher from '../components/webviewSwitcher.js';


class Main extends Component {
	componentDidMount() {
		this.props.addSite({ url: "https://propak.visualstudio.com" })
	}

	render() {
		return(
			<div>
				<LeftNav sites={this.props.sites} activeSiteId={this.props.activeSiteId} setActiveSiteId={this.props.setActiveSiteId} />
				<TopNav />
				<WebviewSwitcher sites={this.props.sites} activeSiteId={this.props.activeSiteId} />
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
		setActiveSiteId: (id) => { dispatch(setActiveSiteId(id)) }
	};
}

export default connect(mapState, mapDispatch)(Main);