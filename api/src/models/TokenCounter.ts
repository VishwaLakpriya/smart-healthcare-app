import { Schema, model } from "mongoose";

const TokenCounterSchema = new Schema({
  date: { type: String, index: true },
  department: { type: String, index: true },
  seq: { type: Number, default: 0 }
}, { timestamps: true });

export default model("TokenCounter", TokenCounterSchema);
