const fs = require('fs');

class LogFile {
  constructor(path, flushInterval) {
    this.path = path;
    this.flushInterval = flushInterval;
    this.stream = null;
    this.timer = null;
  }

  open() {
    if (!this.stream) {
      this.stream = fs.createWriteStream(this.path, { flags: 'a' });
      this.stream.cork();
      this.startFlushTimer();
    }
  }

  write(data) {
    this.stream.write(data);
  }

  close() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.stream) {
      this.stream.uncork();
      this.stream.end();
      this.stream.close();
      this.stream = null;
    }
  }

  startFlushTimer() {
    this.timer = setTimeout(() => {
      this.stream.uncork();
      this.stream.cork();
      this.startFlushTimer();
    }, this.flushInterval);
  }
}

module.exports = LogFile;
