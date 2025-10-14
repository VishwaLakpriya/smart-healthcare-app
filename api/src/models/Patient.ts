import { Schema, model } from "mongoose";

const PatientSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  nic: String,
  phone: String,
  alerts: [String],
  card: { id: { type: String, index: true }, barcode: String, qr: String }
}, { timestamps: true });

export default model("Patient", PatientSchema);