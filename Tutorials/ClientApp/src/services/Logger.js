// Logger utility that wraps console methods and sends logs to New Relic
const Logger = {
  log: (message, ...args) => {
    console.log(message, ...args);
    if (window.newrelic) {
      window.newrelic.log(message, { level: 'debug', ...args });
    }
  },

  info: (message, ...args) => {
    console.info(message, ...args);
    if (window.newrelic) {
      window.newrelic.log(message, { level: 'info', ...args });
    }
  },

  warn: (message, ...args) => {
    console.warn(message, ...args);
    if (window.newrelic) {
      window.newrelic.log(message, { level: 'warn', ...args });
    }
  },

  error: (message, ...args) => {
    console.error(message, ...args);
    if (window.newrelic) {
      window.newrelic.log(message, { level: 'error', ...args });
    }
  }
};

export default Logger; 