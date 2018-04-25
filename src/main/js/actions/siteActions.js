import { IpcClient } from '../../../core/ipc.js';
import { Site } from '../../../core/models.js';

//action types
export const ADD_SITE = 'ADD_SITE';
export const DELETE_SITE = 'DELETE_SITE';
export const SET_ACTIVE_SITE_ID = 'SET_ACTIVE_SITE_ID';

//action creators
export function addSite(site) {
	let addedSite = IpcClient.addSite(new Site(site));

	return {
		type: ADD_SITE,
		payload: addedSite
	};
}

export function deleteSite(id) {
	let deletedSite = client.deleteSite(id);
	
	return {
		type: DELETE_SITE,
		payload: id
	};
}

export function setActiveSiteId(id) {
	return {
		type: SET_ACTIVE_SITE_ID,
		payload: id
	};
}