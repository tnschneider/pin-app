import { IpcClient } from 'shared/ipc.js';
import { Page } from 'shared/models.js';

//action types
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

//action creators
export function updateSettings(settings) {
	let updatedSettings = IpcClient.updateSettings(settings);
	
	return {
		type: UPDATE_SETTINGS,
		payload: updatedSettings
	};
}
