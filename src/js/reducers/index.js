import { combineReducers } from 'redux';
import Pages from './pagesReducer.js';
import Settings from './settingsReducer.js';

const rootReducer = combineReducers({
	pages: Pages,
	settings: Settings
});

export default rootReducer;