import React, { Component } from 'react';
import Card from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { remote } from 'electron';
import { Site } from '../../../core/models.js';
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

class LeftNav extends Component{
	constructor(props) {
		super(props);

		this.state = {
			siteIdToDelete: null,
			addNewIsOpen: false,
			addNewUrl: null
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
	}

	render(){
		const dialogActions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.cancelAddNew}
			/>,
			<FlatButton
				label="Add"
				primary={true}
				onClick={this.doAddNew}
			/>,
		]

		return(
			<Card className="left-nav">
				{this.props.sites.map((site, index) => {
					let isActive = site.id === this.props.activeSiteId;
					return (
						<FloatingActionButton key={index} 
											  mini={true} 
											  onClick={() => { this.props.setActiveSiteId(site.id); }}
											  data-site-id={site.id}>
							<img src={ `https://api.statvoo.com/favicon/?url=${site.hostname()}` } data-site-id={site.id} />
						</FloatingActionButton>
					)
				})}
				<FloatingActionButton mini={true} 
									  onClick={() => { this.setState({ addNewIsOpen: true }) }}>
					<ContentAdd />
				</FloatingActionButton>
				<Dialog title="Add New Site"
						actions={dialogActions}
						modal={true}
						open={this.state.addNewIsOpen}>
					<TextField floatingLabelText="Floating Label Text" hintText="https://www.example.org" onChange={this.addNewUrlChanged}></TextField>
				</Dialog>
			</Card>
		)
	}
}

export default LeftNav;