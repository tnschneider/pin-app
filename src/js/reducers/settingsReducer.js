import { UPDATE_SETTINGS } from '../actions/settingsActions.js';

const INITIAL_STATE = { settings: {} };

export default function(state = INITIAL_STATE, action) {
	switch(action.type) {
		case UPDATE_SETTINGS:
			return { ...state, settings: action.payload };
	}
	return state;
}
