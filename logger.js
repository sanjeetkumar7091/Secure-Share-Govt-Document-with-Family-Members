const Logger = {
  log: function(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  },
  error: function(message) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`);
  }
};
