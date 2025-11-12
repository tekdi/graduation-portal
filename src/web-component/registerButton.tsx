// src/web/registerMyButton.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import r2wc from 'react-to-webcomponent';
import { MyButton } from './Button';
import ProjectPlayer from './ProjectPlayer';
import { GluestackUIProvider } from '@ui';
import { config } from '@gluestack-ui/config';
const WrappedProjectPlayer = (props: any) => (
  <GluestackUIProvider config={config}>
    <ProjectPlayer {...props} />
  </GluestackUIProvider>
);
const WebProjectPlayer = r2wc(WrappedProjectPlayer, React, ReactDOM, {
  props: { previewmode: 'string', data: 'string', projectdata: 'string' },
});

const WrappedMyButton = (props: any) => (
  <GluestackUIProvider config={config}>
    <MyButton {...props} />
  </GluestackUIProvider>
);
const WebMyButton = r2wc(WrappedMyButton, React, ReactDOM, {
  props: { label: 'string' },
});
// ✅ Safely define the custom element only once
if (!customElements.get('project-player')) {
  customElements.define('project-player', WebProjectPlayer);
}
if (!customElements.get('my-button')) {
  customElements.define('my-button', WebMyButton);
}
