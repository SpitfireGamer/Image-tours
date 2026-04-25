declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      role: "CUSTOMER" | "AGENT" | "ADMIN";
      phone: string;
      // Google OAuth fields
      googleId?: string;
      avatar?: string;
      displayName?: string;
      emails?: Array<{ value: string }>;
      photos?: Array<{ value: string }>;
    }

    interface Request {
      requestId?: string;
    }
  }
}

export {};
