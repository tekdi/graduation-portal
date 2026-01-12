# Project Player Component

A reusable, mode-driven component for viewing, previewing, and editing project templates and instances.

## Quick Start

```tsx
import ProjectPlayer from '@/project-player';

// Preview Mode - View template
<ProjectPlayer
  config={{
    mode: 'preview',
    solutionId: 'template-123',
    maxFileSize: 50,
    baseUrl: 'https://api.example.com',
    accessToken: 'your-token-here',
    language: 'en',
  }}
  data={{
    solutionId: 'template-123',
  }}
/>

// Edit Mode - Edit project instance
<ProjectPlayer
  config={{
    mode: 'edit',
    projectId: 'project-456',
    solutionId: 'template-123',
    permissions: {
      canEdit: true,
      canAddTask: true,
      canDelete: false,
    },
    maxFileSize: 50,
    baseUrl: 'https://api.example.com',
    accessToken: 'your-token-here',
    language: 'en',
    profileInfo: {
      id: 123,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'LC',
    },
    redirectionLinks: {
      unauthorizedRedirectUrl: '/unauthorized',
      loginRedirectUrl: '/login',
      homeRedirectUrl: '/home',
    },
  }}
  data={{
    projectId: 'project-456',
    solutionId: 'template-123',
  }}
/>
```

## Project Structure

```
project-player/
├── index.tsx                 # Main entry point
├── context/                  # Global state management
│   └── ProjectContext.tsx
├── hooks/                    # Custom hooks
│   ├── useProjectLoader.ts
│   ├── useLocalStorage.ts
│   ├── useTaskActions.ts
│   └── useSyncManager.ts
├── components/
│   ├── ProjectComponent/     # Main project renderer
│   └── Task/                 # Task-related components
├── types/                    # TypeScript definitions
└── utils/                    # Utility functions
```

**Note:** UI components imported from global `@ui` folder for consistency.

## Features

- ✅ Three operating modes (Preview, Edit, Read-Only)
- ✅ Nested project support
- ✅ File upload handling
- ✅ Dynamic observation forms
- ✅ Offline-first with local storage
- ✅ Auto-save and sync
- ✅ Cross-platform (Web & Native)

## Next Steps

1. Implement API integration in `utils/api.ts`
2. Complete dynamic form rendering in `components/Forms/DynamicFormLibrary.tsx`
3. Add file upload for native platforms in `components/Task/UploadComponent.tsx`
4. Implement sync logic in `hooks/useSyncManager.ts`

## Documentation

See [PROJECT_PLAYER.md](../../PROJECT_PLAYER.md) for complete documentation.
