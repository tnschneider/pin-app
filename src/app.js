const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;

const path = require('path');
const url = require('url');

const isProd = process.env.NODE_ENV !== 'development';

const Datastore = require('nedb');
const JsonDatastore = require('./shared/jsonDatastore.js');
const { Settings } = require('./shared/models.js');

const Repository = require('./shared/repository.js');
const Constants = require('./shared/constants.js');
const { IpcServer } = require('./shared/ipc.js');

const getUserDataPath = (filePath) => path.join(app.getPath('userData'), filePath);

const repo = new Repository({
	pages: new Datastore({ filename: getUserDataPath(Constants.DB_FILENAME_PAGES), autoload: true }),
	settings: new JsonDatastore({ filepath: getUserDataPath(Constants.JSON_FILENAME_SETTINGS), mapper: (data) => new Settings(data) })
});

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

const quitApplication = () => {
	var promise = Promise.resolve();
	
	if (mainWindow) {
		let bounds = mainWindow.getBounds();
		promise = repo.patchSettings({
			windowBounds: bounds
		})
	}
	
	promise.then(() => {
		app.isQuitting = true;
		app.quit();
	});
}

const createWindow = async () => {
	const getIconPath = (px) => {
		return path.join(__dirname, `${isProd ? '.' : '../assets'}/icon${px}.png`);
	}

	const settings = await repo.getSettings();
	
	const screenWorkArea = electron.screen.getPrimaryDisplay().workAreaSize;
	const screenHeight = screenWorkArea.height;
	const screenWidth = screenWorkArea.width;

	const {
		width,
		height,
		x, y
	} = settings.windowBounds;

	let newWidth = Math.min(width, screenWidth);
	let newHeight = Math.min(height, screenHeight);
	let newX = Math.max(Math.min(x, screenWidth - newWidth), 0);
	let newY = Math.max(Math.min(y, screenHeight - newHeight), 0);

	console.log(width, height, x, y, newWidth, newHeight, newX, newY);

	mainWindow = new BrowserWindow({
		width: newWidth, 
		height: newHeight,
		x: newX,
		y: newY,
		title: "Safety Pin",
		icon: getIconPath(256)
	});

	var tray = new Tray(getIconPath(64));

	var contextMenu = Menu.buildFromTemplate([
		{ label: 'Quit', click: quitApplication }
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
		const {
			default: installExtension, 
			REACT_DEVELOPER_TOOLS, 
			REDUX_DEVTOOLS
		} = require('electron-devtools-installer');
		
		installExtension(REACT_DEVELOPER_TOOLS)
			.then((name) => console.info(`Added Extension:  ${name}`))
			.catch((err) => console.error('An error occurred: ', err));

		installExtension(REDUX_DEVTOOLS)
			.then((name) => console.info(`Added Extension:  ${name}`))
			.catch((err) => console.error('An error occurred: ', err));

		mainWindow.webContents.openDevTools();
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
	  
	electron.screen.on('display-removed', () => {
		mainWindow.center();
	})
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