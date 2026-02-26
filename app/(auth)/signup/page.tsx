"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "motion/react"
import { Loader2 } from "lucide-react"

import { signIn, signUp } from "@/lib/auth-client"
import { emailSchema, type EmailFormValues } from "@/lib/auth-schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const detailsSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

type DetailsFormValues = z.infer<typeof detailsSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState("")
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null)

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  })

  const detailsForm = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
  })

  function onEmailSubmit(values: EmailFormValues) {
    setEmail(values.email)
    setStep(2)
  }

  async function onDetailsSubmit(values: DetailsFormValues) {
    setServerError(null)
    const { error } = await signUp.email({
      name: values.name,
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
          Create an account
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          Start tracking your expenses in seconds.
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
                submitLabel="Sign Up with Email"
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
                onSubmit={detailsForm.handleSubmit(onDetailsSubmit)}
                noValidate
              >
                <FieldGroup>
                  <EmailBadge email={email} />

                  <Field data-invalid={!!detailsForm.formState.errors.name}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      aria-invalid={!!detailsForm.formState.errors.name}
                      placeholder="Jane Doe"
                      className="rounded-xl"
                      autoFocus
                      {...detailsForm.register("name")}
                    />
                    <FieldError
                      errors={
                        detailsForm.formState.errors.name
                          ? [detailsForm.formState.errors.name]
                          : []
                      }
                    />
                  </Field>

                  <Field data-invalid={!!detailsForm.formState.errors.password}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <PasswordInput
                      id="password"
                      aria-invalid={!!detailsForm.formState.errors.password}
                      shown={showPassword}
                      onToggle={() => setShowPassword((v) => !v)}
                      {...detailsForm.register("password")}
                    />
                    <FieldError
                      errors={
                        detailsForm.formState.errors.password
                          ? [detailsForm.formState.errors.password]
                          : []
                      }
                    />
                  </Field>

                  <Field
                    data-invalid={!!detailsForm.formState.errors.confirmPassword}
                  >
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm password
                    </FieldLabel>
                    <PasswordInput
                      id="confirmPassword"
                      aria-invalid={
                        !!detailsForm.formState.errors.confirmPassword
                      }
                      shown={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword((v) => !v)}
                      {...detailsForm.register("confirmPassword")}
                    />
                    <FieldError
                      errors={
                        detailsForm.formState.errors.confirmPassword
                          ? [detailsForm.formState.errors.confirmPassword]
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
                    disabled={detailsForm.formState.isSubmitting}
                  >
                    {detailsForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
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
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-foreground underline underline-offset-4 hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
