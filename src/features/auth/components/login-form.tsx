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
import { cn } from "@/lib/utils";
import { Value } from "@radix-ui/react-select";

const formSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
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
        await authClient.signIn.email({
            email: values.email,
            password: values.password,
            callbackURL: "/",
        }, {
            onSuccess: () => {
                router.push("/");
            },
            onError: (ctx) => {
                toast.error(ctx.error.message);
            }
        });
    };
        const isPending = form.formState.isSubmitting;

        return(
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>
                            get started
                        </CardTitle>
                        <CardDescription>
                            login to continue
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid gap-6">
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            type="button"
                                            disabled={isPending}
                                        >
               <Image
  src="/logos/github.svg"
  alt="GitHub"
  width={20}
  height={20}

/>                                            continue with github
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            type="button"
                                            disabled={isPending}
                                        >
                                               <Image
  src="/logos/google.svg"
  alt="google"
  width={20}
  height={20}

/>
                                            continue with google
                                        </Button>
                                    </div>
                                    <div className="grid gap-6" >
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
  Login
</Button>


                                    </div>
                                    <div className="text-center text-sm mt-6">
                                        Don't have an account?{" "}
                                        <Link href="/signup" className="underline underline-offset-4">
                                        signup
                                        </Link>

                                    </div>
                                </form>

                            </Form>
                        </CardContent>
                </Card>

            </div>
        );

};