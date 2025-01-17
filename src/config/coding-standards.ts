/**
 * Coding Standards for the Healthcare Social Dashboard
 * 
 * File Organization:
 * - Each component should be in its own directory with related files
 * - Separate business logic into hooks
 * - Keep configuration in dedicated config files
 * - Use types directory for type definitions
 * 
 * Component Structure:
 * - One component per file
 * - Keep components focused and single-responsibility
 * - Extract reusable logic into custom hooks
 * - Use proper TypeScript types
 * 
 * State Management:
 * - Use Zustand for global state
 * - Keep component state local when possible
 * - Avoid prop drilling by using context or state management
 * 
 * Error Handling:
 * - Use try/catch blocks for async operations
 * - Proper error messages and user feedback
 * - Error boundaries for component errors
 * 
 * Performance:
 * - Memoize expensive calculations
 * - Use proper React hooks (useCallback, useMemo)
 * - Implement proper loading states
 */

export const FILE_STRUCTURE = {
  src: {
    components: {
      // Group related components in directories
      'component-name': {
        'index.ts': 'Export main component',
        'ComponentName.tsx': 'Main component file',
        'SubComponent.tsx': 'Related sub-components',
        'useComponentHook.ts': 'Component-specific hooks',
        'types.ts': 'Component-specific types',
        'utils.ts': 'Component-specific utilities'
      }
    },
    hooks: 'Global custom hooks',
    services: 'API and external service integration',
    utils: 'Shared utilities and helpers',
    types: 'Global TypeScript types',
    config: 'Application configuration'
  }
};