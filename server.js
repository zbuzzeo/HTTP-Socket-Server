'use strict';

const net = require('net');
const get404 = require('./content_404');
const getHelium = require('./content_helium');
const getHydrogen = require('./content_hydrogen');
const getIndex = require('./content_index');
const getStyles = require('./content_styles');

// this creates a server
const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    const path404 = {
      content: get404.HTML404,
      type: 'text/html'
    };

    const pathHelium = {
      content: getHelium.HTMLHelium,
      type: 'text/html'
    };

    const pathHydrogen = {
      content: getHydrogen.HTMLHydrogen,
      type: 'text/html'
    };

    const pathIndex = {
      content: getIndex.HTMLIndex,
      type: 'text/html'
    };

    const pathStyles = {
      content: getStyles.contentStyles,
      type: 'text/css'
    };

    let response = '';
    let start = 4;
    let filePath = data.slice(start, data.search('HTTP') - 1);
    let requestedPath;

    if (data.charAt(0) !== 'G') {
      start = 5;
    }

    const formatResponse = (errorCode, contentType, contentLength, fileBody) => {
      response = `${errorCode}
      Server: nginx/1.4.6 (Ubuntu)
      Date: ${new Date().toUTCString()}
      Content-Type: ${contentType}; charset=utf-8
      Content-Length: ${contentLength}
      Connection: keep-alive

      ${fileBody}`;

      return response;
    }

    if (filePath === '/404.html') {
      requestedPath = path404;

    } else if (filePath === '/helium.html') {
      requestedPath = pathHelium;

    } else if (filePath === '/hydrogen.html') {
      requestedPath = pathHydrogen;

    } else if (filePath === '/' || filePath === '/index.html') {
      requestedPath = pathIndex;

    } else if (filePath === '/css/styles.css') {
      requestedPath = pathStyles;

    } else {
      formatResponse('HTTP/1.1 404 Not Found', '', '', 'Invalid file path');
      socket.end(response);

    }

    formatResponse(
      'HTTP/1.1 200 OK', 
      requestedPath.type, 
      requestedPath.content.length, 
      requestedPath.content
      );

    socket.end(response);
  });
})
  // handle errors on the server
  .on('error', (err) => {
    console.log(err);
  });

// this starts the server
server.listen(8080, () => {
  console.log('Server is UP');
});