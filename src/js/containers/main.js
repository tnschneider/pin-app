import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPages, addPage, setActivePageId, 
		 deletePage, updatePageUrl, setActivePageByIndex, 
		 activePageIncrement, activePageDecrement } from '../actions/pagesActions.js';
import { Link } from 'react-router-dom';
import LeftNav from '../components/leftNav.js';
import TopNav from '../components/topNav.js';
import { Page } from 'shared/models.js';
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
			let url = this.state.addNewUrl;

			if (!url.includes("://")) {
				url = `https://${url}`;
			}

			this.props.addPage(new Page({url: url}));

			this.setState({ addNewUrl: null, addNewIsOpen: false });
		}

		this.cancelAddNew = () => {
			this.setState({ addNewUrl: null, addNewIsOpen: false });
		}

		this.addNewUrlChanged = (e) => {
			this.setState({ addNewUrl: e.target.value });
		}

		this.handleShortcuts = buildHandlers({
			'PAGE_0': () => this.props.setActivePageByIndex(0),
			'PAGE_1': () => this.props.setActivePageByIndex(1),
			'PAGE_2': () => this.props.setActivePageByIndex(2),
			'PAGE_3': () => this.props.setActivePageByIndex(3),
			'PAGE_4': () => this.props.setActivePageByIndex(4),
			'PAGE_5': () => this.props.setActivePageByIndex(5),
			'PAGE_6': () => this.props.setActivePageByIndex(6),
			'PAGE_7': () => this.props.setActivePageByIndex(7),
			'PAGE_8': () => this.props.setActivePageByIndex(8),
			'PAGE_9': () => this.props.setActivePageByIndex(9),
			'PAGE_BACK': () => this.props.activePageDecrement(),
			'PAGE_FORWARD': () => this.props.activePageIncrement(),
			'PAGE_ADD': () => this.openAddNewDialog()
		});

		this.handleAddNewKeyDown = (event) => {
			if (event.key === "Enter") {
				this.doAddNew();
			}
		}

		this.handlePageNavigated = (pageId, url) => {
			this.props.updatePageUrl(pageId, url);
		}
	}

	render() {
		if (!this.props.activePageId && this.props.pages.length > 0) {
			this.props.setActivePageId(this.props.pages[0].id);
		}

		const dialogActions = [
			<FlatButton label="Cancel" primary={true} onClick={this.cancelAddNew} />,
			<FlatButton label="Add" secondary={true} onClick={this.doAddNew} />
		];

		return(
			<div>
				<Shortcuts name='PAGES' handler={this.handleShortcuts}>
					<LeftNav pages={this.props.pages} 
							activePageId={this.props.activePageId} 
							setActivePageId={this.props.setActivePageId}
							addPage={this.props.addPage}
							deletePage={this.props.deletePage} 
							openAddNew={this.openAddNewDialog}/>

					<TopNav activePageBack={this.activePageBack}
							activePageRefresh={this.activePageRefresh}
							activePageForward={this.activePageForward}/>

					<WebviewSwitcher ref={this.switcher} 
									pages={this.props.pages} 
									activePageId={this.props.activePageId}
									openAddNew={this.openAddNewDialog}
									onPageNavigated={this.handlePageNavigated}/>
				</Shortcuts>
				<Dialog title="Add New Page"
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
		pages: state.pages.pages,
		activePageId: state.pages.activePageId
	};
}

let mapDispatch = dispatch => {
	return {
		addPage: (page) => { dispatch(addPage(page)) },
		getPages: () => { dispatch(getPages()) },
		setActivePageId: (id) => { dispatch(setActivePageId(id)) },
		deletePage: (id) => { dispatch(deletePage(id)) },
		updatePageUrl: (id, url) => { dispatch(updatePageUrl(id, url)) },
		setActivePageByIndex: (index) => { dispatch(setActivePageByIndex(index)) },
		activePageIncrement: () => { dispatch(activePageIncrement()) },
		activePageDecrement: () => { dispatch(activePageDecrement()) }
	};
}

export default connect(mapState, mapDispatch)(Main);