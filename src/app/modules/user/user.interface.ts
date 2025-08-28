export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  profileImage?: string;
  otp?: string;
  otpExpiry?: Date;
  verified?: boolean;
  comparePassword(password: string): Promise<boolean>;
}
