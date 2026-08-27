import { useState } from "react";
import { createFileRoute,Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Check, X, Users, Trophy, TrendingUp, Plus, Building2, HelpCircle, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { apiFetch, backendAsset, isBrowser, userQuery } from "@/lib/api";
import { toast } from "sonner";
import { ReviewActivityModal, type PendingItem } from "@/components/modals/review-activity-modal";
import { AddPartnerModal } from "@/components/modals/add-partner-modal";
import { RewardManagement } from "@/components/reward-management";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administração — Viridis" }] }),
  component: AdminPage,
});

type Dashboard = { pendencias:number;ranking_turmas:{nome:string;pontos:number}[];progresso_semanal:{semana:string;valor:number;aprovacoes:number}[] };
type Submission = {id:number;descricao:string;url_foto:string;data_envio:string;aluno:string;atividade:string;pontos:number};
type Partner = {id:number;nome:string;tipo:string;email:string;telefone:string|null;ativo:number};

function Card({children}:{children:React.ReactNode}){return <motion.section initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">{children}</motion.section>;}

function AdminPage(){
  const queryClient=useQueryClient();
  const {data:user,isLoading:loadingUser,error:userError}=useQuery(userQuery());
  const [review,setReview]=useState<PendingItem|null>(null);
  const [openPartner,setOpenPartner]=useState(false);
  const {data,isLoading,error}=useQuery({
    queryKey:["admin",user?.perfil_nome],enabled:isBrowser&&!!user,retry:false,
    queryFn:async()=>{
      const [dashboard,submissions]=await Promise.all([
        apiFetch<Dashboard>("/admin/dashboard"),
        apiFetch<{submissoes:Submission[]}>("/submissoes?status=pending"),
      ]);
      let partners:Partner[]=[];
      if(user?.perfil_nome==="admin") partners=(await apiFetch<{parceiros:Partner[]}>("/parceiros")).parceiros;
      return {dashboard,submissions:submissions.submissoes,partners};
    },
  });
  const refresh=()=>queryClient.invalidateQueries({queryKey:["admin"]});
  async function resolve(id:number,action:"approve"|"reject",comment=""){
    await apiFetch(`/submissoes/${id}/revisar`,{method:"PUT",body:JSON.stringify({status:action==="approve"?"approved":"rejected",comentario:comment||undefined})});
    await refresh();
  }
  async function resolveAll(action:"approve"|"reject"){
    if(!data)return;
    try{
      await Promise.all(data.submissions.map(s=>resolve(s.id,action,action==="reject"?"Rejeitado em revisão coletiva":"")));
      toast.success(action==="approve"?"Todos aprovados":"Todos rejeitados");
    }catch(e){toast.error(e instanceof Error?e.message:"Não foi possível revisar todos");}
  }
  if(loadingUser||isLoading)return <PageShell><div className="p-16 text-center text-muted-foreground">Carregando painel...</div></PageShell>;
  if(userError||error||!data)return <PageShell><div className="p-16 text-center text-destructive">{userError?.message??error?.message??"Acesso exclusivo para professores e administradores"}</div></PageShell>;
  const pending:PendingItem[]=data.submissions.map(s=>({id:s.id,student:s.aluno,activity:s.atividade,date:new Date(s.data_envio).toLocaleDateString("pt-BR"),points:Number(s.pontos),photo:backendAsset(s.url_foto),description:s.descricao}));
  const classes=data.dashboard.ranking_turmas.map(c=>({name:c.nome,points:Number(c.pontos)}));
  const weekly=data.dashboard.progresso_semanal.map(w=>({week:w.semana,value:Number(w.valor)}));
  const totalPoints=classes.reduce((sum,c)=>sum+c.points,0);

  return <PageShell><div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
    <div><div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">🏆 Painel do Professor / Administrador</div><h1 className="mt-1 text-3xl font-extrabold">Gestão e visão institucional</h1><p className="text-sm text-muted-foreground">Dados atualizados diretamente do banco Viridis.</p></div>
    <div className="grid gap-3 sm:grid-cols-3">
      {[{icon:Users,label:"Turmas ativas",value:classes.length},{icon:Trophy,label:"Pontos das turmas",value:totalPoints.toLocaleString("pt-BR")},{icon:TrendingUp,label:"Pendências",value:data.dashboard.pendencias}].map(s=><div key={s.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft"><s.icon className="h-5 w-5 text-primary"/><div className="mt-3 text-2xl font-extrabold">{s.value}</div><div className="text-xs text-muted-foreground">{s.label}</div></div>)}
    </div>
    {user?.perfil_nome==="admin"&&<Link to="/admin/quiz" className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-soft transition-colors hover:bg-primary/10"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground"><HelpCircle className="h-6 w-6"/></div><div className="flex-1"><div className="font-extrabold">Gerenciar banco de perguntas</div><div className="text-xs text-muted-foreground">Crie, edite e exclua perguntas dos quizzes.</div></div><ArrowRight className="h-5 w-5 text-primary"/></Link>}
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-extrabold uppercase tracking-widest">Verificação de pontos</h2><p className="text-xs text-muted-foreground">Pedidos pendentes de aprovação</p></div>{pending.length>0&&<div className="flex gap-2"><button onClick={()=>resolveAll("approve")} className="inline-flex items-center gap-1 rounded-full bg-success px-3 py-2 text-xs font-bold text-success-foreground"><Check className="h-3.5 w-3.5"/>Aprovar todos</button><button onClick={()=>resolveAll("reject")} className="inline-flex items-center gap-1 rounded-full bg-destructive px-3 py-2 text-xs font-bold text-destructive-foreground"><X className="h-3.5 w-3.5"/>Rejeitar todos</button></div>}</div>
      {pending.length===0?<div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">Nenhuma aprovação pendente 🎉</div>:<ul className="mt-4 space-y-2">{pending.map(p=><li key={p.id} className="flex flex-col gap-3 rounded-2xl border border-success/20 bg-success/5 p-4 sm:flex-row sm:items-center"><div className="grid h-10 w-10 place-items-center rounded-xl bg-card font-bold">{p.student.charAt(0)}</div><div className="min-w-0 flex-1"><div className="font-bold">{p.student}</div><div className="text-xs text-muted-foreground">{p.activity} · {p.date}</div></div><div className="font-extrabold text-success">+{p.points}</div><button onClick={()=>setReview(p)} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Revisar</button></li>)}</ul>}
    </Card>
    <Card><h2 className="text-sm font-extrabold uppercase tracking-widest">Desempenho das turmas</h2><div className="mt-4 grid gap-6 lg:grid-cols-2"><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={classes}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="points" fill="var(--color-success)" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={weekly}><XAxis dataKey="week"/><YAxis/><Tooltip/><Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={3}/></LineChart></ResponsiveContainer></div></div></Card>
    {user?.perfil_nome==="admin"&&<Card><div className="flex items-center justify-between"><h2 className="text-sm font-extrabold uppercase tracking-widest">Parcerias locais</h2><button onClick={()=>setOpenPartner(true)} className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"><Plus className="h-4 w-4"/>Adicionar</button></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{data.partners.map(p=><div key={p.id} className="flex items-center gap-3 rounded-xl border border-border p-3"><Building2 className="h-5 w-5 text-primary"/><div><div className="font-bold">{p.nome}</div><div className="text-xs text-muted-foreground">{p.tipo} · {p.email}</div></div></div>)}</div></Card>}
    {user?.perfil_nome==="admin"&&<RewardManagement endpoint="/admin/recompensas" title="Recompensas gerais do app"/>}
  </div>
  <ReviewActivityModal item={review} onOpenChange={v=>!v&&setReview(null)} onResolve={resolve}/>
  <AddPartnerModal open={openPartner} onOpenChange={setOpenPartner} onCreate={async p=>{await apiFetch("/parceiros",{method:"POST",body:JSON.stringify({nome:p.name,tipo:p.type,email:p.email,telefone:p.phone})});await refresh();}}/>
  </PageShell>;
}
