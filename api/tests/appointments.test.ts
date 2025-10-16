import { api, registerAndLogin } from './helpers';
import Patient from '../src/models/Patient';
import Appointment from '../src/models/Appointment'; // adjust path

describe('Appointments API', () => {
  it('returns today/past/pending categorized lists', async () => {
    const cookie = await registerAndLogin();

    const pat = await Patient.create({ name: 'Ayesha', identifiers: [{ type: 'NIC', value: '999' }] });

    const now = new Date();
    const yesterday = new Date(Date.now() - 24*60*60*1000);
    const tomorrow = new Date(Date.now() + 24*60*60*1000);

    await Appointment.create([
      { patient: pat._id, time: now, department: 'OPD', doctor: 'Dr. X', status: 'Scheduled' },   // today
      { patient: pat._id, time: yesterday, department: 'Cardiology', doctor: 'Dr. Y', status: 'Completed' }, // past
      { patient: pat._id, time: tomorrow, department: 'ENT', doctor: 'Dr. Z', status: 'Scheduled' }, // pending
    ]);

    const res = await api.get('/api/appointments')
      .set('Cookie', cookie)
      .query({ patientId: pat._id.toString() })
      .expect(200);

    expect(res.body.today).toHaveLength(1);
    expect(res.body.past).toHaveLength(1);
    expect(res.body.pending).toHaveLength(1);
  });
});
