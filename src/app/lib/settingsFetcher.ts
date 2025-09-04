import 'server-only';
import { sendProcess } from '../process.js';


export const pingElectronApp = () => {
  sendProcess({ message: 'data 123 123 ', time: Date.now() });
  return "something something";
}