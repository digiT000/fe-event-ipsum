// models/listUsers.ts
export type user = {
  user_id: number;
  name: string;
  email: string;
  user_role: string;
  points: number;
  created_at: string;
  updated_at: string;
  user_referral: {
    user_referral_id: number;
    referral_code: string;
    limit_use: number;
    total_use: number;
  };
};
