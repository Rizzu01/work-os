"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "../lib/supabase-browser";

export default function AuthGate({children}:{children:React.ReactNode}){
 const path=usePathname();const router=useRouter();const[ready,setReady]=useState(path==="/auth"||path==="/onboarding");const[userEmail,setUserEmail]=useState("");
 useEffect(()=>{const client=supabaseBrowser();if(!client){setReady(true);return}let active=true;const check=async()=>{const{data}=await client.auth.getSession();if(!active)return;const session=data.session;setUserEmail(session?.user.email??"");if(!session){if(path!=="/auth")router.replace("/auth");else setReady(true);return}if(path==="/auth"){router.replace("/");return}setReady(true)};check();const{data:{subscription}}=client.auth.onAuthStateChange(()=>check());return()=>{active=false;subscription.unsubscribe()};},[path,router]);
 const signOut=async()=>{const client=supabaseBrowser();if(!client)return;await client.auth.signOut();router.replace("/auth")};
 if(!ready)return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui",fontSize:12,color:"#777"}}>Loading workspace…</div>;
 return <div>{path!=="/auth"&&path!=="/onboarding"&&userEmail&&<button aria-label={`Sign out ${userEmail}`} onClick={signOut} style={{position:"fixed",right:16,top:10,zIndex:50,border:"1px solid #ddd",background:"#fff",borderRadius:6,padding:"6px 10px",fontSize:10,cursor:"pointer"}}>Sign out</button>}{children}</div>;
}
