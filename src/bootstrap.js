((document) => {
    if(process.env.NODE_ENV) {
        const bundle = document.createElement('script');
        const port = 8080;
        bundle.src = 'http://localhost:' + port + '/bundle.js';
        document.body.appendChild(bundle);

        const devServer = document.createElement('script');
        devServer.src = 'http://localhost:' + port + '/webpack-dev-server.js';
        document.body.appendChild(devServer);
    } else {
        const bundle = document.createElement('script');
        bundle.src = 'bundle.js';
        document.body.appendChild(bundle);
    }
})(document);