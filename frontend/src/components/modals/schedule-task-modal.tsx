import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription,DialogFooter } from "@/components/ui/dialog";
import { apiFetch,type Mission } from "@/lib/api";
import { toast } from "sonner";

type ClassRoom={id:number;nome:string;alunos:{id:number;nome:string}[]};
export function ScheduleTaskModal({open,onOpenChange,turmas,missions,onCreated}:{open:boolean;onOpenChange:(v:boolean)=>void;turmas:ClassRoom[];missions:Mission[];onCreated:()=>void}){
  const [classId,setClassId]=useState("");const [students,setStudents]=useState<number[]>([]);const [date,setDate]=useState("");const [time,setTime]=useState("");const [title,setTitle]=useState("");const [missionId,setMissionId]=useState("");
  const selectedClass=useMemo(()=>turmas.find(t=>t.id===Number(classId)),[classId,turmas]);
  useEffect(()=>setStudents([]),[classId]);
  const mutation=useMutation({mutationFn:()=>apiFetch<{mensagem:string}>("/agenda",{method:"POST",body:JSON.stringify({turma_id:Number(classId),alunos:students,data_hora:`${date} ${time}:00`,titulo:title,missao_id:missionId?Number(missionId):null})}),onSuccess:r=>{toast.success(r.mensagem);setTitle("");setDate("");setTime("");setStudents([]);onOpenChange(false);onCreated();},onError:e=>toast.error(e.message)});
  function submit(e:React.FormEvent){e.preventDefault();if(!classId||students.length===0||!date||!time||title.trim()==="")return toast.error("Preencha turma, alunos, data, horário e tarefa");mutation.mutate();}
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-lg overflow-hidden rounded-3xl border-border/60 p-0"><div className="bg-gradient-hero p-6 text-primary-foreground"><DialogHeader><DialogTitle className="flex items-center gap-2 text-xl font-extrabold"><CalendarPlus className="h-5 w-5"/>Nova tarefa</DialogTitle><DialogDescription className="text-white/80">Agende uma atividade para um ou mais alunos.</DialogDescription></DialogHeader></div><form onSubmit={submit} className="space-y-4 p-6">
    <Field label="Turma"><select value={classId} onChange={e=>setClassId(e.target.value)} className={inputCls}><option value="">Selecione</option>{turmas.map(t=><option key={t.id} value={t.id}>{t.nome}</option>)}</select></Field>
    <Field label="Alunos"><div className="max-h-36 space-y-2 overflow-y-auto rounded-xl border border-border p-3">{!selectedClass?<span className="text-xs text-muted-foreground">Selecione uma turma</span>:selectedClass.alunos.map(a=><label key={a.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={students.includes(a.id)} onChange={e=>setStudents(current=>e.target.checked?[...current,a.id]:current.filter(id=>id!==a.id))} className="h-4 w-4 accent-primary"/>{a.nome}</label>)}</div></Field>
    <div className="grid grid-cols-2 gap-3"><Field label="Data"><input type="date" value={date} onChange={e=>setDate(e.target.value)} className={inputCls}/></Field><Field label="Horário"><input type="time" value={time} onChange={e=>setTime(e.target.value)} className={inputCls}/></Field></div>
    <Field label="Título da tarefa"><input value={title} onChange={e=>setTitle(e.target.value)} maxLength={150} className={inputCls} placeholder="Ex.: Regar o canteiro"/></Field>
    <Field label="Missão vinculada (opcional)"><select value={missionId} onChange={e=>setMissionId(e.target.value)} className={inputCls}><option value="">Sem missão</option>{missions.map(m=><option key={m.id} value={m.id}>{m.titulo}</option>)}</select></Field>
    <DialogFooter><button type="button" onClick={()=>onOpenChange(false)} className="rounded-full border border-border px-4 py-2 text-sm font-bold">Cancelar</button><button disabled={mutation.isPending} className="rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground disabled:opacity-60">{mutation.isPending?"Agendando...":"Agendar tarefa"}</button></DialogFooter>
  </form></DialogContent></Dialog>;
}
const inputCls="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>{children}</label>}
