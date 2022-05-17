require('module-alias/register');

import App from '../src/app';
const app = new App();
const express = app.express();

export default express;
