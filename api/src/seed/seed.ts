import "dotenv/config";
import mongoose from "mongoose";
import Patient from "../models/Patient";
import Appointment from "../models/Appointment";

(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);

  //await Patient.deleteMany({});
  //await Appointment.deleteMany({});

  const jane = await Patient.create({
    name: "James ",
    age: 40,
    nic: "123V",
    phone: "07X XXX XXXX",
    alerts: ["ALLERGY: Penicillin","FALL RISK"],
    card: { id: "CARD-10492", barcode: "CARD-10492" }
  });

  const t = new Date(); t.setHours(10,30,0,0);
  await Appointment.create({
    patientId: jane._id,
    hospital: "City General",
    department: "Cardiology",
    doctor: "Dr. Silva",
    time: t
  });

  console.log("Seeded OK");
  process.exit(0);
})();
