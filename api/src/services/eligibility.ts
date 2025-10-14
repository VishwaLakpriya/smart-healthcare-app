export type Eligibility = { tag: "Covered" | "Unknown" | "SelfPay"; detail?: string };

export async function checkEligibility(): Promise<Eligibility> {
  // Placeholder logic — tweak later
  return { tag: "Covered", detail: "Govt scheme" };
}
