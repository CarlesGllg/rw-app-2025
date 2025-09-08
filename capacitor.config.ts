import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rwes.padresv1',
  appName: 'Right Way - Padres',
  webDir: 'dist',
  server: {
    url: 'https://c331e078-5e42-4ad2-bcdf-f586670a0002.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
