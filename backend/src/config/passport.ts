import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";

export const configurePassport = (): void => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    console.warn("⚠️ Google OAuth not configured — skipping Passport setup");
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Pass the Google profile to the callback handler
          // Cast to any since we handle the full user creation in auth.service
          const googleProfile = {
            id: profile.id,
            googleId: profile.id,
            email: profile.emails?.[0]?.value || "",
            name: profile.displayName || "",
            avatar: profile.photos?.[0]?.value || "",
            role: "CUSTOMER" as const,
            phone: "",
          };
          done(null, googleProfile as any);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );

  // Serialize/deserialize (not needed for JWT but required by Passport)
  passport.serializeUser((user: any, done: any) => done(null, user));
  passport.deserializeUser((obj: any, done: any) => done(null, obj));
};
