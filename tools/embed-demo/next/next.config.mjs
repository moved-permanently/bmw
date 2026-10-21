import { fileURLToPath } from 'node:url';

// this app sits inside the EDS repo, which has its own package-lock.json
export default {
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
};
