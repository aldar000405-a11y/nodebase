import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{ credintailId: string }>;
}


const Page = async ({params}: PageProps) => {
    await requireAuth();
    const {credintailId} = await params;
    return <p>credintail id {credintailId} </p>
    
};

export default Page;