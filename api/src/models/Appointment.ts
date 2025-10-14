import { Schema, model, Types } from "mongoose";

const AppointmentSchema = new Schema({
  patientId: { type: Types.ObjectId, ref: "Patient", index: true },
  hospital: String,
  department: String,
  doctor: String,
  time: Date,
  status: { type: String, enum: ["Scheduled","Arrived","Cancelled"], default: "Scheduled" }
}, { timestamps: true });

export default model("Appointment", AppointmentSchema);
