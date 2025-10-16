import { api } from './helpers';

describe('Auth', () => {
  it('registers a user and sets cookie', async () => {
    const res = await api
      .post('/api/auth/register')
      .send({ name: 'Alice Clerk', email: 'alice@example.com', password: 'Alic3@123', role: 'clerk' })
      .expect(201);

    expect(res.body.user).toMatchObject({ name: 'Alice Clerk', email: 'alice@example.com', role: 'clerk' });
    expect(res.get('Set-Cookie')?.[0]).toContain('access_token=');
  });

  it('rejects weak password', async () => {
    const res = await api
      .post('/api/auth/register')
      .send({ name: 'Weak', email: 'weak@example.com', password: 'weak', role: 'clerk' })
      .expect(400);

    expect(res.body.error).toBe('VALIDATION');
  });

  it('logs in and returns user', async () => {
    await api.post('/api/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'B0b@1234', role: 'clerk' })
      .expect(201);

    const res = await api.post('/api/auth/login')
      .send({ email: 'bob@example.com', password: 'B0b@1234' })
      .expect(200);

    expect(res.body.user.email).toBe('bob@example.com');
    expect(res.get('Set-Cookie')?.[0]).toContain('access_token=');
  });

  it('returns current user at /me when cookie present', async () => {
    const register = await api.post('/api/auth/register')
      .send({ name: 'Carol', email: 'carol@example.com', password: 'Car0l@123', role: 'admin' });

    const cookie = register.get('Set-Cookie')[0];

    const me = await api.get('/api/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(me.body.user.email).toBe('carol@example.com');
    expect(me.body.user.role).toBe('admin');
  });

  it('denies /me without cookie', async () => {
    await api.get('/api/auth/me').expect(401);
  });
});
