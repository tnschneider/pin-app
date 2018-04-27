import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keymap from '../keymap.js'
import { ShortcutManager } from 'react-shortcuts';
const shortcutManager = new ShortcutManager(keymap);

class ShortcutProvider extends React.Component {
    static childContextTypes = {
        shortcuts: PropTypes.object.isRequired
    }

	getChildContext() {
		return { shortcuts: shortcutManager };
    }
    
    render() {
        return this.props.children;
    }
}
	
const buildHandlers = (handlers) => {
    return (action, event) => handlers[action](event);
};

export {
    ShortcutProvider,
    buildHandlers
}