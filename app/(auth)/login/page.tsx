"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "motion/react"
import { Loader2 } from "lucide-react"

import { signIn } from "@/lib/auth-client"
import { emailSchema, type EmailFormValues } from "@/lib/auth-schemas"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { EmailStep } from "@/components/auth/email-step"
import { SocialLogin } from "@/components/auth/social-login"
import { PasswordInput } from "@/components/auth/password-input"
import { EmailBadge } from "@/components/auth/email-badge"
import { BackButton } from "@/components/auth/back-button"

const passwordSchema = z.object({
  password: z.string().min(1, { message: "Password is required." }),
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null)

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  function onEmailSubmit(values: EmailFormValues) {
    setEmail(values.email)
    setStep(2)
  }

  async function onPasswordSubmit(values: PasswordFormValues) {
    setServerError(null)
    const { error } = await signIn.email({
      email,
      password: values.password,
      callbackURL: "/dashboard",
    })
    if (error) {
      setServerError(error.message ?? "Something went wrong. Please try again.")
      return
    }
    router.push("/dashboard")
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setSocialLoading(provider)
    await signIn.social({ provider, callbackURL: "/dashboard" })
    setSocialLoading(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Sign in to your account to continue.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-8">
              <EmailStep
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                register={emailForm.register}
                error={emailForm.formState.errors.email}
                submitLabel="Continue with Email"
              />
              <SocialLogin onSocialLogin={handleSocialLogin} loading={socialLoading} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl border border-border bg-card/40 p-6 md:p-8">
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                noValidate
              >
                <FieldGroup>
                  <EmailBadge email={email} />

                  <Field data-invalid={!!passwordForm.formState.errors.password}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      id="password"
                      aria-invalid={!!passwordForm.formState.errors.password}
                      shown={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                      autoFocus
                      {...passwordForm.register("password")}
                    />
                    <FieldError
                      errors={
                        passwordForm.formState.errors.password
                          ? [passwordForm.formState.errors.password]
                          : []
                      }
                    />
                  </Field>

                  {serverError && (
                    <p role="alert" className="text-destructive text-sm">
                      {serverError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/90"
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </FieldGroup>
              </form>

              <BackButton
                onClick={() => {
                  setStep(1)
                  setServerError(null)
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-foreground underline underline-offset-4 hover:text-primary"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  )
}
