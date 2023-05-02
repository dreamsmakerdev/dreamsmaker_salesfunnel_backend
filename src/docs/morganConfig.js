const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const createFile = (newPath) => {
  if (!fs.existsSync(newPath)) {
    fs.closeSync(fs.openSync(newPath, 'w'));
  }
};

morgan.token('req-headers-length', (req) => Object.keys(req.headers).length);

morgan.token('req-headers', (req) => JSON.stringify(req.headers));

morgan.token('body', (req) => {
  const body = JSON.stringify(req.body);
  if (body.length > 150) {
    return `${body.substring(0, 150)}...`;
  }
  return body;
});

morgan.token('ip', (req) => {
  const forwardedIpsStr =
    req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  let IP = 'NA';

  if (forwardedIpsStr) {
    IP = forwardedps = forwardedIpsStr.split(',')[0];
  }
  return IP;
});

morgan.token('path', (req) => {
  const allPathParams = req.params;

  if (allPathParams) {
    return JSON.stringify(allPathParams);
  }

  return '';
});

morgan.token('query', (req, res) => {
  const allQueryParams = req.query;

  if (allQueryParams) {
    return JSON.stringify(allQueryParams);
  }

  return '';
});

/**
 * The final prepared morgan format
 * @returns {string} Morgan config in json form.
 */
const accessLogFormat = () =>
  JSON.stringify({
    method: ':method',
    url: ':url',
    http_version: ':http-version',
    response_time: ':response-time',
    status: ':status',
    content_length: ':res[content-length]',
    timestamp: ':date[iso]',
    headers_count: ':req-headers-length',
    ip: ':ip',
  });

/**
 * The final prepared morgan format
 * @returns {string} Morgan config in json form.
 */
const errorLogFormat = () =>
  JSON.stringify({
    method: ':method',
    url: ':url',
    http_version: ':http-version',
    response_time: ':response-time',
    status: ':status',
    content_length: ':res[content-length]',
    timestamp: ':date[iso]',
    headers_count: ':req-headers-length',
    ip: ':ip',
    path: ':path',
    query: ':query',
    body: ':body',
  });

createFile('app.error.log');
createFile('app.access.log');

const errorLogStream = fs.createWriteStream(path.join('app.error.log'), {
  flags: 'a+',
});

const accessLogStream = fs.createWriteStream(path.join('app.access.log'), {
  flags: 'a+',
});

const errorLogger = morgan(errorLogFormat(), {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode < 400,
});

const accessLogger = morgan(accessLogFormat(), {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode >= 400,
});

module.exports = {
  errorLogger,
  accessLogger,
};
