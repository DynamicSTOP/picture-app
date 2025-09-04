import 'server-only';

export const sendProcess = (message: unknown) => {
  if (process.send) {
    return process.send(message);
  } else {
    throw new TypeError('no process send');
  }
}