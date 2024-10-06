"use client";

import { useRouter } from "next/navigation";
import { useSessionQuery} from "@/entities/session"
import { PropsWithChildren, ReactElement, useLayoutEffect } from "react";

export function protectedPage<P>(Component: (props: P) => ReactElement) {
    return function ProtectedPage(props: PropsWithChildren<P>) {
        
        const router = useRouter()
        
        const { isError, isLoading } = useSessionQuery();

        // if (isLoading) {
        //     return <div className="text-xl text-violet-400">spinner</div>
        // }
        
        // if (isError) {
        //     router.replace("/sign-in")

        // }

        // return <Component {...props} />

        useLayoutEffect(() => {
            if(!isError){
                router.replace("/")
            }
        }, [isError, router])
        if (isLoading) {
            return <div className="text-xl text-violet-400">spinner</div>
        }
        return <Component {...props} />
    }    
}