import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getGlobalStats } from "@/app/actions/stats";
import HomeClient from "./HomeClient";
import Footer from "@/components/Footer";

export default async function Page() {
    const [session, stats] = await Promise.all([
        auth.api.getSession({
            headers: await headers(),
        }),
        getGlobalStats()
    ]);

    return (
        <>
            <HomeClient stats={stats} hasSession={!!session} />
            <Footer />
        </>
    );
}
