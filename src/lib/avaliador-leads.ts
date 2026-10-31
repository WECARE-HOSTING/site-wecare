import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
// Dados ficam fora da pasta de release (persistem entre deploys). Em produção definir AVALIADOR_DATA_DIR=/srv/wecare-site/data/avaliador (chmod 700, dono do serviço).
const DIR = process.env.AVALIADOR_DATA_DIR || path.join(process.cwd(), ".data", "avaliador");
const USO = path.join(DIR, "uso.json");
const LEADS = path.join(DIR, "leads.jsonl");
const SALT = process.env.AVALIADOR_IP_SALT || "wecare-avaliador";
export const hashIp = (ip: string) => crypto.createHash("sha256").update(SALT + ip).digest("hex").slice(0, 32);
type Uso = Record<string, { n: number; lead?: boolean; ultimo: string }>;
async function ler(): Promise<Uso> { try { return JSON.parse(await fs.readFile(USO, "utf8")); } catch { return {}; } }
async function gravar(u: Uso) { await fs.mkdir(DIR, { recursive: true, mode: 0o700 }); const t = USO + ".tmp"; await fs.writeFile(t, JSON.stringify(u), { mode: 0o600 }); await fs.rename(t, USO); }
export async function uso(h: string) { return (await ler())[h] ?? { n: 0 }; }
export async function registrarUso(h: string, lead = false) { const u = await ler(); const c = u[h] ?? { n: 0, ultimo: "" }; u[h] = { n: c.n + 1, lead: c.lead || lead, ultimo: new Date().toISOString() }; await gravar(u); }
export type Lead = { nome: string; email: string; telefone: string; consentimento: true };
export function validarLead(l: unknown): Lead | null {
  const x = l as Partial<Record<keyof Lead, unknown>> | null;
  if (!x) return null;
  const nome = String(x.nome ?? "").trim().slice(0, 100), email = String(x.email ?? "").trim().slice(0, 120), tel = String(x.telefone ?? "").replace(/\D/g, "").slice(0, 15);
  if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || tel.length < 10 || x.consentimento !== true) return null;
  return { nome, email, telefone: tel, consentimento: true };
}
export async function salvarLead(l: Lead, ipHash: string, simulacao: unknown) {
  await fs.mkdir(DIR, { recursive: true, mode: 0o700 });
  const reg = { quando: new Date().toISOString(), ...l, consentimentoTexto: "LGPD v1 avaliador", ipHash, simulacao };
  await fs.appendFile(LEADS, JSON.stringify(reg) + "\n", { mode: 0o600 });
  const hook = process.env.AVALIADOR_LEAD_WEBHOOK; // opcional, desligado por padrão
  if (hook) await fetch(hook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(reg) }).catch(() => {});
}
