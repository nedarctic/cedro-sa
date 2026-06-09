"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const initialState = {
    success: false,
    error: undefined,
    loading: false
  };

  type LoginState = {
    success: boolean;
    error?: string,
    loading: boolean;
  }

  const [loginState, setLoginState] = useState<LoginState>(initialState)
  const router = useRouter();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      setLoginState(prev => ({
        ...prev,
        loading: true
      }))

      const email = formData.get('email');
      const password = formData.get('password');

      const res = await signIn('credentials', {
        email,
        password,
        redirect: true,
        callbackUrl: '/'
      })

      setLoginState(prev => ({
        ...prev,
        loading: false
      }))

      if (!res?.ok) {
        setLoginState(prev => ({ ...prev, error: res?.error! }))
      } else {
        setLoginState(prev => ({ ...prev, error: undefined, success: true }));
        router.push('/');
      }
    } catch (error) {
      setLoginState(prev => ({ ...prev, error: error instanceof Error ? error.message : String(error), success: false }))
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back to Cedro Adventures!</CardTitle>
          <CardDescription>
            Enter your email below to login to your Cedro Adventures account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </Field>
              <Field>
                <Button disabled={loginState.loading} type="submit">Login</Button>
                {loginState.error && (
                  <p className="text-sm text-destructive">
                    {loginState.error}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
