"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import Image  from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import{
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm () {
    const router = useRouter(); 

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
const onSubmit = async (values: LoginFormValues) => {
        let toastId: string | number | undefined;
        try {
            toastId = toast.loading("Signing in...");
      
      const normalizedEmail = values.email.toLowerCase().trim();
      
      await authClient.signIn.email({
        email: normalizedEmail,
        password: values.password,
      });
      
            toast.dismiss(toastId);
      toast.success("✅ Signed in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 500);
        } catch (error: unknown) {
            if (toastId !== undefined) toast.dismiss(toastId);
      console.error("Login error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
      toast.error(errorMessage);
    }
  };
        const isPending = form.formState.isSubmitting;

        return(
            <div className="flex flex-col gap-6 w-full max-w-sm">
                <Card className="w-full border border-gray-200 shadow-sm">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl font-semibold text-gray-900">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Login to continue
                        </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <Form {...form}>
                                <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid gap-4">
                                        <Button
                                            variant="outline"
                                            className="w-full border border-gray-300 hover:bg-gray-50"
                                            type="button"
                                            disabled={isPending}
                                        >
               <Image
  src="/logos/github.svg"
  alt="GitHub"
  width={20}
  height={20}

/>                                            Continue with GitHub
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full border border-gray-300 hover:bg-gray-50"
                                            type="button"
                                            disabled={isPending}
                                        >
                                               <Image
  src="/logos/google.svg"
  alt="google"
  width={20}
  height={20}

/>
                                            Continue with Google
                                        </Button>
                                    </div>
                                    <div className="grid gap-4" >
                                        <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                    type="password"
                                                    placeholder="********"
                                                    {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
 <Button type="submit" className="w-full" disabled={isPending}>
  {isPending ? "Signing in..." : "Login"}
</Button>


                                    </div>
                                    <div className="text-center text-sm mt-4">
                                        Don't have an account?{" "}
                                        <Link href="/signup" className="underline underline-offset-4">
                                        Sign up
                                        </Link>

                                    </div>
                                </form>

                            </Form>
                        </CardContent>
                </Card>

            </div>
        );

};