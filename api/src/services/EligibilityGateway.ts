// Minimal concrete module so tests (and your app) can import it.
// Jest will mock this in tests/checkin.test.ts

export type EligibilityResult = { ok: boolean; tag?: string; reason?: string };

const EligibilityGateway = {
  async check(_patient: any): Promise<EligibilityResult> {
    // Default: allow. In prod, call your external service here.
    return { ok: true, tag: "Eligible" };
  }
};

export default EligibilityGateway;
