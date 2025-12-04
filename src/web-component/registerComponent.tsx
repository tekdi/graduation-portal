import React from 'react';
import ReactDOM from 'react-dom/client';
import r2wc from 'react-to-webcomponent';
import ProjectPlayer from './ProjectPlayer';
import { GluestackUIProvider } from '@ui';
import { config } from '@gluestack-ui/config';

interface ProjectPlayerProps {
  previewmode?: string;
  data?: string;
  projectdata?: string;
}

const WrappedProjectPlayer = (props: ProjectPlayerProps) => (
  <GluestackUIProvider config={config}>
    <ProjectPlayer {...props} />
  </GluestackUIProvider>
);
const WebProjectPlayer = r2wc(WrappedProjectPlayer, React, ReactDOM, {
  props: { previewmode: 'string', data: 'string', projectdata: 'string' },
});

// ✅ Safely define the custom element only once
if (!customElements.get('project-player')) {
  customElements.define('project-player', WebProjectPlayer);
}
