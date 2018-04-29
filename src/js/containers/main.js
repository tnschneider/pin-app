import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPages, addPage, setActivePageId, 
		 deletePage, updatePageUrl, setActivePageByIndex, 
		 activePageIncrement, activePageDecrement,
		 setSortOrder, updatePageShouldUpdateUrl } from '../actions/pagesActions.js';
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
import CircularProgress from 'material-ui/CircularProgress';

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			addNewIsOpen: false,
			addNewLoading: false,
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
			if (this.state.addNewLoading || !this.state.addNewUrl) return;

			this.setState({ addNewLoading: true });

			let url = this.state.addNewUrl;
			let hostAndPath;

			if (!url.includes("://")) {
				hostAndPath = url;	
				url = `https://${url}`;
			} else {
				hostAndPath = url.split("://")[1];
			}

			const fetchUrl = `https://favicongrabber.com/api/grab/${hostAndPath}`;

			fetch(fetchUrl).then(response => {
				let faviconSrc;

				var promises = [];
				if (response.status === 200) {
					promises.push(response.json().then(model => {
						if (model.icons && model.icons.length > 0) {
							faviconSrc = model.icons[0].src;
						}
					}));
				}

				Promise.all(promises).then(x => {
					this.props.addPage(new Page({url: url, faviconSrc: faviconSrc }));

					this.setState({ addNewUrl: null, addNewIsOpen: false, addNewLoading: false });
				})
				
			});

			
		}

		this.cancelAddNew = () => {
			if (this.state.addNewLoading) return;

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
		
		this.getPageById = (pageId) => {
			return this.props.pages.find(x => x.id === pageId);
		}

		this.handlePageNavigated = (pageId, url) => {
			const page = this.getPageById(pageId);
			if (page && page.shouldUpdateUrlOnNavigate) {
				this.props.updatePageUrl(pageId, url);
			};
		}

		
	}

	render() {
		if (!this.props.activePageId && this.props.pages.length > 0) {
			this.props.setActivePageId(this.props.pages[0].id);
		}

		const dialogActions = [
			<FlatButton label="Cancel" primary={true} onClick={this.cancelAddNew} disabled={this.state.addNewLoading} />,
			<FlatButton label="Add" secondary={true} onClick={this.doAddNew} disabled={this.state.addNewLoading || !this.state.addNewUrl} />
		];

		return(
			<div onDrop={this.handleFileDrop}>
				<Shortcuts name='PAGES' handler={this.handleShortcuts}>
					<LeftNav pages={this.props.pages} 
							activePageId={this.props.activePageId} 
							setActivePageId={this.props.setActivePageId}
							addPage={this.props.addPage}
							deletePage={this.props.deletePage} 
							openAddNew={this.openAddNewDialog}
							setSortOrder={this.props.setSortOrder}
							updatePageShouldUpdateUrl={this.props.updatePageShouldUpdateUrl}/>

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
					<CircularProgress size={120} thickness={7} 
									  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', visibility: this.state.addNewLoading ? 'visible' : 'hidden' }}
									  innerStyle={{ position: 'absolute', top: 'calc(50% - 60px)', left: 'calc(50% - 60px)' }}/>
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
		updatePageShouldUpdateUrl: (id, shouldUpdate) => { dispatch(updatePageShouldUpdateUrl(id, shouldUpdate)) },
		setActivePageByIndex: (index) => { dispatch(setActivePageByIndex(index)) },
		activePageIncrement: () => { dispatch(activePageIncrement()) },
		activePageDecrement: () => { dispatch(activePageDecrement()) },
		setSortOrder: (sortOrder) => { dispatch(setSortOrder(sortOrder)) }
	};
}

export default connect(mapState, mapDispatch)(Main);