import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'weather-animal',
  brand: {
    displayName: '날씨 동물',
    primaryColor: '#4A90D9',
    icon: 'https://weather-animal.vercel.app/icons/app-logo-600.png',
  },
  permissions: [],
  web: {
    port: 5173,
    commands: {
      dev: 'npm run dev',
      build: 'npm run build',
    },
  },
  webViewProps: {
    type: 'partner',
    bounces: false,
    pullToRefreshEnabled: false,
    allowsBackForwardNavigationGestures: false,
  },
  navigationBar: {
    withBackButton: true,
    withHomeButton: false,
  },
  outdir: 'dist',
});
