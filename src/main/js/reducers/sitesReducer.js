import { ADD_SITE } from '../actions/siteActions.js';

const INITIAL_STATE = { sites: [], activeSiteId: null };

export default function(state = INITIAL_STATE, action) {
	switch(action.type) {
		case ADD_SITE:
			state.sites.push(action.payload);
			return Object.assign({}, state);
	}
	return state;
}