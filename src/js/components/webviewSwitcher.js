import React, { Component } from 'react';
import NoSymbol from 'material-ui/svg-icons/notification/do-not-disturb';
import RaisedButton from 'material-ui/RaisedButton';
import {grey700} from 'material-ui/styles/colors';


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
		let activePage = this.props.pages.find(x => x.id === this.props.activePageId);

		if(!activePage){
			return(
				<div style={{ position: 'fixed', top: 0, left: '48px', right: 0, bottom: 0, backgroundColor: grey700 }}>
					<div style={{ display: 'flex', flexDirection: 'column', position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', alignItems: 'center' }}>
						<NoSymbol style={{ color: 'white', height: '120px', width: 'auto' }}></NoSymbol>
						<span style={{ color: 'white', fontSize: '20px', fontFamily: 'Roboto, sans-serif', marginBottom: '10px' }}>No pages pinned</span>
						<RaisedButton labelStyle={{ color: 'white' }} secondary={true} label="Pin a Page"></RaisedButton>
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
								 class={`webview ${ isActivePage ? 'active' : 'inactive' }`} 
								 style={{ visibility: visibility, position: 'fixed', top: 0, bottom: 0, left: 48, right: 0 }} />
					)
				})}
			</div>
		);
	}
}

export default WebviewSwitcher;