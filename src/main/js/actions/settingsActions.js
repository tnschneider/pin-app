import { IpcClient } from '../../../core/ipc.js';
import { Site } from '../../../core/models.js';

const client = new IpcClient();

//action types
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

//action creators
export function updateSettings(settings) {
	let updatedSettings = client.updateSettings(settings);
	
	return {
		type: UPDATE_SETTINGS,
		payload: updatedSettings
	};
}
