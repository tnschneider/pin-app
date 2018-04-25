import { IpcClient } from '../../../core/ipc.js';
import { ADD_SITE, DELETE_SITE, SET_ACTIVE_SITE_ID } from '../actions/siteActions.js';

const sites = IpcClient.getSites();

const INITIAL_STATE = { sites: sites || [], activeSiteId: sites.length > 0 ? sites[0].id : null };

export default function(state = INITIAL_STATE, action) {
	switch(action.type) {
		case ADD_SITE:
			state.sites.push(action.payload);
			return Object.assign({}, state);
		case DELETE_SITE:
			let index = state.sites.find(x => x.id === action.payload);
			if (index > -1) state.sites.splice(index, 1);
			return Object.assign({}, state);
		case SET_ACTIVE_SITE_ID:
			state.activeSiteId = action.payload;
			return Object.assign({}, state);
	}
	return state;
}