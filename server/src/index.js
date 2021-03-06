import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import moment from 'moment';
import morgan from 'morgan';
import socketio from 'socket.io';
import uuid from 'uuid/v4';

const app = express();
app.use(bodyParser.json());
morgan.token('body', function (req) { return JSON.stringify(req.body) });
app.use(morgan(':method :url :status :body - :response-time ms'));
app.use(cors());

const server = http.Server(app);
const io = socketio(server);

const posts = [
  {
    id: uuid(),
    text: 'Ullamcorper sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras mattis consectetur purus sit amet fermentum.',
    timeCreated: '2017-04-16T11:27:39-04:00',
    isBot: false
  },
  {
    id: uuid(),
    text: 'Curabitur blandit tempus porttitor.',
    timeCreated: '2017-04-14T11:27:13-04:00',
    isBot: false
  },
];

app.get('/', (request, response) => {
  response.send('working');
});

app.get('/api/posts', (request, response) => {
  response.json(posts);
});

io.on('connection', () => {
  console.log('client connected');
});

app.post('/api/posts', (request, response) => {
  // console.log('request body: ', request.body);
  const post = {
    id: uuid(),
    text: request.body.text,
    timeCreated: moment().format(),
    isBot: request.body.isBot
  }
  posts.unshift(post);
  io.emit('newPost', post);
  response.json(post);
});

server.listen(8082, () => {
  console.log('Listening on 8082');
});
