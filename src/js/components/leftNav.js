import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { remote } from 'electron';
import { Site } from 'core/models.js';
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const SITE_BUTTON_HEIGHT = 48;

class LeftNav extends Component{
	constructor(props) {
		super(props);

		this.state = {
			siteIdToDelete: null,
			addNewIsOpen: false,
			addNewUrl: null,
			siteButtonOffset: 0
		}
		

		this.contextMenu = new Menu();
		this.contextMenu.append(new MenuItem({ label: 'Delete', click: () => { this.props.deleteSite(this.state.siteIdToDelete); } }));

		window.addEventListener('contextmenu', (e) => {
			var siteId = e.target.getAttribute("data-site-id");

			if (siteId) {
				this.setState({siteIdToDelete: siteId}, () => {
					e.preventDefault();
					this.contextMenu.popup(remote.getCurrentWindow());
				});
			}
		}, false);

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

		this.siteButtonPixels = () => this.props.sites.length * 48;

		this.siteButtonOffsetPixels = () => this.state.siteButtonOffset * 48;

		this.siteButtonsOverflowing = () => this.context.viewportHeight < (this.props.sites.length + 3) * SITE_BUTTON_HEIGHT;

		this.maxSitesCanFit = () => Math.max(Math.floor(this.context.viewportHeight / SITE_BUTTON_HEIGHT) - 3, 1);

		this.incrOffset = () => (this.state.siteButtonOffset < this.props.sites.length - this.maxSitesCanFit()) && this.setState({ siteButtonOffset: this.state.siteButtonOffset + 1 });

		this.decrOffset = () => (this.state.siteButtonOffset > 0) && this.setState({ siteButtonOffset: this.state.siteButtonOffset - 1 });

		this.resetOffset = () => this.state.siteButtonOffset !== 0 && this.setState({ siteButtonOffset: 0 });
	}

	static contextTypes = {
        viewportHeight: PropTypes.number.isRequired,
        viewportWidth: PropTypes.number.isRequired
    }

	render(){
		const dialogActions = [
			<FlatButton label="Cancel" primary={true} onClick={this.cancelAddNew} />,
			<FlatButton label="Add" primary={true} onClick={this.doAddNew} />
		];

		const scrollSites = this.siteButtonsOverflowing();
		if (!scrollSites) this.resetOffset();

		return(
			<Card className="left-nav">
				<div>
					{scrollSites && <IconButton onClick={this.decrOffset}><ArrowUp/></IconButton>}
					<div style={{ maxHeight: 'calc(100vh - 144px)', overflow: 'hidden' }}>
						<div style={{ position: 'relative',transform: `translateY(-${this.siteButtonOffsetPixels()}px)` }}>
							{this.props.sites.map((site, index) => {
								let isActive = site.id === this.props.activeSiteId;
								return (
									<FloatingActionButton key={index} 
														mini={true} 
														onClick={() => { this.props.setActiveSiteId(site.id); }}
														data-site-id={site.id}
														className={`nav-button ${isActive ? 'active' : 'inactive' }`}>
										<img src={ `https://api.statvoo.com/favicon/?url=${site.hostname()}` } data-site-id={site.id} />
									</FloatingActionButton>
								)
							})}
						</div>
					</div>
					{scrollSites && <IconButton onClick={this.incrOffset}><ArrowDown/></IconButton>}
				</div>
				<FloatingActionButton mini={true} onClick={this.openAddNewDialog} className="nav-button">
					<ContentAdd />
				</FloatingActionButton>
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
							   onChange={this.addNewUrlChanged}></TextField>
				</Dialog>
			</Card>
		)
	}
}

export default LeftNav;