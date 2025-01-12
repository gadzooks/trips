///api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';


// const SALT_ROUNDS = 12;


// const limiter = rateLimit({
//   windowMs: 60 * 1000, 
//   max: 5, 
//   message: "Too many login attempts, please try again later."
// });

console.log('Initializing NextAuth handler');
const handler = NextAuth({
  // debug: process.env.NODE_ENV === 'development',
  // FIXME only enable debug in development
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 3 * 24 * 60 * 60, 

    cookie: {
      secure: process.env.NODE_ENV === 'production', 
      httpOnly: true, 
      sameSite: 'Strict', 
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
 
  events: {
    error(message) {
      console.error(message);
    },
  },
  
  csrf: true,
});
console.log('Initializing created', handler);

export { handler as GET, handler as POST };
