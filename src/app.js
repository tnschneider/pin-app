const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;

const path = require('path');
const url = require('url');

const {
	default: installExtension, 
	REACT_DEVELOPER_TOOLS, 
	REDUX_DEVTOOLS
} = require('electron-devtools-installer');

const Datastore = require('nedb');

const Repository = require('./core/repository.js');
const Constants = require('./core/constants.js');
const { IpcServer } = require('./core/ipc.js');

const db = {
	sites: new Datastore({ filename: Constants.DB_FILENAME_SITES, autoload: true }),
	settings: new Datastore({ filename: Constants.DB_FILENAME_SETTINGS, autoload: true })
};

const repo = new Repository(db);

const _ = new IpcServer(repo);

let mainWindow;

function createWindow() {

	mainWindow = new BrowserWindow({
		width: 1024, 
		height: 768,
		title: "Pin App",
		icon: './appicon256.png'
	});

	var tray = null;
	tray = new Tray('./appicon64.png');
	var contextMenu = Menu.buildFromTemplate([
			{ label: 'Quit', click: () => {
				app.isQuitting = true;
        		app.quit();
			} }
	]);
	tray.setToolTip('Pin App');
	tray.setContextMenu(contextMenu);
	tray.on('click', () => {
		mainWindow.show();
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, './main/index.html'),
		protocol: 'file:',
		slashes: true,
	}));

  	if(process.env.NODE_ENV === 'development') {

		mainWindow.webContents.openDevTools();
		
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));

		installExtension(REDUX_DEVTOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));

	}

	//hide the app to the tray on minimize
	mainWindow.on('minimize',function(event){
		event.preventDefault();
		mainWindow.hide();
	});
	
	//hide the app to the tray on close
	mainWindow.on('close', function (event) {
		if(!app.isQuitting){
			event.preventDefault();
			mainWindow.hide();
		}

		return false;
	});

  	mainWindow.on('closed', function() {
		mainWindow = null;
  	});
}

app.on('ready', createWindow);

//leave the app running on mac os only
app.on('window-all-closed', function() {
  	if (process.platform !== 'darwin') {
		app.quit();
  	}
});

app.on('activate', function() {
  	if (mainWindow === null) {
		createWindow();
  	}
});