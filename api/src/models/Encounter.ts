import { Schema, model, Types } from "mongoose";

const EncounterSchema = new Schema({
  patientId: { type: Types.ObjectId, ref: "Patient", index: true },
  appointmentId: { type: Types.ObjectId, ref: "Appointment" },
  status: { type: String, enum: ["Arrived","InProgress","Completed"], default: "Arrived" },
  department: String,
  token: String,
  timeIn: { type: Date, default: Date.now }
}, { timestamps: true });

export default model("Encounter", EncounterSchema);
