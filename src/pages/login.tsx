import { useEffect } from "react"
import { useRouter } from "next/router";

export default function LoginPage({  }) {
    const router = useRouter();

    useEffect(() => {

        // if the user is already logged in, redirect to feed page
        
        if(true) {
            router.push("/feed");
        }
    }, []);

    return (
        <>
        <main className="bord w-full h-screen flex-col justify-center">
            
        </main>
        </>
    );
}
