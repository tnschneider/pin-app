const { ipcMain, ipcRenderer } = require('electron');

const MessageTypes = {
    GET_SITES: 'GET_SITES',
    ADD_SITE: 'ADD_SITE',
    DELETE_SITE: 'DELETE_SITE',
    STASH_SITE: 'STASH_SITE',
    UNSTASH_SITE: 'UNSTASH_SITE',
    GET_APP_SETTINGS: 'GET_APP_SETTINGS',
    UPDATE_APP_SETTINGS: 'UPDATE_APP_SETTINGS'
}

class IpcServer {
    constructor(repo) {
        this.repo = repo;
        
        ipcMain.on(MessageTypes.GET_SITES, async (event) => {
            event.returnValue = await this.repo.getSites();
        });
    
        ipcMain.on(MessageTypes.ADD_SITE, async (event, site) => {
            event.returnValue = await this.repo.addSite(site);
        });
    
        ipcMain.on(MessageTypes.DELETE_SITE, async (event, id) => {
            event.returnValue = await this.repo.deleteSite(id);
        });
    
        ipcMain.on(MessageTypes.STASH_SITE, (event, id) => {
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.UNSTASH_SITE, (event, id) => {
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.GET_APP_SETTINGS, (event) => {
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.UPDATE_APP_SETTINGS, (event, appSettings) => {
            event.returnValue = true;
        });
    }
}

const IpcClient = {
    getSites: () => {
        return this._send(MessageTypes.GET_SITES);
    },

    addSite: (site) => {
        return this._send(MessageTypes.ADD_SITE, site);
    },

    deleteSite: (id) => {
        return this._send(MessageTypes.DELETE_SITE, id);
    },

    stashSite: (id) => {
        return this._send(MessageTypes.STASH_SITE, id);
    },

    unstashSite: (id) => {
        return this._send(MessageTypes.UNSTASH_SITE, id);
    },

    getAppSettings: () => {
        return this._send(MessageTypes.GET_APP_SETTINGS);
    },

    updateAppSettings: (appSettings) => {
        return this._send(MessageTypes.UPDATE_APP_SETTINGS, appSettings);
    },

    _send: (type, payload) => {
        return ipcRenderer.sendSync(type, payload);
    }
}

module.exports = {
    IpcServer,
    IpcClient
}