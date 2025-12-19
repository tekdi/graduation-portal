/// <reference path="../../types/custom-elements.d.ts" />
import React, { useEffect, useRef, useState } from 'react';
import logger from '@utils/logger';
import { ActivityIndicator } from 'react-native';

interface PlayerConfigProps {
  /**
   * Configuration object passed to questionnaire-player-main as `apiConfig`.
   * Expected shape (from questionnaire-webcomponent docs):
   * {
   *   baseURL: string;
   *   fileSizeLimit: number;
   *   userAuthToken: string;
   *   solutionId: string;
   *   solutionType: 'survey' | 'observation';
   * }
   */
  playerConfig: any;
  getProgress: (progress: number) => void;
}

const WebComponentPlayer: React.FC<PlayerConfigProps> = ({ playerConfig,getProgress }) => {
  const playerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false)

    if (!playerRef.current) {
      return;
    }

    const apiConfig = playerConfig?.apiConfig || playerConfig;
    if (!apiConfig) {
      logger.warn('No apiConfig provided to questionnaire-player-main');
      return;
    }

    // Dynamically load the questionnaire-player-webcomponent JS and both CSS files

    let playerScript: HTMLScriptElement | null = null;
    let mainCss: HTMLLinkElement | null = null;
    let themeCss: HTMLLinkElement | null = null;

    // Ensure we import the web component and its CSS once
    playerScript = document.createElement('script');
    playerScript.src = '/web-component/questionnaire-player-webcomponent.js';
    playerScript.async = true;
    document.body.appendChild(playerScript);

    // Main CSS for web component styles
    mainCss = document.createElement('link');
    mainCss.rel = 'stylesheet';
    mainCss.href = '/web-component/styles.css';
    document.head.appendChild(mainCss);

    // Theme CSS (for variable overrides)
    themeCss = document.createElement('link');
    themeCss.rel = 'stylesheet';
    themeCss.href = '/web-component/theme.css';
    document.head.appendChild(themeCss);

    // Material Icons CSS
    themeCss = document.createElement('link');
    themeCss.rel = 'stylesheet';
    themeCss.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(themeCss);
    const handleMessage = (event: any) => {
      logger.info('Message from WebComponentPlayer:', event.detail);
    };
    window.addEventListener('message', handleMessage);

    // Cleanup on unmount
    return () => {
      if (playerScript && document.body.contains(playerScript)) {
        document.body.removeChild(playerScript);
      }
      if (mainCss && document.head.contains(mainCss)) {
        document.head.removeChild(mainCss);
      }
      if (themeCss && document.head.contains(themeCss)) {
        document.head.removeChild(themeCss);
      }
    };

    // Assign config as property so the web component can read it
    // playerRef.current.apiConfig = apiConfig;
    // console.log('apiConfig', apiConfig);
  }, [playerConfig]);

  if(loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <div className="questionnaire-player-container" style={{ height: 'auto' }}>
      {/* @ts-ignore - Custom web component from questionnaire-webcomponent package */}
      <questionnaire-player-main
        ref={playerRef}
        apiconfig={JSON.stringify(playerConfig)}
      />
    </div>
  );
};

export default WebComponentPlayer;
