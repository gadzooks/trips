//auth.ts
import NextAuth from "next-auth"
// import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    redirect({ url, baseUrl }) {
      return url?.startsWith('/') ? `${baseUrl}${url}` : baseUrl
    }
  }
})