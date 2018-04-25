import { IpcClient } from '../../../core/ipc.js';
import { Site } from '../../../core/models.js';

//action types
export const ADD_SITE = 'ADD_SITE';

//action creators
export function addSite(site) {
	let addedSite = IpcClient.addSite(new Site(site));
	
	return {
		type: ADD_SITE,
		payload: addedSite
	};
}
