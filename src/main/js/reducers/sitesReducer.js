import { IpcClient } from '../../../core/ipc.js';
import { ADD_SITE, DELETE_SITE, SET_ACTIVE_SITE_ID } from '../actions/siteActions.js';

const sites = IpcClient.getSites();

const INITIAL_STATE = { sites: sites || [], activeSiteId: sites.length > 0 ? sites[0].id : null };

export default function(state = INITIAL_STATE, action) {
	switch(action.type) {
		case ADD_SITE:
			state.sites.push(action.payload)
			return Object.assign({}, state, {
				sites: state.sites
		  	});
		case DELETE_SITE:

			let newSiteId = state.activeSiteId !== action.payload 
								? state.activeSiteId 
								: (state.sites.find(x => x.id !== action.payload) || {}).id;

			return Object.assign({}, state, {
				activeSiteId: newSiteId,
				sites: state.sites.filter(x => x.id !== action.payload)
		  	});
		case SET_ACTIVE_SITE_ID:
			return Object.assign({}, state, {
				activeSiteId: action.payload
		  	});
		default:
			return state;
	}
}