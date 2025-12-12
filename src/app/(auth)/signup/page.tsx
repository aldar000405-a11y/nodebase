import { RegisterForm } from "@/features/auth/components/register-form";

export default function Page() {
    return (
        <div>
            <p>Page updated at: {new Date().toISOString()}</p>
            <RegisterForm />
        </div>
    );
}