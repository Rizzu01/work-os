"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "../lib/supabase-browser";

export default function AuthGate({children}:{children:React.ReactNode}){
 const path=usePathname(); const router=useRouter(); const [ready,setReady]=useState(path==="/auth");
 useEffect(()=>{
  const client=supabaseBrowser();
  if(!client){setReady(true);return;}
  let active=true;
  client.auth.getSession().then(({data})=>{if(!active)return;if(!data.session && path!=="/auth")router.replace("/auth");else if(data.session && path==="/auth")router.replace("/");else setReady(true)});
  const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>{if(!active)return;if(!session&&path!=="/auth")router.replace("/auth");else if(session&&path==="/auth")router.replace("/");else setReady(true)});
  return()=>{active=false;subscription.unsubscribe()};
 },[path,router]);
 if(!ready)return <div style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui",fontSize:12,color:"#777"}}>Loading workspace…</div>;
 return <>{children}</>;
}
