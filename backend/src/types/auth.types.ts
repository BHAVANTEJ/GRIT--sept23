export interface SignupDTO {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
