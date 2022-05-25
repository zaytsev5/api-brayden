import * as admin from 'firebase-admin';

export async function expressAuthentication(request?: any, securityName?: string, scopes?: string[]) {
  if (securityName === 'jwt') {
    const token = request.headers['authorization'];

    return new Promise(async (resolve, reject) => {
      if (!token) {
        return reject({ status: 401, message: 'No token provided' });
      }

      admin
        .auth()
        .verifyIdToken(token)
        .then((user) => {
          if (scopes?.length && !scopes.includes(user.type)) throw new Error('Not found');

          resolve(user);
        })
        .catch((e) => {
          reject({ status: 401, message: e.message });
        });
    });
  }
}
