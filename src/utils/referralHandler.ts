import axios from "axios";

export class ReferralHandler {
  // Create function to handle use referral by user
  async useReferralCode(referralCode: string, token: string) {
    console.log("FE/REFERRAL CODE : ", referralCode);
    console.log("FE/USER TOKEN : ", token);
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
      console.log(response.status);
      return response.status;
    } catch (error: any) {
      return error.response.data.status;
    }
  }
}
