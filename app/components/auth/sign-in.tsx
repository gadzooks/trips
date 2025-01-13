// app/components/auth/sign-in.tsx
import { signInWithGoogle } from "@/actions/auth"
 
export default function SignIn() {
  return (
    <form action={signInWithGoogle}>
      <button type="submit">Signin with Google</button>
    </form>
  )
}