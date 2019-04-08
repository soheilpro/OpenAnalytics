const LogFile = require('./logfile');
const Server = require('./server');

const port = process.argv[2];
const output = process.argv[3];

const logFile = new LogFile(output, 5000);
const server = new Server(port);

console.log(`Process started. PID=${process.pid}`);

process.on('SIGTERM', () => {
  console.log(`SIGTERM: Quitting...`);
  server.stop();
  logFile.close();
});

process.on('SIGINT', () => {
  console.log(`SIGINT: Quitting...`);
  server.stop();
  logFile.close();
  process.exit();
});

process.on('SIGUSR1', () => {
  console.log(`SIGUSR1: Reopening the log file...`);
  logFile.close();
  logFile.open();
});

server.on('start', () => {
  console.log(`Server started. Port=${port}`);
  logFile.open();
});

server.on('event', (dateTime, ip, data) => {
  logFile.write(`\n@server_time=${dateTime} @client_ip=${ip} `, 'ascii')

  for (let i = 0; i < data.length; i++)
    logFile.write(data[i]);
});

server.start();
