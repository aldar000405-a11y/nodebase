"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string().min(4, "Password must be at least 4 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    let toastId: string | number | undefined;
    try {
      toastId = toast.loading("Creating account...");
      const normalizedEmail = values.email.toLowerCase().trim();
      
      await authClient.signUp.email({
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: values.password,
      });
      
      toast.dismiss(toastId);
      toast.success("✅ Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error: unknown) {
      if (toastId !== undefined) toast.dismiss(toastId);
      console.error("Signup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      toast.error(errorMessage);
    }
  };




  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <Card className="w-full border border-gray-200 shadow-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-semibold text-gray-900">Create Account</CardTitle>
          <CardDescription className="text-gray-600">Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4">
                <Button variant="outline" className="w-full border border-gray-300 hover:bg-gray-50" type="button" disabled={isPending}>
                  <Image
                    src="/logos/github.svg"
                    alt="GitHub"
                    width={20}
                    height={20}
                  
                  />
                  Continue with GitHub
                </Button>
                <Button variant="outline" className="w-full border border-gray-300 hover:bg-gray-50" type="button" disabled={isPending}>
                  <Image
                    src="/logos/google.svg"
                    alt="google"
                    width={20}
                    height={20}
                  
                  />
                  Continue with Google
                </Button>
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Creating account..." : "Sign up"}
                </Button>
              </div>

              <div className="text-center text-sm mt-4">
                Already have an account? {" "}
                <Link href="/login" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}