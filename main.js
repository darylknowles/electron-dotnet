const { ConnectionBuilder } = require("electron-cgi");
const url = require("url");
const path = require("path");

const app = require('electron').app; 
const BrowserWindow = require('electron').BrowserWindow; 

let window;

// const connection = new ConnectionBuilder()
//     .connectTo("dotnet", "run", "--project", "./core/Core")
//     .build();

const connection = new ConnectionBuilder()
    .connectTo("./core/bin/Debug/netcoreapp3.0/electron-dotnet.exe")
    .build();

connection.onDisconnect = () => {
    console.log("lost");
};

connection.send("greeting", "World", (response) => {
    window.webContents.send("greeting", response);
    console.log(response);
    connection.close();
});

// const max = 1199999; 
const max = 2000000; 

connection.send("runloop", max, (response) => {    
    console.log(response);
    connection.close();
});

const createWindow = () => {
    window = new BrowserWindow({ width: 800, height: 600 });

    window.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true,
        }),
    );

    window.on("closed", () => {
        window = null;
    });
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (window === null) {
        createWindow();
    }
});
