// Capa de base de datos: usa store JSON (sin dependencias nativas).
// Para producción con muchos usuarios, sustituir por PostgreSQL/MongoDB.
import store from './store.js';

// Compatibilidad con código que usa db.prepare().get/.all/.run (opcional)
// Las rutas se actualizarán para usar store directamente.
export default store;
