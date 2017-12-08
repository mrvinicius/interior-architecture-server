const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const models = require('./models');
const env = process.env.NODE_ENV || 'development';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function () {
	return function (req, res, next) {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect(
				['https://', req.get('Host'), req.url].join('')
			);
		}
		next();
	}
}

if (env !== 'development') {
	// Instruct the app
	// to use the forceSSL
	// middleware
	app.use(forceSSL());
}

require('./routes')(app);

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/public'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});

const server = http.createServer(app);
models.sequelize.sync().then(() => {
	/**
	 * Listen on provided port, on all network interfaces.
	 */
	server.listen(port, () => {
		console.log(`The server is running at localhost:${port}`);
	});
	server.on('error', onError);
	// server.on('listening', onListening);
});

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	// debug('Listening on ' + bind);
}
