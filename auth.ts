//auth.ts
import NextAuth from "next-auth"
// import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
 
// auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    redirect({ url, baseUrl }) {
      // Handle cases where url is undefined
      if (!url) return baseUrl
      // Handle relative URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Handle absolute URLs
      try {
        return new URL(url).origin === baseUrl ? url : baseUrl
      } catch {
        return baseUrl
      }
    }
  }
})