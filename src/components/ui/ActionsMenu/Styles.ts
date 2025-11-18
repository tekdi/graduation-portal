import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    padding: 8,
    borderRadius: 4,
  },
  // Backdrop styles for web
  backdropWeb: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  // Backdrop styles for native
  backdropNative: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  // Menu dropdown styles
  dropdownMenu: {
    position: 'absolute' as any,
    top: 35,
    right: 0,
    zIndex: 10000,
    minWidth: 180,
  },
});

// Helper function to get platform-specific backdrop style
export const getBackdropStyle = () => {
  return Platform.OS === 'web' ? styles.backdropWeb : styles.backdropNative;
};

// Helper function to get menu dropdown style
export const getDropdownStyle = () => {
  return styles.dropdownMenu;
};
