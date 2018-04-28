const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;

const path = require('path');
const url = require('url');

const isProd = process.env.NODE_ENV !== 'development';

let installDevTools = () => { console.log("Not installing devtools in production."); };

if (!isProd) {
	const {
		default: installExtension, 
		REACT_DEVELOPER_TOOLS, 
		REDUX_DEVTOOLS
	} = require('electron-devtools-installer');
	
	installDevTools = () => {
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));

		installExtension(REDUX_DEVTOOLS)
			.then((name) => console.log(`Added Extension:  ${name}`))
			.catch((err) => console.log('An error occurred: ', err));
	}	
}


const Datastore = require('nedb');

const Repository = require('./shared/repository.js');
const Constants = require('./shared/constants.js');
const { IpcServer } = require('./shared/ipc.js');

const getUserDataPath = (filePath) => path.join(app.getPath('userData'), filePath);

const db = {
	sites: new Datastore({ filename: getUserDataPath(Constants.DB_FILENAME_SITES), autoload: true }),
	settings: new Datastore({ filename: getUserDataPath(Constants.DB_FILENAME_SETTINGS), autoload: true })
};

const repo = new Repository(db);

const _ = new IpcServer(repo);

let mainWindow;

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
	if (mainWindow) {
	  	if (mainWindow.isMinimized()) mainWindow.restore()
	  	mainWindow.focus()
	}
})
  
if (isSecondInstance) {
	app.quit()
}

const createWindow = () => {
	const getIconPath = (px) => {
		return path.join(__dirname, `${isProd ? '.' : '../assets'}/icon${px}.png`);
	}

	mainWindow = new BrowserWindow({
		width: 1024, 
		height: 768,
		title: "Safety Pin",
		icon: getIconPath(256)
	});

	var tray = null;
	tray = new Tray(getIconPath(64));
	var contextMenu = Menu.buildFromTemplate([
			{ label: 'Quit', click: () => {
				app.isQuitting = true;
        		app.quit();
			} }
	]);
	tray.setToolTip('Safety Pin');
	tray.setContextMenu(contextMenu);
	tray.on('click', () => {
		mainWindow.show();
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, './index.html'),
		protocol: 'file:',
		slashes: true,
	}));

  	if(!isProd) {

		mainWindow.webContents.openDevTools();
		
		installDevTools();

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