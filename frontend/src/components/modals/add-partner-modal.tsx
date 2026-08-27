import { useState } from "react";
import { Building2, Mail, Phone, Tag } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const partnerTypes = ["Vegetais", "Padaria", "Educação", "Ferramentas", "Reciclagem", "Outros"];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate?: (partner: { name: string; type: string; email: string; phone: string }) => Promise<void>;
}

export function AddPartnerModal({ open, onOpenChange, onCreate }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState(partnerTypes[0]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Informe um nome válido");
    if (!email.includes("@")) return toast.error("E-mail inválido");
    setLoading(true);
    try {
      await onCreate?.({ name: name.trim(), type, email: email.trim(), phone: phone.trim() });
      toast.success("Parceiro adicionado", { description: `${name} (${type}) cadastrado com sucesso.` });
      setName(""); setEmail(""); setPhone(""); setType(partnerTypes[0]); onOpenChange(false);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Não foi possível adicionar o parceiro"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-border/60 p-0 overflow-hidden">
        <div className="bg-gradient-hero p-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Adicionar parceiro</DialogTitle>
            <DialogDescription className="text-white/80">
              Cadastre um comércio local para oferecer recompensas.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <Field icon={Building2} label="Nome do parceiro">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Horta da Esquina" className={inputCls} />
          </Field>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Tag className="mr-1 inline h-3 w-3" /> Categoria
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {partnerTypes.map((t) => (
                <button key={t} type="button" onClick={() => setType(t)} className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                  type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Field icon={Mail} label="E-mail de contato">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={120} placeholder="contato@parceiro.com" className={inputCls} />
          </Field>
          <Field icon={Phone} label="Telefone">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} placeholder="(11) 99999-0000" className={inputCls} />
          </Field>

          <DialogFooter className="gap-2">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-full border border-border bg-background px-4 py-2 text-sm font-bold text-foreground hover:bg-muted">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-soft hover:bg-primary/90 disabled:opacity-60">
              {loading ? "Adicionando..." : "Adicionar parceiro"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <Icon className="mr-1 inline h-3 w-3" /> {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
