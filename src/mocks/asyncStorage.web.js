// Web-compatible AsyncStorage mock for web component
// The web component uses IndexedDB directly, so this is just a fallback mock
const AsyncStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
  clear: async () => {},
  getAllKeys: async () => [],
  multiGet: async () => [],
  multiSet: async () => {},
  multiRemove: async () => {},
};

export default AsyncStorage;
