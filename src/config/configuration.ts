import { ConfigLoader } from './config.loader';

// Export the validated configuration using our new loader
export default () => {
  return ConfigLoader.load();
};
