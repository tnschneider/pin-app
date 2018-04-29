const { ipcMain, ipcRenderer } = require('electron');
const { Page } = require('./models.js');

const MessageTypes = {
    GET_PAGES: 'GET_PAGES',
    ADD_PAGE: 'ADD_PAGE',
    DELETE_PAGE: 'DELETE_PAGE',
    GET_APP_SETTINGS: 'GET_APP_SETTINGS',
    SET_APP_SETTINGS: 'SET_APP_SETTINGS',
    PATCH_APP_SETTINGS: 'PATCH_APP_SETTINGS',
    UPDATE_PAGE_URL: 'UPDATE_PAGE_URL',
    SET_SORT_ORDER: 'SET_SORT_ORDER'
}

class IpcServer {
    constructor(repo) {
        this.repo = repo;
        
        ipcMain.on(MessageTypes.GET_PAGES, async (event) => {
            event.returnValue = await this.repo.getPages();
        });
    
        ipcMain.on(MessageTypes.ADD_PAGE, async (event, page) => {
            event.returnValue = await this.repo.addPage(page);
        });
    
        ipcMain.on(MessageTypes.DELETE_PAGE, async (event, id) => {
            event.returnValue = await this.repo.deletePage(id);
        });

        ipcMain.on(MessageTypes.UPDATE_PAGE_URL, async (event, payload) => {
            event.returnValue = await this.repo.updatePageUrl(payload.id, payload.url);
        });

        ipcMain.on(MessageTypes.SET_SORT_ORDER, async (event, sortOrder) => {
            event.returnValue = await this.repo.setSortOrder(sortOrder);
        });
    
        ipcMain.on(MessageTypes.GET_APP_SETTINGS, async (event) => {
            event.returnValue = await this.repo.getSettings();
        });
    
        ipcMain.on(MessageTypes.SET_APP_SETTINGS, async (event, appSettings) => {
            event.returnValue = await this.repo.setSettings(appSettings);
        });

        ipcMain.on(MessageTypes.PATCH_APP_SETTINGS, async (event, appSettings) => {
            event.returnValue = await this.repo.patchSettings(appSettings);
        });
    }
}

const IpcClient = {
    getPages: () => {
        return IpcClient._send(MessageTypes.GET_PAGES).map(x => new Page(x));
    },

    addPage: (page) => {
        return new Page(IpcClient._send(MessageTypes.ADD_PAGE, page));
    },

    deletePage: (id) => {
        return IpcClient._send(MessageTypes.DELETE_PAGE, id);
    },

    updatePageUrl: (id, url) => {
        return IpcClient._send(MessageTypes.UPDATE_PAGE_URL, { id, url });
    },

    setSortOrder: (sortOrder) => {
        return IpcClient._send(MessageTypes.SET_SORT_ORDER, { sortOrder });
    },

    getAppSettings: () => {
        return IpcClient._send(MessageTypes.GET_APP_SETTINGS);
    },

    setAppSettings: (appSettings) => {
        return IpcClient._send(MessageTypes.SET_APP_SETTINGS, appSettings);
    },

    patchAppSettings: (appSettings) => {
        return IpcClient._send(MessageTypes.PATCH_APP_SETTINGS, appSettings);
    },

    _send: (type, payload) => {
        return ipcRenderer.sendSync(type, payload);
    }
}

module.exports = {
    IpcServer,
    IpcClient
}