import { install } from 'source-map-support';
install();
import './config';

import devFunctions from './dev';
import migrationApp from './migration';

export const dev = devFunctions;
export const migration = migrationApp;