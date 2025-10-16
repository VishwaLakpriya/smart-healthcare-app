import request from 'supertest';
import app from '../src/app';

export const api = request(app);

// Utility: create & login a test user, returns cookie header string
export async function registerAndLogin(email = 'staff@example.com', password = 'Str0ng@123', role: 'admin'|'clerk' = 'clerk') {
  const res = await api
    .post('/api/auth/register')
    .send({ name: 'Test User', email, password, role })
    .expect(201);

  // supertest automatically stores cookies on the agent if we used agent().
  // Here we return cookie manually for simplicity:
  const cookie = res.get('Set-Cookie')?.[0];
  if (!cookie) throw new Error('No auth cookie set');
  return cookie;
}
