"use client";
import Image from "next/image";
import Link from "next/link";
import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSuspenseCredential } from "../hooks/use-credentials";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["OPENAI", "ANTHROPIC", "GEMINI"]),
    value: z.string().min(1, "Value is required"),
});

type FormValues = z.infer<typeof formSchema>;
type CredentialType = FormValues["type"];

const credentialTypeOptions = [
    {
        value: "OPENAI" as const,
        label: "OpenAI",
        logo: "/logos/openai.svg",
    },
    {
        value: "ANTHROPIC" as const,
        label: "Anthropic",
        logo: "/logos/anthropic.svg",
    },
    {
        value: "GEMINI" as const,
        label: "Gemini",
        logo: "/logos/gemini.svg",
    }
];


interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    };
};

export const CredentialForm = ({
    initialData,
}: CredentialFormProps) => {
    const router = useRouter();
    const utils = trpc.useUtils();
    const { handleError, model } = useUpgradeModel();

        const createCredential = trpc.credentials.create.useMutation({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" created successfully`);
                utils.credentials.getMany.invalidate();
                router.push("/credintials");
            },
            onError: (error) => {
                toast.error(`Failed to create credential: ${error.message}`);
            },
        });

        const updateCredential = trpc.credentials.update.useMutation({
            onSuccess: (data) => {
                toast.success(`Credential "${data.name}" saved successfully`);
                utils.credentials.getMany.invalidate();
                utils.credentials.getOne.invalidate({ id: data.id });
                router.push("/credintials");
            },
            onError: (error) => {
                toast.error(`Failed to save credential: ${error.message}`);
            },
        });

    const isEdit = !!initialData?.id;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: "OPENAI",
            value: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData?.id) {
            await updateCredential.mutateAsync({
                 id: initialData.id,
                    ...values,
            });
         } else {
            await createCredential.mutateAsync(values, {
                onError: (error) => {
                    handleError(error);
                }
            });

        }
    };

    return (
        <>
        {model}
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle>
                    {isEdit ? "Edit Credential" : "Create Credential"}
                    </CardTitle>
                <CardDescription>
                    {isEdit 
                    ? "Update your API key or credential details" : "Add a new API key or credential to your account"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="My API Key" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />

                                                <FormField
                                                    control={form.control}
                                                    name="type"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Type</FormLabel>
                                                                <Select
                                                                   defaultValue={field.value}
                                                                    onValueChange={field.onChange}
                                                                >
                                                                    <FormControl>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {credentialTypeOptions.map((option) => (
                                                                            <SelectItem key={option.value} value={option.value}>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Image
                                                                                        src={option.logo}
                                                                                        alt={option.label}
                                                                                        width={16}
                                                                                        height={16}
                                                                                    />
                                                                                   {option.label}
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />




                                                <FormField
                                                    control={form.control}
                                                    name="value"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>API Key</FormLabel>
                                                            <FormControl>
                                                                <Input 
                                                                type="password" 
                                                                placeholder="sk-..." 
                                                                {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="flex gap-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={
                                                            createCredential.isPending ||
                                                            updateCredential.isPending
                                                        }
                                                    >
                                                        {isEdit ? "Update" : "Create"}
                                                    
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                      variant="outline"
                                                      asChild
                                                    >
                                                        <Link href="/credintials" prefetch>
                                                        Cancel  
                                                        </Link>
                                                    </Button>
                                                </div>
                                                </form>

                </Form>
            </CardContent>
        </Card>
        </>
        )
};

export const CredentialsView = ({
     credentialId,
     }: { credentialId: string }) => {
    const { data: credential} = useSuspenseCredential(credentialId);

    return <CredentialForm initialData={credential} />
};