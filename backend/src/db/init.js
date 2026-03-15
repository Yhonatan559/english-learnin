import store from './store.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', '..', 'data');

console.log('Base de datos (JSON) en', path.join(dataDir, 'db.json'));
console.log('Lecciones:', store.lessons.all().length);
