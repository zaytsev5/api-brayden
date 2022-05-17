// Set default timezone
process.env.TZ = 'UTC';

require('module-alias/register');
require('dotenv').config();

import App from './app';
import { RegisterRoutes } from './routes/routes';

const server = new App();

// Register TSOA routes
RegisterRoutes(server.app);
server.start();
