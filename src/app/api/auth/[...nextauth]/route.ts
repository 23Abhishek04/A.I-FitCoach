import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        console.log("=================================");
        console.log("LOGIN ATTEMPT");
        console.log("Email received:", credentials?.email);
        console.log("Password received:", !!credentials?.password);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          await connectDB();

          const email = String(credentials.email)
            .toLowerCase()
            .trim();

          console.log("Searching email:", email);

          const user = await User.findOne({ email });

          console.log("User found:", !!user);

          if (!user) {
            console.log("❌ USER NOT FOUND");
            return null;
          }

          console.log("User ID:", user._id.toString());
          console.log("User email:", user.email);
          console.log("Password exists:", !!user.password);
          console.log(
            "Password hash length:",
            user.password ? user.password.length : 0
          );

          if (!user.password) {
            console.log("❌ USER HAS NO PASSWORD");
            return null;
          }

          const passwordValid = await bcrypt.compare(
            String(credentials.password),
            user.password
          );

          console.log("Password valid:", passwordValid);

          if (!passwordValid) {
            console.log("❌ WRONG PASSWORD");
            return null;
          }

          console.log("✅ LOGIN SUCCESS");
          console.log("=================================");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("❌ AUTH ERROR:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };