import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import { remote } from 'electron';
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const PAGE_BUTTON_HEIGHT = 48;

class LeftNav extends Component{
	constructor(props) {
		super(props);

		this.state = {
			pageIdToDelete: null,
			pageButtonOffset: 0
		}
		

		this.contextMenu = new Menu();
		this.contextMenu.append(new MenuItem({ label: 'Delete', click: () => { this.props.deletePage(this.state.pageIdToDelete); } }));

		window.addEventListener('contextmenu', (e) => {
			var pageId = e.target.getAttribute("data-page-id");

			if (pageId) {
				this.setState({pageIdToDelete: pageId}, () => {
					e.preventDefault();
					this.contextMenu.popup(remote.getCurrentWindow());
				});
			}
		}, false);

		this.pageButtonPixels = () => this.props.pages.length * 48;

		this.pageButtonOffsetPixels = () => this.state.pageButtonOffset * 48;

		this.pageButtonsOverflowing = () => this.context.viewportHeight < (this.props.pages.length + 3) * PAGE_BUTTON_HEIGHT;

		this.maxPagesCanFit = () => Math.max(Math.floor(this.context.viewportHeight / PAGE_BUTTON_HEIGHT) - 3, 1);

		this.incrOffset = () => (this.state.pageButtonOffset < this.props.pages.length - this.maxPagesCanFit()) && this.setState({ pageButtonOffset: this.state.pageButtonOffset + 1 });

		this.decrOffset = () => (this.state.pageButtonOffset > 0) && this.setState({ pageButtonOffset: this.state.pageButtonOffset - 1 });

		this.resetOffset = () => this.state.pageButtonOffset !== 0 && this.setState({ pageButtonOffset: 0 });
	}

	static contextTypes = {
        viewportHeight: PropTypes.number.isRequired,
        viewportWidth: PropTypes.number.isRequired
    }

	render(){
		const scrollPages = this.pageButtonsOverflowing();
		if (!scrollPages) this.resetOffset();

		return(
			<Card className="left-nav">
				<div>
					{scrollPages && <IconButton onClick={this.decrOffset}><ArrowUp/></IconButton>}
					<div style={{ maxHeight: 'calc(100vh - 144px)', overflow: 'hidden' }}>
						<div style={{ position: 'relative',transform: `translateY(-${this.pageButtonOffsetPixels()}px)` }}>
							{this.props.pages.map((page, index) => {
								let isActive = page.id === this.props.activePageId;
								return (
									<FloatingActionButton key={index} 
														mini={true} 
														onClick={() => { this.props.setActivePageId(page.id); }}
														data-page-id={page.id}
														className={`nav-button ${isActive ? 'active' : 'inactive' }`}>
										<img src={ `https://api.statvoo.com/favicon/?url=${page.hostname()}` } data-page-id={page.id} />
									</FloatingActionButton>
								)
							})}
						</div>
					</div>
					{scrollPages && <IconButton onClick={this.incrOffset}><ArrowDown/></IconButton>}
				</div>
				<FloatingActionButton mini={true} onClick={this.props.openAddNew} className="nav-button">
					<ContentAdd />
				</FloatingActionButton>
			</Card>
		)
	}
}

export default LeftNav;