// Type definitions for custom web components

import 'react';

interface QuestionnairePlayerMain extends HTMLElement {
  apiConfig?: {
    baseURL: string;
    fileSizeLimit: number;
    userAuthToken: string;
    solutionId: string;
    solutionType: 'survey' | 'observation';
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'questionnaire-player-main': React.DetailedHTMLProps<
        React.HTMLAttributes<QuestionnairePlayerMain>,
        QuestionnairePlayerMain
      >;
    }
  }
}

export {};

