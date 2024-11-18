import axios from "axios";

export class ReferralHandler {
  // Create function to handle use referral by user
  async useReferralCode(referralCode: string, token: string) {
    try {
      const response = await axios.put(
        `/api/referral/use-referral/${referralCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.status;
    } catch (error: any) {
      return error.response.data.status;
    }
  }
}
