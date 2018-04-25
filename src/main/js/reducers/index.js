import { combineReducers } from 'redux';
import Sites from './sitesReducer.js';
import Settings from './settingsReducer.js';

const rootReducer = combineReducers({
	sites: Sites,
	settings: Settings
});

export default rootReducer;