import mongoose from 'mongoose';
import { api, registerAndLogin } from './helpers';
import Patient from '../src/models/Patient'; // adjust path if different

describe('Patients API', () => {
  it('lists patients by query', async () => {
    const cookie = await registerAndLogin();

    // seed patients
    await Patient.create([
      { name: 'Nimal Perera', identifiers: [{ type: 'NIC', value: '123456789V' }], phone: '0771234567' },
      { name: 'Sunethra Silva', identifiers: [{ type: 'CARD', value: 'CARD-001' }], phone: '0711111111' },
    ]);

    const res = await api.get('/api/patients')
      .set('Cookie', cookie)
      .query({ q: 'Sun' })
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Sunethra Silva');
  });

  it('finds patient by card id', async () => {
    const cookie = await registerAndLogin();

    const p = await Patient.create({
      name: 'Kasun Jay',
      identifiers: [{ type: 'CARD', value: 'CARD-10400' }],
      phone: '0700000000'
    });

    const res = await api.get('/api/patients/by-card/CARD-10400')
      .set('Cookie', cookie)
      .expect(200);

    expect(res.body._id).toEqual(p._id.toString());
  });

  it('returns 404 for unknown card', async () => {
    const cookie = await registerAndLogin();

    await api.get('/api/patients/by-card/NOPE-999')
      .set('Cookie', cookie)
      .expect(404);
  });
});
