import React, { Component } from 'react';
import NoSymbol from 'material-ui/svg-icons/notification/do-not-disturb';
import RaisedButton from 'material-ui/RaisedButton';
import {grey700} from 'material-ui/styles/colors';

class WebviewSwitcher extends Component {
	constructor(props) {
		super(props);

		this.getActiveView = () => document.querySelector('.webview.active');

		this.getViewById = (id) => document.querySelector(`.webview.page-id-${id}`);

		this.activeViewBack = () => this.getActiveView().goBack();
	
		this.activeViewRefresh = () => this.getActiveView().reload();
	
		this.activeViewForward = () => this.getActiveView().goForward();

		this.registerListeners = (pageIds) => {
			pageIds.forEach((pageId) => {
				const webview = this.getViewById(pageId);
				const self = this;
				
				webview.addEventListener('dom-ready', function domhandler() {
					webview.addEventListener('did-navigate', function navigatehandler(e) {
						self.props.onPageNavigated(pageId, e.url);
						webview.removeEventListener('did-navigate', navigatehandler);
					});
				});
			});
		}
	}

	componentDidMount() {
		this.registerListeners(this.props.pages.map(x => x.id));
	}

	componentDidUpdate(previousProps) {
		const prevPageIds = this.props.pages.map(x => x.id);

		const currPageIds = previousProps.pages.map(x => x.id);

		this.registerListeners(this.props.pages.filter(x => !currPageIds.includes(x.id)));
	}

	render(){
		if (this.props.pages.length === 0) {
			return(
				<div style={{ position: 'fixed', top: 0, left: '48px', right: 0, bottom: 0, backgroundColor: grey700 }}>
					<div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', alignItems: 'center' }}>
						<NoSymbol style={{ color: 'white', height: '120px', width: 'auto' }}></NoSymbol>
						<span style={{ color: 'white', fontSize: '20px', fontFamily: 'Roboto, sans-serif', marginBottom: '10px' }}>No pages pinned</span>
						<RaisedButton labelStyle={{ color: 'white' }} secondary={true} label="Pin a Page" onClick={ this.props.openAddNew }></RaisedButton>
					</div>
				</div>
			)
		}

		return(
			<div>
				{this.props.pages.map((page, index) => {
					let isActivePage = page.id === this.props.activePageId;
					let visibility = isActivePage ? 'visible' : 'hidden';

					return (
						<webview is="?" 
								 src={page.url} 
								 key={index} 
								 class={`webview ${ isActivePage ? 'active' : 'inactive' } page-id-${page.id}`}
								 style={{ visibility: visibility, position: 'fixed', top: 0, bottom: 0, left: 48, right: 0 }} />
					)
				})}
			</div>
		);
	}
}

export default WebviewSwitcher;