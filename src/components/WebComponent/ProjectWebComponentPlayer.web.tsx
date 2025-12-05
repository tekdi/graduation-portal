/// <reference path="../../types/custom-elements.d.ts" />
// import { getTelemetryEvents, handleExitEvent } from '@workspace/utils/Helper';
import React, { useEffect, useRef } from 'react';
import '../../../project-player-dist/main.js';
import logger from '@utils/logger';
import { Box } from '@ui';

interface PlayerConfigProps {
  playerConfig: any;
}

const WebComponentPlayer = ({ playerConfig }: PlayerConfigProps) => {
  const WebComponentPlayerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let playerScript: HTMLScriptElement | null = null;
    let cssLink: HTMLLinkElement | null = null;
    let playerElement: HTMLElement | null = null;

    const handlePlayerEvent = (event: any) => {
      logger.info('Player Event', event.detail);
      if (event?.detail?.type === 'EXIT') {
        // handleExitEvent();
      }
    };

    const handleTelemetryEvent = (event: any) => {
      logger.info('Telemetry Event', event.detail);
      // getTelemetryEvents(event.detail, 'video');
    };

    // Load the player script directly (no jQuery)
    playerScript = document.createElement('script');
    playerScript.async = true;
    document.body.appendChild(playerScript);

    cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '/projectWebJs/styles.css';
    document.head.appendChild(cssLink);

    playerElement = WebComponentPlayerRef.current;

    // Ensure the script has loaded before adding event listeners
    playerScript.onload = () => {
      playerElement?.addEventListener('playerEvent', handlePlayerEvent);
      playerElement?.addEventListener('telemetryEvent', handleTelemetryEvent);
    };

    return () => {
      // Remove event listeners
      playerElement?.removeEventListener('playerEvent', handlePlayerEvent);
      playerElement?.removeEventListener(
        'telemetryEvent',
        handleTelemetryEvent,
      );

      // Remove the scripts and CSS link
      if (playerScript && document.body.contains(playerScript)) {
        document.body.removeChild(playerScript);
      }
      if (cssLink && document.head.contains(cssLink)) {
        document.head.removeChild(cssLink);
      }
    };
  }, []);

  return (
    <Box height="auto">
      {/* @ts-ignore - Custom web component */}
      <project-player
        // ={JSON.stringify(playerConfig.)}
        // label="Hello"
        projectdata={JSON.stringify(playerConfig.projectdata)}
        ref={WebComponentPlayerRef}
      />
    </Box>
  );
};

export default WebComponentPlayer;
