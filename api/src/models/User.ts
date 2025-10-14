import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "clerk"], default: "clerk" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export type UserDoc = {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "clerk";
  isActive: boolean;
};

export default model<UserDoc>("User", UserSchema);
