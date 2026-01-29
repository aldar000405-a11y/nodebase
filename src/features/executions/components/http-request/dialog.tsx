"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
// Form schema for HTTP Request dialog
const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { message: "Variable name must start with a letter or underscore and contain only alphanumeric characters and underscores" }),
    endpoint: z.string().min(1, { message: "Please enter a valid URL or endpoint" }),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z
        .string()
        .optional()
    // .refine()
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;




interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<HttpRequestFormValues>;

};
export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            endpoint: defaultValues.endpoint || "",
            method: defaultValues.method || "GET",
            body: defaultValues.body || "",
        },
    });

    // Reset form values when dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                endpoint: defaultValues.endpoint || "",
                method: defaultValues.method || "GET",
                body: defaultValues.body || "",
            });
        }
    }, [open, defaultValues, form]);
    const watchVariableName = form.watch("variableName") || "myApiCall";
    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes
        (watchMethod);
    // Convert (()) syntax to {{}} for Handlebars compatibility
    const convertTemplateVariables = (text: string): string => {
        // Match ((content)) where content can include dots like todo.httpResponse.data.userId
        return text.replace(/\(\((.+?)\)\)/g, '{{$1}}');
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        // Convert endpoint and body template syntax before saving
        const convertedValues = {
            ...values,
            endpoint: convertTemplateVariables(values.endpoint),
            body: values.body ? convertTemplateVariables(values.body) : values.body,
        };
        onSubmit(convertedValues);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden flex flex-col max-h-[90vh]">
                <DialogHeader className="p-6 border-b flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                        <DialogTitle className="text-xl">HTTP Request</DialogTitle>
                        <DialogDescription>
                            Configure settings for HTTP request node.
                        </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2 mr-8">
                        <Button onClick={form.handleSubmit(handleSubmit)} size="sm" className="bg-orange-600 hover:bg-orange-700 text-white px-6">
                            Save
                        </Button>
                    </div>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-base font-medium">Variable Name</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="myApiCall"
                                            {...field}
                                            className="h-12 focus-visible:ring-orange-600 focus-visible:border-orange-600 border-2"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm">
                                        Use this name to reference the result in other nodes:
                                        <code className="ml-1 bg-slate-100 px-1 rounded text-orange-600 font-mono">
                                            {`{{${watchVariableName}.httpResponse.data}}`}
                                        </code>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium">Method</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full h-12 focus:ring-orange-600 focus:border-orange-600 border-2">
                                                <SelectValue placeholder="Select a method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-sm">
                                        The HTTP method to use for this request
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-base font-medium">End point URL</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="https://api.example.com/data"
                                            {...field}
                                            className="h-12 focus-visible:ring-orange-600 focus-visible:border-orange-600 border-2"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm">
                                        Static URL or use <code className="bg-slate-100 px-1 rounded font-mono">{"{{variables}}"}</code> for simple values or <code className="bg-slate-100 px-1 rounded font-mono">{"((json variable))"}</code> to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showBodyField && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={`{\n  "key": "value"\n}`}
                                                className="min-h-[150px] font-mono text-sm border-2 focus-visible:ring-orange-600 focus-visible:border-orange-600"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-sm">
                                            JSON with template variables. Use <code className="bg-slate-100 px-1 rounded font-mono">{"{{variables}}"}</code> for simple values or <code className="bg-slate-100 px-1 rounded font-mono">{"((json variable))"}</code> to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}