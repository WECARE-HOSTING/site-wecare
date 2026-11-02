import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import net from "net";
import tls from "tls";

const SALT = process.env.AVALIADOR_IP_SALT || "wecare-avaliador";
export const hashIp = (ip: string) => crypto.createHash("sha256").update(SALT + ip).digest("hex").slice(0, 32);

let avisouDir = false;

/** Fora da release. Sem a variável, cai em .data/ dentro do processo (perdido no próximo deploy). */
export function diretorioDeDados(): string {
  const configurado = process.env.AVALIADOR_DATA_DIR?.trim();
  if (configurado) return configurado;
  if (!avisouDir) {
    avisouDir = true;
    console.warn(
      "[avaliador] AVALIADOR_DATA_DIR não definido. Gravando em .data/avaliador dentro do diretório do processo; a release é apagada no deploy. Defina um diretório fora dela, por exemplo /srv/wecare-site/data/avaliador (produção) ou /srv/wecare-site-dev/data/avaliador (dev).",
    );
  }
  return path.join(process.cwd(), ".data", "avaliador");
}

type Uso = Record<string, { n: number; lead?: boolean; ultimo: string }>;

async function ler(): Promise<Uso> {
  try {
    return JSON.parse(await fs.readFile(path.join(diretorioDeDados(), "uso.json"), "utf8"));
  } catch {
    return {};
  }
}

async function gravar(u: Uso) {
  const dir = diretorioDeDados();
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  const destino = path.join(dir, "uso.json");
  const tmp = `${destino}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(u), { mode: 0o600 });
  await fs.rename(tmp, destino);
}

export async function uso(h: string) {
  return (await ler())[h] ?? { n: 0 };
}

export async function registrarUso(h: string, lead = false) {
  const u = await ler();
  const c = u[h] ?? { n: 0, ultimo: "" };
  u[h] = { n: c.n + 1, lead: c.lead || lead, ultimo: new Date().toISOString() };
  await gravar(u);
}

export type Lead = { nome: string; email: string; telefone: string; consentimento: true };

export function validarLead(l: unknown): Lead | null {
  const x = l as Partial<Record<keyof Lead, unknown>> | null;
  if (!x) return null;
  const nome = String(x.nome ?? "").trim().slice(0, 100);
  const email = String(x.email ?? "").trim().slice(0, 120);
  const tel = String(x.telefone ?? "").replace(/\D/g, "").slice(0, 15);
  if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || tel.length < 10 || x.consentimento !== true) return null;
  return { nome, email, telefone: tel, consentimento: true };
}

export async function salvarLead(l: Lead, ipHash: string, simulacao: unknown) {
  const dir = diretorioDeDados();
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  const reg = { quando: new Date().toISOString(), ...l, consentimentoTexto: "LGPD v1 avaliador", ipHash, simulacao };
  await fs.appendFile(path.join(dir, "leads.jsonl"), JSON.stringify(reg) + "\n", { mode: 0o600 });
  await notificar(reg);
}

async function notificar(reg: Record<string, unknown>) {
  const webhook = process.env.AVALIADOR_LEAD_WEBHOOK?.trim() ?? "";
  const email = process.env.AVALIADOR_LEAD_EMAIL?.trim() ?? "";
  if (!webhook && !email) {
    console.info(
      "[avaliador] notificação de lead desligada (AVALIADOR_LEAD_WEBHOOK e AVALIADOR_LEAD_EMAIL vazios). O lead foi gravado só em disco.",
    );
    return;
  }
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(reg),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) console.error(`[avaliador] webhook de lead respondeu HTTP ${res.status}`);
      else console.info("[avaliador] webhook de lead enviado");
    } catch (err) {
      console.error("[avaliador] webhook de lead falhou", err);
    }
  }
  if (email) await enviarEmail(email, reg);
}

function umaLinha(s: string) {
  return s.replace(/[\r\n]/g, " ").trim();
}

function corpoEmail(to: string, from: string, reg: Record<string, unknown>) {
  const sim = (reg.simulacao ?? {}) as { regiao?: string; tipo?: string; quartos?: number; bairro?: string };
  const assunto = umaLinha(`Novo lead do avaliador — ${String(reg.nome ?? "")}`);
  const texto = [
    `Nome: ${reg.nome}`,
    `E-mail: ${reg.email}`,
    `WhatsApp: ${reg.telefone}`,
    `Quando: ${reg.quando}`,
    `Imóvel: ${sim.tipo ?? ""} ${sim.quartos ?? ""} quarto(s), ${sim.bairro || sim.regiao || ""}`,
    "Consentimento: LGPD v1 avaliador",
  ].join("\n");
  const linhas = [
    `From: ${umaLinha(from)}`,
    `To: ${umaLinha(to)}`,
    `Subject: ${assunto}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    ...texto.split("\n").map((l) => (l.startsWith(".") ? `.${l}` : l)),
  ];
  return linhas.join("\r\n");
}

type SmtpSocket = net.Socket;

class Smtp {
  private buf = "";
  private parciais: string[] = [];
  private queue: string[][] = [];
  private waiter: ((lines: string[]) => void) | null = null;
  private fail: ((err: Error) => void) | null = null;

