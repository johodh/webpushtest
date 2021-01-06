import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import database from './config/database';
import initializeRoutes from './routes';
import webpush from './config/webpush';
import * as WebSocket from 'ws';

const app = express();
const port = 8080; // default port to listen

app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.json());

database();
initializeRoutes(app);
webpush();

// start the Express server
app.listen(port, 'localhost', () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ port: 8081 }); 

wss.on('connection', (ws: WebSocket) => { 
	console.log('got connection!');
	//connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    //ws.send('Hi there, I am a WebSocket server');

    setInterval(function() { 
	    ws.send(150+Math.random()+2)
    }, 1000);

});

