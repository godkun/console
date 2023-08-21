import { setupApp } from './app';
import { LogInfo, LogError, LogWarning } from '@wailsapp/runtime';
console.log = LogInfo;
console.error = LogError;
console.warn = LogWarning;
setupApp();
