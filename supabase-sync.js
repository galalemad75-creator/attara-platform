(async function(){
  const PREFIX='atp_',s=document.createElement('script');
  s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  document.head.appendChild(s);
  await new Promise(r=>s.onload=r);
  try{
    const supa=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
    await supa.from(typeof SITE_ID!=='undefined'&&SITE_ID?SITE_ID+'_kv_store':'kv_store').select('key').limit(1);
    const orig=localStorage.setItem.bind(localStorage);
    localStorage.setItem=function(k,v){orig(k,v);try{supa.from(typeof SITE_ID!=='undefined'&&SITE_ID?SITE_ID+'_kv_store':'kv_store').upsert({key:k,value:JSON.parse(v),updated_at:new Date().toISOString()},{onConflict:'key'}).catch(()=>{})}catch{}};
    window.SUPABASE_SYNC=true;console.log('[Sync] ✅');
  }catch(e){console.warn('[Sync] Offline:',e.message)}
})();