  constructor(private socket: SmtpSocket) {
    socket.setEncoding("utf8");
    socket.on("data", (chunk: string) => {
      this.buf += chunk;
      this.drenar();
    });
    socket.on("error", (err) => this.rejeitar(err));
    socket.on("close", () => this.rejeitar(new Error("SMTP fechou a conexão")));
  }

  private rejeitar(err: Error) {
    const w = this.fail;
    this.fail = null;
    this.waiter = null;
    w?.(err);
  }

  private drenar() {
    for (;;) {
      const idx = this.buf.indexOf("\n");
      if (idx < 0) return;
      const line = this.buf.slice(0, idx).replace(/\r$/, "");
      this.buf = this.buf.slice(idx + 1);
      this.parciais.push(line);
      if (line.length >= 4 && line[3] === " ") {
        const prontas = this.parciais;
        this.parciais = [];
        this.entregar(prontas);
      }
    }
  }

  private entregar(lines: string[]) {
    if (this.waiter) {
      const w = this.waiter;
      this.waiter = null;
      this.fail = null;
      w(lines);
    } else this.queue.push(lines);
  }

  ler(): Promise<string[]> {
    const pronta = this.queue.shift();
    if (pronta) return Promise.resolve(pronta);
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("SMTP timeout")), 10000);
      this.waiter = (lines) => {
        clearTimeout(t);
        resolve(lines);
      };
      this.fail = (err) => {
        clearTimeout(t);
        reject(err);
      };
    });
  }

  async cmd(linha: string | null, esperado: number) {
    if (linha != null) this.socket.write(`${linha}\r\n`);
    const lines = await this.ler();
    const code = Number(lines.at(-1)?.slice(0, 3));
    if (code !== esperado) throw new Error(`SMTP ${code}: ${lines.join(" | ")}`);
    return lines;
  }

  solta() {
    this.socket.removeAllListeners("data");
    this.socket.removeAllListeners("close");
    this.socket.removeAllListeners("error");
  }

  fecha() {
    this.solta();
    this.socket.destroy();
  }
}

function modoTls(): "tls" | "starttls" | "plain" {
  const pedido = process.env.AVALIADOR_SMTP_SECURE?.trim().toLowerCase();
  if (pedido === "tls" || pedido === "starttls" || pedido === "plain") return pedido;
  return Number(process.env.AVALIADOR_SMTP_PORT || 587) === 465 ? "tls" : "starttls";
}

function conectar(host: string, port: number, seguro: boolean): Promise<SmtpSocket> {
  return new Promise((resolve, reject) => {
    const socket = seguro ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });
    const falhou = (err: Error) => {
      socket.destroy();
      reject(err);
    };
    socket.once("error", falhou);
    socket.once(seguro ? "secureConnect" : "connect", () => {
      socket.removeListener("error", falhou);
      resolve(socket);
    });
  });
}

async function sessaoSmtp(host: string, port: number): Promise<Smtp> {
  const modo = modoTls();
  let socket = await conectar(host, port, modo === "tls");
  let smtp = new Smtp(socket);
  try {
    await smtp.cmd(null, 220);
    await smtp.cmd("EHLO avaliador.wecarehosting.com.br", 250);
    if (modo === "starttls") {
      await smtp.cmd("STARTTLS", 220);
      smtp.solta();
      socket = await new Promise((resolve, reject) => {
        const seguro = tls.connect({ socket, servername: host });
        seguro.once("secureConnect", () => resolve(seguro));
        seguro.once("error", reject);
      });
      smtp = new Smtp(socket);
    }
    if (modo === "starttls") await smtp.cmd("EHLO avaliador.wecarehosting.com.br", 250);
    const user = process.env.AVALIADOR_SMTP_USER?.trim() ?? "";
    const pass = process.env.AVALIADOR_SMTP_PASS ?? "";
    if (user) {
      await smtp.cmd("AUTH LOGIN", 334);
      await smtp.cmd(Buffer.from(user).toString("base64"), 334);
      await smtp.cmd(Buffer.from(pass).toString("base64"), 235);
    }
    return smtp;
  } catch (err) {
    smtp.fecha();
    throw err;
  }
}

async function enviarEmail(to: string, reg: Record<string, unknown>) {
  const host = process.env.AVALIADOR_SMTP_HOST?.trim() ?? "";
  if (!host) {
    console.error("[avaliador] AVALIADOR_LEAD_EMAIL está definido, mas AVALIADOR_SMTP_HOST não. E-mail não enviado.");
    return;
  }
  const port = Number(process.env.AVALIADOR_SMTP_PORT || 587);
  const from = process.env.AVALIADOR_LEAD_EMAIL_FROM?.trim() || "avaliador@wecarehosting.com.br";
  let smtp: Smtp | null = null;
  try {
    smtp = await sessaoSmtp(host, Number.isInteger(port) && port > 0 ? port : 587);
    await smtp.cmd(`MAIL FROM:<${umaLinha(from)}>`, 250);
    await smtp.cmd(`RCPT TO:<${umaLinha(to)}>`, 250);
    await smtp.cmd("DATA", 354);
    await smtp.cmd(`${corpoEmail(to, from, reg)}\r\n.`, 250);
    await smtp.cmd("QUIT", 221);
    console.info("[avaliador] e-mail de lead enviado");
  } catch (err) {
    console.error("[avaliador] e-mail de lead falhou", err);
  } finally {
    smtp?.fecha();
  }
}
