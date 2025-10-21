import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "688a7b40f3e14f0d7e0dd439", 
  requiresAuth: true // Ensure authentication is required for all operations
});
