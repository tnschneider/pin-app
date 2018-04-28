import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSites, addSite, setActiveSiteId, 
		 deleteSite, setActiveSiteByIndex, 
		 activeSiteIncrement, activeSiteDecrement } from '../actions/siteActions.js';
import { Link } from 'react-router-dom';
import LeftNav from '../components/leftNav.js';
import TopNav from '../components/topNav.js';
import { Site } from 'core/models.js';
import WebviewSwitcher from '../components/webviewSwitcher.js';
import { Shortcuts } from 'react-shortcuts';
import { buildHandlers } from '../components/shortcutProvider.js';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			addNewIsOpen: false,
			addNewUrl: null
		}
		
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

		this.openAddNewDialog = () => { 
			this.setState({ addNewIsOpen: true }, () => {
				setTimeout(() => {
					let input = document.getElementById('urlInput');
					input.focus();
				}, 200);
			});
		}

		this.doAddNew = () => {
			this.props.addSite(new Site({url: this.state.addNewUrl}));
			this.setState({ addNewUrl: null, addNewIsOpen: false });
		}

		this.cancelAddNew = () => {
			this.setState({ addNewUrl: null, addNewIsOpen: false });
		}

		this.addNewUrlChanged = (e) => {
			this.setState({ addNewUrl: e.target.value });
		}

		this.handleShortcuts = buildHandlers({
			'SITE_0': () => this.props.setActiveSiteByIndex(0),
			'SITE_1': () => this.props.setActiveSiteByIndex(1),
			'SITE_2': () => this.props.setActiveSiteByIndex(2),
			'SITE_3': () => this.props.setActiveSiteByIndex(3),
			'SITE_4': () => this.props.setActiveSiteByIndex(4),
			'SITE_5': () => this.props.setActiveSiteByIndex(5),
			'SITE_6': () => this.props.setActiveSiteByIndex(6),
			'SITE_7': () => this.props.setActiveSiteByIndex(7),
			'SITE_8': () => this.props.setActiveSiteByIndex(8),
			'SITE_9': () => this.props.setActiveSiteByIndex(9),
			'SITE_BACK': () => this.props.activeSiteDecrement(),
			'SITE_FORWARD': () => this.props.activeSiteIncrement(),
			'SITE_ADD': () => this.openAddNewDialog()
		});

		this.handleAddNewKeyDown = (event) => {
			if (event.key === "Enter") {
				this.doAddNew();
			}
		}
	}

	render() {
		const dialogActions = [
			<FlatButton label="Cancel" primary={true} onClick={this.cancelAddNew} />,
			<FlatButton label="Add" secondary={true} onClick={this.doAddNew} />
		];

		return(
			<div>
				<Shortcuts name='SITES' handler={this.handleShortcuts}>
					<LeftNav sites={this.props.sites} 
							activeSiteId={this.props.activeSiteId} 
							setActiveSiteId={this.props.setActiveSiteId}
							addSite={this.props.addSite}
							deleteSite={this.props.deleteSite} 
							openAddNew={this.openAddNewDialog}/>

					<TopNav activePageBack={this.activePageBack}
							activePageRefresh={this.activePageRefresh}
							activePageForward={this.activePageForward}/>

					<WebviewSwitcher ref={this.switcher} 
									sites={this.props.sites} 
									activeSiteId={this.props.activeSiteId} />
				</Shortcuts>
				<Dialog title="Add New Site"
						actions={dialogActions}
						open={this.state.addNewIsOpen}
						contentStyle={{ maxWidth: '500px' }}
						onRequestClose={(buttonClicked) => { if (!buttonClicked) this.cancelAddNew(); }}>
					<TextField fullWidth={true}
							   id="urlInput"
							   type="url"
							   floatingLabelText="URL" 
							   hintText="https://www.example.org" 
							   onChange={this.addNewUrlChanged}
							   onKeyDown={this.handleAddNewKeyDown}></TextField>
				</Dialog>
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
		deleteSite: (id) => { dispatch(deleteSite(id)) },
		setActiveSiteByIndex: (index) => { dispatch(setActiveSiteByIndex(index)) },
		activeSiteIncrement: () => { dispatch(activeSiteIncrement()) },
		activeSiteDecrement: () => { dispatch(activeSiteDecrement()) }
	};
}

export default connect(mapState, mapDispatch)(Main);