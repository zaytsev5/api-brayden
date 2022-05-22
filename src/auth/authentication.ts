import * as admin from 'firebase-admin';

export async function expressAuthentication(request?: any, securityName?: string, scopes?: string[]) {
  if (securityName === 'jwt') {
    const token = request.headers['authorization'];

    return new Promise(async (resolve, reject) => {
      if (!token) {
        reject(new Error('No token provided'));
      }

      admin
        .auth()
        .verifyIdToken(token)
        .then((user) => {
          console.log(user);
          if (scopes && !scopes.includes(user.type)) {
            throw { status: 405, message: 'Not Permisison' };
          }
          resolve(user);
        })
        .catch(() => {
          reject(new Error(JSON.stringify({ status: 401, message: 'Token is invalid' })));
        });
    });
  }
}
