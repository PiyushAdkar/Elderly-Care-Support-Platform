export const logger = (message) => {
  // In a real app, this could use Winston or Morgan
  console.log(`[LOGGER] ${new Date().toISOString()}: ${message}`);
};
