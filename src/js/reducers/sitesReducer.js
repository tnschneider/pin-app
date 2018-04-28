import { IpcClient } from 'shared/ipc.js';
import { ADD_SITE,
		 DELETE_SITE,
		 SET_ACTIVE_SITE_ID,
		 SET_ACTIVE_SITE_BY_INDEX,
		 ACTIVE_SITE_INCR,
		 ACTIVE_SITE_DECR } from '../actions/siteActions.js';

const sites = IpcClient.getSites();

const INITIAL_STATE = { sites: sites || [], activeSiteId: sites.length > 0 ? sites[0].id : null };

export default function(state = INITIAL_STATE, action) {

	const updateState = (newState) => Object.assign({}, state, newState);

	const getSiteIdFromIndex = (index) => state.sites[index].id;

	const getActiveSiteIndex = () => state.sites.findIndex(x => x.id === state.activeSiteId);

	let index;

	switch(action.type) {
		case ADD_SITE:
			state.sites.push(action.payload);
			return updateState({ sites: state.sites });

		case DELETE_SITE:
			let newSiteId = state.activeSiteId !== action.payload 
								? state.activeSiteId 
								: (state.sites.find(x => x.id !== action.payload) || {}).id;

			return updateState({
				activeSiteId: newSiteId,
				sites: state.sites.filter(x => x.id !== action.payload)
			});
			  
		case SET_ACTIVE_SITE_ID:
			return updateState({ activeSiteId: action.payload });

		case SET_ACTIVE_SITE_BY_INDEX:
			let index = action.payload;

			if (index >= 0 && state.sites.length > index) {
				return updateState({ activeSiteId: state.sites[index].id });
			} 

			return state;
			
		case ACTIVE_SITE_INCR:
			index = getActiveSiteIndex();

			if (index < 0) {
				return updateState({ activeSiteId: getSiteIdFromIndex(0) });
			} else if (index < state.sites.length - 1) {
				return updateState({ activeSiteId: getSiteIdFromIndex(index + 1) });
			}

			return state;
			
		case ACTIVE_SITE_DECR:
			index = getActiveSiteIndex();

			if (index < 0) {
				return updateState({ activeSiteId: getSiteIdFromIndex(0) });
			} else if (index > 0) {
				return updateState({ activeSiteId: getSiteIdFromIndex(index - 1) });
			}

			return state;

		default:
			return state;

	}
}