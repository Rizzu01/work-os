"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "../lib/supabase-browser";
import { getUserWorkspace } from "../lib/workspace";

export default function AuthGate({children}:{children:React.ReactNode}){
 const path=usePathname(); const router=useRouter(); const [ready,setReady]=useState(path==="/auth"||path==="/onboarding");
 useEffect(()=>{const client=supabaseBrowser();if(!client){setReady(true);return}let active=true;
  const check=async()=>{const {data}=await client.auth.getSession();if(!active)return;const session=data.session;
   if(!session){if(path!=="/auth")router.replace("/auth");else setReady(true);return}
   if(path==="/auth"){router.replace("/");return}
   if(path!=="/onboarding"){try{const workspace=await getUserWorkspace(client,session.user.id);if(!workspace){router.replace("/onboarding");return}}catch{router.replace("/onboarding");return}}
   setReady(true);
  };check();
  const {data:{subscription}}=client.auth.onAuthStateChange(()=>{check()});return()=>{active=false;subscription.unsubscribe()};
 },[path,router]);
 if(!ready)return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui",fontSize:12,color:"#777"}}>Loading workspace…</div>;
 return <>{children}</>;
}
