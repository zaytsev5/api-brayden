import * as admin from 'firebase-admin';

export async function expressAuthentication(request?: any, securityName?: string) {
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
          resolve(user);
        })
        .catch(() => {
          reject(new Error(JSON.stringify({ status: 401, message: 'Token is invalid' })));
        });
    });
  }
}
