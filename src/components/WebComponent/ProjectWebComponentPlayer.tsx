import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { isWeb } from '../../utils/platform';

// Web-specific: Access DOM element from React Native Web View ref
const getDOMNode = (ref: any): HTMLElement | null => {
  if (!ref || typeof window === 'undefined') return null;

  // React Native Web exposes the DOM node in different ways depending on version
  // Try multiple methods to find the DOM node

  // Method 1: Direct node access
  if (ref._nativeNode) return ref._nativeNode;
  if (ref.node) return ref.node;

  // Method 2: React Native Web internal structure
  if (ref._internalFiberInstanceHandleDEV) {
    const fiber = ref._internalFiberInstanceHandleDEV;
    if (fiber.stateNode) return fiber.stateNode;
  }

  // Method 3: Try to find by traversing React internals
  if (ref._reactInternalFiber) {
    let fiber = ref._reactInternalFiber;
    while (fiber) {
      if (fiber.stateNode && fiber.stateNode.nodeType === 1) {
        return fiber.stateNode;
      }
      fiber = fiber.return;
    }
  }

  // Method 4: If ref is already a DOM element
  if (ref.nodeType === 1) return ref;

  return null;
};

interface PlayerConfigProps {
  playerConfig: any;
}

const WebComponentPlayer = ({ playerConfig }: PlayerConfigProps) => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<any>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const playerRef = useRef<HTMLElement | null>(null);

  // Web platform: Initialize web component directly
  const initializeWebPlayer = React.useCallback(() => {
    if (!isWeb || !playerConfig) {
      setLoading(false);
      alert('No player config');
      return;
    }

    if (!containerRef.current) {
      // Retry after a short delay if container is not ready
      setTimeout(() => {
        if (containerRef.current) {
          initializeWebPlayer();
        } else {
          setLoading(false);
        }
      }, 100);
      return;
    }

    try {
      const container = containerRef.current;
      if (!container) {
        setLoading(false);
        return;
      }

      // Create or get the player element
      let playerElement = playerRef.current;
      if (!playerElement) {
        playerElement = document.createElement('project-player');
        playerRef.current = playerElement;
      }

      // Set attributes
      playerElement.setAttribute(
        'projectdata',
        JSON.stringify(playerConfig.projectdata),
      );
      playerElement.setAttribute(
        'previewmode',
        JSON.stringify(playerConfig.previewmode),
      );

      // Add event listeners
      const handlePlayerEvent = (event: any) => {
        if (event && event.detail) {
          console.log('Player event received:', event.detail);
          if (event.detail.edata && event.detail.edata.type === 'EXIT') {
            event.preventDefault();
          }
        }
      };

      const handleTelemetryEvent = (event: any) => {
        if (event && event.detail) {
          console.log('Telemetry event received:', event.detail);
        }
      };

      playerElement.addEventListener('playerEvent', handlePlayerEvent);
      playerElement.addEventListener('telemetryEvent', handleTelemetryEvent);

      // Append to container if not already appended
      if (!container.contains(playerElement)) {
        container.innerHTML = '';
        container.appendChild(playerElement);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error initializing web player:', error);
      setLoading(false);
    }
  }, [playerConfig]);

  // Web platform: Wait for custom element and initialize
  useEffect(() => {
    if (!isWeb || !playerConfig) {
      setLoading(false);
      return;
    }

    // Set a timeout to ensure loading is set to false even if custom element never loads
    const timeoutId = setTimeout(() => {
      console.warn('Custom element project-player not defined after 5 seconds');
      setLoading(false);
    }, 5000);

    const initPlayer = () => {
      clearTimeout(timeoutId);
      initializeWebPlayer();
    };

    // Wait for custom element to be defined
    if (customElements.get('project-player')) {
      initPlayer();
    } else {
      customElements
        .whenDefined('project-player')
        .then(() => {
          initPlayer();
        })
        .catch(error => {
          console.error('Error waiting for custom element:', error);
          clearTimeout(timeoutId);
          setLoading(false);
        });
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [playerConfig, initializeWebPlayer]);

  // Native platform: Inject into WebView
  useEffect(() => {
    if (!isWeb) {
      // Wait a bit for WebView to be ready, then inject the player config
      const timer = setTimeout(() => {
        if (webViewRef.current && playerConfig) {
          const injectedJS = `
          (function() {
            try {
              const videoElement = document.createElement('project-player');
              videoElement.setAttribute('projectdata', '${JSON.stringify(
                playerConfig.projectdata,
              )?.replace(/'/g, "\\'")}');
              videoElement.setAttribute('previewmode', '${JSON.stringify(
                playerConfig.previewmode,
              )?.replace(/'/g, "\\'")}');
              
              // Send events back to React Native
              videoElement.addEventListener('playerEvent', function(event) {
                if (event && event.detail) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'playerEvent',
                    data: event.detail
                  }));
                  
                  if (event.detail.edata && event.detail.edata.type === 'EXIT') {
                    event.preventDefault();
                  }
                }
              });
              
              videoElement.addEventListener('telemetryEvent', function(event) {
                if (event && event.detail) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'telemetryEvent',
                    data: event.detail
                  }));
                }
              });
              
              const myPlayer = document.getElementById('my-player');
              if (myPlayer) {
                myPlayer.innerHTML = '';
                myPlayer.appendChild(videoElement);
              } else {
                console.error('my-player element not found');
              }
            } catch (error) {
              console.error('Error initializing player:', error);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'error',
                data: error.toString()
              }));
            }
          })();
          true;
        `;

          webViewRef.current.injectJavaScript(injectedJS);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [playerConfig]);

  const handleMessage = (event: any) => {
    if (isWeb) {
      // Web platform handles events directly via DOM events
      return;
    }

    try {
      const message = JSON.parse(event.nativeEvent.data);
      console.log('Message from WebView:', message);

      if (message.type === 'playerEvent') {
        console.log('Player event received:', message.data);
        if (message.data?.edata?.type === 'EXIT') {
          console.log('Player exit event received');
          // Handle exit event - you can add navigation logic here
        }
      } else if (message.type === 'telemetryEvent') {
        console.log('Telemetry event received:', message.data);
        // Handle telemetry events
      } else if (message.type === 'error') {
        console.error('WebView error:', message.data);
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  // Web platform: Render web component directly
  if (isWeb) {
    return (
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading Player...</Text>
          </View>
        )}
        <View
          ref={(ref: any) => {
            if (isWeb && ref) {
              // On web, get the DOM node from the React Native Web View ref
              const domNode = getDOMNode(ref);
              if (domNode && !containerRef.current) {
                containerRef.current = domNode;
                // Trigger initialization when container is ready
                if (playerConfig) {
                  // Use setTimeout to ensure DOM is ready
                  setTimeout(() => {
                    if (customElements.get('project-player')) {
                      initializeWebPlayer();
                    } else {
                      customElements
                        .whenDefined('project-player')
                        .then(() => {
                          initializeWebPlayer();
                        })
                        .catch(error => {
                          console.error(
                            'Error waiting for custom element in ref:',
                            error,
                          );
                          setLoading(false);
                        });
                    }
                  }, 0);
                } else {
                  // No playerConfig, set loading to false
                  setLoading(false);
                }
              } else if (!domNode && isWeb) {
                // If we can't get DOM node, try alternative approach
                // Set a timeout to retry or give up
                setTimeout(() => {
                  if (!containerRef.current) {
                    console.warn(
                      'Could not access DOM node for web player container',
                    );
                    setLoading(false);
                  }
                }, 1000);
              }
            }
          }}
          style={styles.webContainer}
        />
      </View>
    );
  }

  // Native platform: Use WebView
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading Player...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{
          uri: 'file:///android_asset/project-player-dist/index.html',
        }}
        style={styles.webView}
        onLoadEnd={() => setLoading(false)}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    minHeight: 400,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default WebComponentPlayer;
