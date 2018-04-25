import { ipcMain, ipcRenderer } from 'electron';

const MessageTypes = {
    GET_SITES = 'GET_SITES',
    ADD_SITE = 'ADD_SITE',
    DELETE_SITE = 'DELETE_SITE',
    STASH_SITE = 'STASH_SITE',
    UNSTASH_SITE = 'UNSTASH_SITE',
    GET_APP_SETTINGS = 'GET_APP_SETTINGS',
    UPDATE_APP_SETTINGS = 'UPDATE_APP_SETTINGS'
}

class IpcServer {
    constructor(props) {
        this.repo = props.repo;
        
        ipcMain.on(MessageTypes.GET_SITES, function(event, arg) {
            //this.repo.doSomething(arg);
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.ADD_SITE, function(event, arg) {
            //this.repo.doSomething(arg);
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.DELETE_SITE, function(event, arg) {
            //this.repo.doSomething(arg);
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.STASH_SITE, function(event, arg) {
            //this.repo.doSomething(arg);
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.UNSTASH_SITE, function(event, arg) {
            //this.repo.doSomething(arg);
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.GET_APP_SETTINGS, function(event, arg) {
            //this.repo.doSomething(arg);
            event.returnValue = true;
        });
    
        ipcMain.on(MessageTypes.UPDATE_APP_SETTINGS, function(event, arg) {
            //this.repo.doSomething(arg);
            event.returnValue = true;
        });
    }
}

class IpcClient {
    getSites() {
        return ipcRenderer.sendSync(MessageTypes.GET_SITES);
    }

    addSite(site) {
        return ipcRenderer.sendSync(MessageTypes.ADD_SITE, { site: site });
    }

    deleteSite(site) {
        return ipcRenderer.sendSync(MessageTypes.DELETE_SITE, { site: site });
    }

    stashSite(site) {
        return ipcRenderer.sendSync(MessageTypes.STASH_SITE, { site: site });
    }

    unstashSite(site) {
        return ipcRenderer.sendSync(MessageTypes.UNSTASH_SITE, { site: site });
    }

    getAppSettings() {
        return ipcRenderer.sendSync(MessageTypes.GET_APP_SETTINGS);
    }

    updateAppSettings(site) {
        return ipcRenderer.sendSync(MessageTypes.UPDATE_APP_SETTINGS, { appSettings: appSettings });
    }
}

export {
    IpcServer,
    IpcClient
}