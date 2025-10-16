import { api, registerAndLogin } from './helpers';
import Patient from '../src/models/Patient';
import Appointment from '../src/models/Appointment';
import Encounter from '../src/models/Encounter';

// If EligibilityGateway is a module, mock it:
jest.mock('../src/services/EligibilityGateway', () => {
  return {
    __esModule: true,
    default: {
      check: jest.fn().mockResolvedValue({ ok: true, tag: 'Eligible' })
    }
  };
});

describe('Check-in flow', () => {
  it('creates encounter and token for a today appointment', async () => {
    const cookie = await registerAndLogin();

    const patient = await Patient.create({ name: 'Ruwan', identifiers: [{ type: 'CARD', value: 'C-001' }] });
    const appt = await Appointment.create({
      patient: patient._id,
      time: new Date(),
      department: 'OPD',
      doctor: 'Dr. Silva',
      status: 'Scheduled'
    });

    const res = await api.post('/api/checkin/confirm')
      .set('Cookie', cookie)
      .send({ patientId: patient._id.toString(), appointmentId: appt._id.toString() })
      .expect(200);

    expect(res.body.encounter).toMatchObject({
      patient: patient._id.toString(),
      appointment: appt._id.toString(),
      department: 'OPD',
      status: 'Arrived'
    });
    expect(res.body.encounter.token).toBeDefined();

    // Token uniqueness per department per day
    const res2 = await api.post('/api/checkin/confirm')
      .set('Cookie', cookie)
      .send({ patientId: patient._id.toString(), appointmentId: appt._id.toString() })
      .expect(409); // e.g., ALREADY_CHECKED_IN or similar
  });

  it('rejects check-in for non-today appointment', async () => {
    const cookie = await registerAndLogin();

    const patient = await Patient.create({ name: 'Meera' });
    const future = new Date(Date.now() + 48*60*60*1000);
    const appt = await Appointment.create({
      patient: patient._id,
      time: future,
      department: 'ENT',
      doctor: 'Dr. Z',
      status: 'Scheduled'
    });

    const res = await api.post('/api/checkin/confirm')
      .set('Cookie', cookie)
      .send({ patientId: patient._id.toString(), appointmentId: appt._id.toString() })
      .expect(400);

    expect(res.body.error).toMatch(/TODAY_ONLY|INVALID_APPOINTMENT/i);
  });

  it('blocks when eligibility fails', async () => {
    const cookie = await registerAndLogin();

    const patient = await Patient.create({ name: 'Blocked' });
    const appt = await Appointment.create({
      patient: patient._id,
      time: new Date(),
      department: 'OPD',
      doctor: 'Dr. X',
      status: 'Scheduled'
    });

    // Override mock for this test
    const gateway = require('../src/services/EligibilityGateway').default;
    gateway.check.mockResolvedValueOnce({ ok: false, reason: 'Insurance expired' });

    const res = await api.post('/api/checkin/confirm')
      .set('Cookie', cookie)
      .send({ patientId: patient._id.toString(), appointmentId: appt._id.toString() })
      .expect(412); // Precondition failed

    expect(res.body.error).toMatch(/ELIGIBILITY/i);
  });
});
