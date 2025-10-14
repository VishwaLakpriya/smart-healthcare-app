import TokenCounter from "../models/TokenCounter";

export async function issueToken(department: string) {
  const today = new Date().toISOString().slice(0,10);
  const counter = await TokenCounter.findOneAndUpdate(
    { date: today, department },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return `${department.charAt(0).toUpperCase()}-${String(counter.seq).padStart(3,"0")}`;
}
