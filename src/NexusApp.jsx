import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import {
  LayoutDashboard, CheckSquare, Wrench, Rocket, BrainCircuit, Target, ChevronRight, ExternalLink, Zap, CheckCircle2, Menu, X, Trophy, ArrowUpRight, Sparkles, Award, BarChart, ShieldCheck, TrendingUp, CalendarDays, RotateCcw, Lock, Wand2, AlertTriangle, ChevronDown, MessageCircle, Instagram, HelpCircle, Crown
} from 'lucide-react';

/* --- INICIALIZAÇÃO SEGURA DO FIREBASE COM DIAGNÓSTICO --- */
let app, auth, db, appId;
let initError = null;

// Tenta ler a variável do Netlify com o novo nome
const NETLIFY_CONFIG_STRING = process.env.REACT_APP_FIREBASE_CONFIG_JSON;

try {
  let configToUse = null;

  // 1. Prioridade: Variável do Netlify
  if (NETLIFY_CONFIG_STRING) {
    console.log("Tentando carregar configuração do Netlify...");
    try {
      configToUse = JSON.parse(NETLIFY_CONFIG_STRING);
    } catch (jsonError) {
      console.error("Erro ao ler JSON do Netlify. Verifique aspas ou vírgulas na variável.", jsonError);
      initError = "Formato JSON inválido na variável de ambiente. Verifique no Netlify.";
    }
  } 
  // 2. Fallback: Variável global (se existir - legado)
  else if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    console.log("Tentando carregar configuração global...");
    configToUse = JSON.parse(__firebase_config);
  }

  if (configToUse) {
    app = initializeApp(configToUse);
    auth = getAuth(app);
    db = getFirestore(app);
    // Tenta pegar o appId da config ou da variável global
    appId = configToUse.appId || (typeof __app_id !== 'undefined' ? __app_id : 'default-app-id');
    console.log("Firebase inicializado com sucesso!");
  } else {
    initError = "Nenhuma configuração encontrada. Verifique a variável REACT_APP_FIREBASE_CONFIG_JSON no Netlify.";
    console.error(initError);
  }

} catch (e) {
  initError = e.message;
  console.error("Erro crítico na inicialização:", e);
}

/* --- DADOS E CONSTANTES (Mantidos) --- */
const NICHE_CORRECTIONS = {
  'markiting': 'Marketing Digital', 'marketing': 'Marketing Digital', 'mkt': 'Marketing Digital', 'financas': 'Finanças & Investimentos', 'finanças': 'Finanças & Investimentos', 'dinheiro': 'Renda Extra', 'renda extra': 'Renda Extra', 'saude': 'Saúde & Bem-estar', 'saúde': 'Saúde & Bem-estar', 'fitness': 'Fitness & Musculação', 'academia': 'Fitness & Musculação', 'emagrecimento': 'Emagrecimento', 'dieta': 'Emagrecimento', 'ingles': 'Idiomas & Inglês', 'inglês': 'Idiomas & Inglês', 'programacao': 'Programação & Dev', 'programação': 'Programação & Dev', 'dev': 'Programação & Dev', 'design': 'Design & Criatividade', 'dropshiping': 'Dropshipping', 'dropshipping': 'Dropshipping', 'drop': 'Dropshipping', 'ecommerce': 'E-commerce', 'e-commerce': 'E-commerce', 'loja': 'E-commerce', 'plr': 'PLR & Licenciamento', 'trafego': 'Gestão de Tráfego', 'tráfego': 'Gestão de Tráfego', 'apostas': 'iGaming & Apostas', 'bet': 'iGaming & Apostas'
};
const POPULAR_NICHES = ['Marketing Digital', 'Finanças', 'Emagrecimento', 'Inglês', 'Dropshipping', 'Programação'];

/* --- COMPONENTES AUXILIARES --- */
const NexusLogo = ({ className = "h-10", showText = true }) => {
  const [uid] = useState(() => Math.random().toString(36).substr(2, 9));
  const gradId = `nexusGradient-${uid}`;
  const glowId = `glow-${uid}`;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto overflow-visible">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect x="0" y="0" width="100" height="100" rx="25" fill="#0f172a" stroke={`url(#${gradId})`} strokeWidth="2" />
        <path d="M30 75 V 25 L 70 75 V 25" fill="none" stroke={`url(#${gradId})`} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${glowId})`} />
        <path d="M30 80 L 80 20 M 80 20 L 55 20 M 80 20 L 80 45" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <div className="flex flex-col justify-center">
          <span className="font-black text-white tracking-tighter text-xl leading-none">NEXUS</span>
          <span className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] leading-none mt-1">DIGITAL</span>
        </div>
      )}
    </div>
  );
};

const ToolCard = ({ tool }) => (
  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block h-full outline-none focus:ring-2 focus:ring-cyan-500 rounded-2xl">
    <GlassCard hoverEffect={true} className="flex flex-col h-full cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-cyan-400 transition-colors flex items-center gap-2">{tool.name}</h4>
        <span className="text-[10px] uppercase tracking-widest bg-white/5 text-slate-300 px-2 py-1 rounded border border-white/10 font-bold group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-colors">{tool.tag}</span>
      </div>
      <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed group-hover:text-slate-300 transition-colors">{tool.desc}</p>
      <div className="mt-auto w-full py-3 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-500 transition-all duration-300">Acessar <ExternalLink size={14} /></div>
    </GlassCard>
  </a>
);

const TaskItem = ({ id, text, xp, done, onToggle }) => (
  <div onClick={() => onToggle(id, !done)} className={`relative p-5 border-b border-white/5 last:border-0 flex items-center gap-5 cursor-pointer group overflow-hidden transition-all duration-300 select-none ${done ? 'bg-cyan-950/10' : 'hover:bg-white/[0.02]'}`}>
    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${done ? 'bg-cyan-500' : 'bg-transparent group-hover:bg-slate-700'}`} />
    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${done ? 'bg-cyan-500 border-cyan-500 scale-110' : 'border-slate-600 group-hover:border-cyan-400'}`}>
      {done && <CheckSquare size={14} className="text-black" strokeWidth={4} />}
    </div>
    <div className="flex-1"><span className={`text-lg font-medium transition-all duration-300 block ${done ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-white'}`}>{text}</span></div>
    <div className={`px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300 ${done ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'bg-white/5 text-slate-500 border-white/5 group-hover:border-white/10'}`}>+{xp} XP</div>
  </div>
);

const PhaseSummary = ({ data, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!data) return null;
  return (
    <div className="mt-0 border-t border-white/5">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 bg-slate-800/30 hover:bg-slate-800/60 transition-colors group">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-cyan-400 flex items-center gap-2"><Sparkles size={14} /> O que esperar deste capítulo</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 bg-slate-800/30 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-4">
            <div><p className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 size={12} /> O que foi feito</p><p className="text-sm text-slate-300 leading-relaxed pl-1 border-l-2 border-cyan-500/20 ml-1">{data.done}</p></div>
            <div className="w-full h-[1px] bg-white/5"></div>
            <div><p className="text-xs font-bold text-green-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Target size={12} /> Resultado Esperado</p><p className="text-sm text-slate-300 leading-relaxed pl-1 border-l-2 border-green-500/20 ml-1">{data.result}</p></div>
            <div className="mt-4 pt-4 border-t border-white/10 text-[11px] text-slate-500 flex items-start gap-2"><HelpCircle size={14} className="shrink-0 mt-0.5 text-slate-400" /><p>Dúvidas muito específicas ou técnicas? Use o <strong>ChatGPT/Gemini</strong> para explicações detalhadas. Para problemas com o método, acesse a aba <button onClick={() => setActiveTab('contacts')} className="text-cyan-400 hover:underline">Suporte & Contato</button>.</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

const LevelUpModal = ({ isOpen, onClose, onConfirm, currentLevel, progress }) => {
  if (!isOpen) return null;
  const isUpgrade = currentLevel === 'iniciante';
  const targetLevel = isUpgrade ? 'mestre' : 'iniciante';
  const isReady = isUpgrade && progress >= 80; 
  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <GlassCard className="max-w-md w-full border-cyan-500/30 p-8 shadow-2xl shadow-cyan-900/40">
        <div className="text-center mb-8">
          <Award size={48} className={`mx-auto mb-4 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] ${isUpgrade ? 'text-cyan-400' : 'text-purple-400'}`} />
          <h2 className="text-3xl font-black text-white mb-2">{isUpgrade ? "Ascensão de Nível" : "Alternar Nível"}</h2>
          <p className="text-slate-400">{isUpgrade ? "Promova sua conta para o próximo nível de maestria." : "Retorne aos fundamentos para revisar estratégias."}</p>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-slate-800 rounded-xl border border-white/10 flex justify-between items-center"><span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Atual</span><span className="text-xl font-black text-white capitalize">{currentLevel}</span></div>
          <div className="flex justify-center"><ArrowUpRight className={`text-slate-500 ${!isUpgrade && 'rotate-180'}`} /></div>
          <div className={`p-4 rounded-xl border border-white/10 flex justify-between items-center ${isUpgrade ? 'bg-purple-900/20 border-purple-500/30' : 'bg-cyan-900/20 border-cyan-500/30'}`}><span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Alvo</span><span className={`text-xl font-black capitalize ${isUpgrade ? 'text-purple-400' : 'text-cyan-400'}`}>{targetLevel}</span></div>
        </div>
        <p className={`mt-6 text-sm font-medium text-center ${isReady || !isUpgrade ? 'text-green-400' : 'text-orange-400'}`}>{isUpgrade ? (isReady ? "Você está pronto para o próximo nível." : "Recomendamos finalizar a base antes de avançar.") : "Você pode alternar livremente entre os níveis para consultar materiais anteriores."}</p>
        <div className="flex gap-4 mt-8"><Button onClick={onClose} variant="secondary" className="flex-1">Cancelar</Button><Button onClick={() => onConfirm(targetLevel)} variant="primary" className="flex-1">{isUpgrade ? "Ascender" : "Voltar"} <Rocket size={18} className={!isUpgrade ? "rotate-180" : ""} /></Button></div>
      </GlassCard>
    </div>
  );
};

const GlassCard = ({ children, className = "", hoverEffect = false }) => (<div className={`relative bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-2xl p-6 ${hoverEffect ? 'hover:bg-slate-800/60 hover:border-cyan-500/30 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] transition-all duration-500 group' : ''} ${className}`}>{children}</div>);
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = { primary: "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/40 hover:scale-[1.02]", secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20", glow: "bg-slate-900 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)] hover:bg-cyan-950/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-cyan-400" };
  return (<button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}><span className="relative z-10 flex items-center gap-2">{children}</span>{variant === 'primary' && (<div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />)}</button>);
};
const NavButton = ({ icon: Icon, label, active, onClick }) => (<button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${active ? 'bg-gradient-to-r from-cyan-900/40 to-transparent border-l-2 border-cyan-500 text-cyan-400 shadow-[inset_10px_0_20px_-10px_rgba(6,182,212,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}`}><Icon size={20} className={`transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'group-hover:scale-110'}`} /><span className="font-bold tracking-wide text-sm">{label}</span></button>);
const QuickActionCard = ({ icon: Icon, label, onClick }) => (<button onClick={onClick} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all duration-300 group text-left w-full h-full"><div className="p-2 rounded-lg bg-slate-900 text-cyan-500 group-hover:scale-110 transition-transform"><Icon size={20} /></div><span className="font-bold text-slate-300 group-hover:text-white text-sm">{label}</span><ArrowUpRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" /></button>);

const TOOLKIT_DATA = [ { id: 'creation', title: 'Criação & Inteligência', icon: BrainCircuit, description: 'Motores de IA para gerar conteúdo e estrutura.', tools: [ { name: 'Gamma.app', desc: 'Gere ebooks, slides e sites inteiros com um prompt.', url: 'https://gamma.app', tag: 'Essencial', color: 'text-purple-400' }, { name: 'Gemini Ultra', desc: 'Seu co-piloto para copy, roteiros e estratégia.', url: 'https://gemini.google.com', tag: 'IA Master', color: 'text-blue-400' }, { name: 'Amazon KDP', desc: 'Publique livros físicos e digitais globalmente.', url: 'https://kdp.amazon.com', tag: 'Vendas', color: 'text-orange-400' }, ] }, { id: 'dev_design', title: 'Estrutura & Tech', icon: Wrench, description: 'Construa seu império digital sem código.', tools: [ { name: 'v0.dev', desc: 'Interface de usuário gerada por IA. Copie e cole.', url: 'https://v0.dev', tag: 'No-Code', color: 'text-white' }, { name: 'Netlify', desc: 'Hospedagem profissional gratuita para seus projetos.', url: 'https://www.netlify.com', tag: 'Infra', color: 'text-teal-400' }, { name: 'Carrd', desc: 'Landing pages de alta conversão em minutos.', url: 'https://carrd.co', tag: 'Rápido', color: 'text-indigo-400' }, ] }, { id: 'traffic', title: 'Tráfego & Viralização', icon: Zap, description: 'Ferramentas para dominar a atenção.', tools: [ { name: 'Opus Clip', desc: 'Transforme 1 vídeo longo em 10 curtos virais.', url: 'https://www.opus.pro', tag: 'Viral', color: 'text-yellow-400' }, { name: 'CapCut', desc: 'O editor mobile padrão ouro do mercado.', url: 'https://www.capcut.com', tag: 'Editor', color: 'text-white' }, ] }, { id: 'analytics', title: 'Análise & Métricas', icon: BarChart, description: 'Ferramentas essenciais para rastrear visitantes e otimizar campanhas.', tools: [ { name: 'Google Tag Manager', desc: 'Rastreamento completo do site e eventos (links, botões).', url: 'https://tagmanager.google.com/', tag: 'Essencial', color: 'text-green-400' }, { name: 'Meta Pixel/Ads', desc: 'Rastreamento de conversão para campanhas no Facebook/Instagram.', url: 'https://business.facebook.com/adsmanager/', tag: 'Poderoso', color: 'text-blue-500' }, ] }, { id: 'sales', title: 'Ecossistema de Vendas', icon: Target, description: 'Gateways de pagamento e checkout.', tools: [ { name: 'Kiwify', desc: 'A melhor experiência de checkout atual.', url: 'https://kiwify.com.br', tag: 'Recomendado', color: 'text-green-400' }, { name: 'Kirvano', desc: 'Taxas agressivas e boa aprovação.', url: 'https://kirvano.com', tag: 'Nova', color: 'text-purple-400' }, { name: 'Cakto', desc: 'Design limpo e foco em conversão.', url: 'https://cakto.com.br', tag: 'Simples', color: 'text-pink-400' }, { name: 'Hotmart', desc: 'Líder global, robusta para afiliados.', url: 'https://hotmart.com', tag: 'Global', color: 'text-orange-500' }, { name: 'Eduzz', desc: 'Integração sólida para afiliados.', url: 'https://eduzz.com', tag: 'Afiliados', color: 'text-yellow-500' }, ] } ];
const MISSIONS_DATA = { iniciante: { fase1: [ { id: 'ini_d1', text: 'Dia 1: Definição de Nicho e Micro-segmentação', xp: 100 }, { id: 'ini_d2', text: 'Dia 2: Mapeamento Profundo de Avatar (Dores/Desejos)', xp: 100 }, { id: 'ini_d3', text: 'Dia 3: Análise de Concorrência (Benchmarking Top 5)', xp: 100 }, { id: 'ini_d4', text: 'Dia 4: Criação da "Big Idea" e Promessa Única', xp: 150 }, { id: 'ini_d5', text: 'Dia 5: Identidade Visual MVP (Logo e Paleta no Canva)', xp: 150 }, ], fase1_summary: { done: "Nesta etapa, você construiu os alicerces invisíveis, mas essenciais, do seu negócio...", result: "O resultado prático aqui é Clareza Mental Absoluta e Direção..." }, fase2: [ { id: 'ini_d6', text: 'Dia 6: Estruturação do Produto (Outline do Ebook/Curso)', xp: 200 }, { id: 'ini_d7', text: 'Dia 7: Produção de Conteúdo Base (Escrita ou Gravação com IA)', xp: 250 }, { id: 'ini_d8', text: 'Dia 8: Configuração da Área de Membros (Kiwify/Hotmart)', xp: 200 }, { id: 'ini_d9', text: 'Dia 9: Construção da Página de Vendas (Headline + VSL)', xp: 300 }, { id: 'ini_d10', text: 'Dia 10: Deploy Técnico: Hospedar Site no Netlify/Vercel', xp: 400 }, ], fase2_summary: { done: "Seu império digital agora tem um endereço e um produto real...", result: "O resultado é uma Loja Aberta e Funcional..." }, fase3: [ { id: 'ini_d11', text: 'Dia 11: Configuração de Checkout e Order Bump', xp: 300 }, { id: 'ini_d12', text: 'Dia 12: Implementação de Back Redirect (Recuperação)', xp: 400 }, { id: 'ini_d13', text: 'Dia 13: Criação de Criativos Orgânicos (10 Cortes Virais)', xp: 350 }, { id: 'ini_d14', text: 'Dia 14: Estratégia de Tráfego X1 (Script Whatsapp)', xp: 300 }, { id: 'ini_d15', text: 'Dia 15: Lançamento Semente / Abertura de Carrinho', xp: 500 }, ], fase3_summary: { done: "Você ativou a máquina de guerra de vendas...", result: "O resultado esperado é Tráfego e Validação da Oferta..." } }, mestre: { fase1: [ { id: 'mst_d16', text: 'Dia 16: Configuração Profissional do Business Manager (Meta)', xp: 400 }, { id: 'mst_d17', text: 'Dia 17: Instalação Avançada de Pixel e API de Conversão', xp: 500 }, { id: 'mst_d18', text: 'Dia 18: Criação de Públicos (Lookalike e Custom Audiences)', xp: 450 }, { id: 'mst_d19', text: 'Dia 19: Subir Campanha de Teste AB (Criativos)', xp: 600 }, { id: 'mst_d20', text: 'Dia 20: Análise de Métricas Primárias (CTR, CPC, CPM)', xp: 500 }, ], fase1_summary: { done: "Sua infraestrutura de tráfego pago foi profissionalizada...", result: "O resultado são Dados Reais e Escaláveis..." }, fase2: [ { id: 'mst_d21', text: 'Dia 21: Implementação de Upsell 1-Clique (Página de Obrigado)', xp: 600 }, { id: 'mst_d22', text: 'Dia 22: Estruturação de Downsell (Recuperação de Venda Perdida)', xp: 550 }, { id: 'mst_d23', text: 'Dia 23: Automação de Email Marketing (Sequência de Boas-vindas)', xp: 500 }, { id: 'mst_d24', text: 'Dia 24: Otimização de Página (Heatmaps e Velocidade)', xp: 400 }, { id: 'mst_d25', text: 'Dia 25: Configuração de Remarketing Dinâmico', xp: 600 }, ], fase2_summary: { done: "Você construiu um ecossistema de lucro máximo...", result: "O resultado é Eficiência Financeira Pura..." }, fase3: [ { id: 'mst_d26', text: 'Dia 26: Escala Vertical (Aumento de Orçamento Gradual)', xp: 700 }, { id: 'mst_d27', text: 'Dia 27: Escala Horizontal (Novos Públicos e Canais)', xp: 800 }, { id: 'mst_d28', text: 'Dia 28: Delegação: Criar Processos para Suporte/Vendas', xp: 900 }, { id: 'mst_d29', text: 'Dia 29: Análise de LTV e Planejamento Financeiro', xp: 800 }, { id: 'mst_d30', text: 'Dia 30: Encerramento do Ciclo e Planejamento do Próximo Mês', xp: 1000 }, ], fase3_summary: { done: "Você transformou uma simples campanha de vendas em uma empresa real...", result: "O resultado final é Liberdade e Previsibilidade..." } } };

export default function NexusApp() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savingTask, setSavingTask] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [tempNiche, setTempNiche] = useState('');
  const [nicheSuggestion, setNicheSuggestion] = useState(''); 
  const [tempLevel, setTempLevel] = useState('iniciante');

  const userDocRef = (uid) => doc(db, 'artifacts', appId, 'users', uid, 'data', 'profile');

  useEffect(() => {
    if (!auth) {
      console.error("O Firebase Auth não foi inicializado. Impossível logar.");
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Erro no Auth Automático:", error);
        setLoading(false);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docSnap = await getDoc(userDocRef(currentUser.uid));
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            setUserData(null);
          }
        } catch (e) {
          console.error("Erro ao buscar dados do usuário:", e);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNicheInput = (e) => {
    const val = e.target.value;
    setTempNiche(val);
    const lowerVal = val.toLowerCase().trim();
    if (NICHE_CORRECTIONS[lowerVal] && NICHE_CORRECTIONS[lowerVal] !== val) {
      setNicheSuggestion(NICHE_CORRECTIONS[lowerVal]);
    } else {
      setNicheSuggestion('');
    }
  };

  const applySuggestion = () => {
    setTempNiche(nicheSuggestion);
    setNicheSuggestion('');
  };

  const completeOnboarding = async () => {
    if (!user) return;
    setLoading(true);
    const initialData = {
      niche: tempNiche,
      level: tempLevel,
      joinedAt: new Date().toISOString(),
      completedTasks: [],
      xp: 0
    };
    try {
      await setDoc(userDocRef(user.uid), initialData);
      setUserData(initialData);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const toggleTask = async (taskId, isDone) => {
    if (!user || savingTask) return;
    setSavingTask(true);
    let specificTaskXP = 0;
    Object.values(MISSIONS_DATA).forEach(levelData => {
      Object.values(levelData).forEach(phaseData => {
        if (Array.isArray(phaseData)) {
          const found = phaseData.find(t => t.id === taskId);
          if (found) specificTaskXP = found.xp;
        }
      });
    });
    const currentTasks = userData.completedTasks || [];
    const currentXP = userData.xp || 0;
    const newTasks = isDone ? [...currentTasks, taskId] : currentTasks.filter(id => id !== taskId);
    let newXP = isDone ? currentXP + specificTaskXP : currentXP - specificTaskXP;
    if (newXP < 0) newXP = 0;
    setUserData({ ...userData, completedTasks: newTasks, xp: newXP });
    try {
      await updateDoc(userDocRef(user.uid), {
        completedTasks: isDone ? arrayUnion(taskId) : arrayRemove(taskId),
        xp: newXP
      });
    } catch (e) {
      setUserData({ ...userData, completedTasks: currentTasks, xp: currentXP });
    } finally {
      setSavingTask(false);
    }
  };

  const handleLevelChange = async (newLevel) => {
    if (!user || newLevel === userData.level) return;
    setLoading(true);
    setIsLevelUpModalOpen(false);
    try {
      await updateDoc(userDocRef(user.uid), { level: newLevel });
      setUserData({ ...userData, level: newLevel });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const calculateProgress = () => {
    if (!userData || !userData.level || !MISSIONS_DATA[userData.level]) return 0;
    const levelMissions = MISSIONS_DATA[userData.level];
    const currentLevelTaskIds = [ ...(levelMissions.fase1 || []), ...(levelMissions.fase2 || []), ...(levelMissions.fase3 || []) ].map(t => t.id);
    const totalTasks = currentLevelTaskIds.length;
    const completedCount = (userData.completedTasks || []).filter(taskId => currentLevelTaskIds.includes(taskId)).length;
    if (totalTasks === 0) return 0;
    return Math.round((completedCount / totalTasks) * 100);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center flex-col gap-8">
      <div className="relative"><div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse"></div><NexusLogo className="h-24 relative z-10" /></div>
      <div className="w-64 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-pulse"></div></div>
    </div>
  );

  // --- TELA DE ERRO CRÍTICO (Evita Tela Preta) ---
  if (!auth && !user && !loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-8">
        <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-2xl max-w-2xl text-center backdrop-blur-xl">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-white mb-4">Falha na Inicialização</h1>
          <p className="text-red-200 mb-6 text-lg">O sistema não conseguiu carregar a configuração de segurança (Firebase).</p>
          
          <div className="bg-black/50 p-4 rounded-lg text-left font-mono text-xs text-red-300 overflow-auto mb-6 border border-white/10">
            {initError || "Erro desconhecido. Verifique se a variável REACT_APP_FIREBASE_CONFIG_JSON está definida corretamente no Netlify."}
          </div>

          <div className="text-slate-400 text-sm">
            <p className="mb-2 font-bold">Como corrigir:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Vá no Netlify {'>'} Configurações {'>'} Variáveis de Ambiente.</li>
              <li>Verifique se a chave é <strong>REACT_APP_FIREBASE_CONFIG_JSON</strong>.</li>
              <li>Verifique se o valor é um JSON válido (use aspas retas <code>"</code> e não curvas).</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-xl w-full relative z-10">
          <div className="mb-12 text-center"><NexusLogo className="h-16 mx-auto mb-6" /><h1 className="text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Inicialização do Sistema</h1><p className="text-slate-400 text-lg">Configure o Nexus para maximizar sua produtividade.</p></div>
          <GlassCard className="border-t border-white/10 shadow-2xl">
            {onboardingStep === 0 && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Defina seu Nicho</label>
                  <div className="relative">
                    <input type="text" value={tempNiche} onChange={handleNicheInput} placeholder="Ex: Marketing, Finanças, Fitness..." spellCheck={true} lang="pt-BR" className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-5 text-white text-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all placeholder:text-slate-600" autoFocus />
                    {nicheSuggestion && (<div onClick={applySuggestion} className="absolute top-full left-0 mt-2 bg-slate-800 text-cyan-400 text-sm py-2 px-4 rounded-lg shadow-lg cursor-pointer flex items-center gap-2 animate-bounce hover:bg-slate-700 border border-cyan-500/30"><Wand2 size={14} />Você quis dizer: <strong>{nicheSuggestion}</strong>?</div>)}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">{POPULAR_NICHES.map(niche => (<button key={niche} onClick={() => setTempNiche(niche)} className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 transition-colors text-slate-400">{niche}</button>))}</div>
                </div>
                <Button onClick={() => tempNiche && setOnboardingStep(1)} variant="primary" className="w-full h-14 text-lg">Confirmar Nicho <ChevronRight /></Button>
              </div>
            )}
            {onboardingStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">Nível de Experiência</label>
                <div className="grid grid-cols-1 gap-4">{['iniciante', 'mestre'].map((lvl) => (<button key={lvl} onClick={() => setTempLevel(lvl)} className={`p-6 rounded-xl border transition-all text-left relative overflow-hidden group ${tempLevel === lvl ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : 'bg-slate-950/30 border-slate-800 hover:bg-slate-900 hover:border-slate-600'}`}><div className="relative z-10"><div className={`text-xl font-bold mb-1 capitalize ${tempLevel === lvl ? 'text-cyan-400' : 'text-white'}`}>{lvl}</div><div className="text-sm text-slate-400">{lvl === 'iniciante' ? 'Construindo as bases e primeira venda.' : 'Escalando tráfego e otimizando LTV.'}</div></div>{tempLevel === lvl && <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />}</button>))}</div>
                <div className="flex gap-4 pt-4"><Button onClick={() => setOnboardingStep(0)} variant="secondary" className="px-6">Voltar</Button><Button onClick={completeOnboarding} variant="primary" className="flex-1">Ativar Protocolo <Rocket size={20} /></Button></div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const currentMissions = MISSIONS_DATA[userData.level || 'iniciante'] || MISSIONS_DATA['iniciante'];
  const isMasterComplete = userData.level === 'mestre' && progress >= 100;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="md:hidden absolute top-0 left-0 right-0 h-20 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-6 z-50"><NexusLogo className="h-8" showText={false} /><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2 active:scale-95 transition-transform">{mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}</button></div>
      <>
        {mobileMenuOpen && <div className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />}
        <aside className={`fixed md:relative top-0 bottom-0 left-0 w-80 bg-[#0b1120] border-r border-white/5 flex flex-col z-50 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-8 pb-10"><NexusLogo className="h-12" /></div>
          <nav className="flex-1 px-6 space-y-2">
            <NavButton icon={LayoutDashboard} label="Painel de Comando" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setMobileMenuOpen(false);}} />
            <NavButton icon={Wrench} label="Arsenal Nexus" active={activeTab === 'arsenal'} onClick={() => {setActiveTab('arsenal'); setMobileMenuOpen(false);}} />
            <NavButton icon={CheckSquare} label="Protocolo & Missões" active={activeTab === 'tasks'} onClick={() => {setActiveTab('tasks'); setMobileMenuOpen(false);}} />
            <NavButton icon={MessageCircle} label="Suporte & Contato" active={activeTab === 'contacts'} onClick={() => {setActiveTab('contacts'); setMobileMenuOpen(false);}} />
            <NavButton icon={ShieldCheck} label="Legal & Termos" active={activeTab === 'legal'} onClick={() => {setActiveTab('legal'); setMobileMenuOpen(false);}} />
          </nav>
          <div className="p-6"><GlassCard className="bg-gradient-to-br from-slate-800 to-slate-900 border-t border-white/10"><div className="flex items-center gap-4"><div className="relative"><div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">{userData.niche?.substring(0,2).toUpperCase()}</div><div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div></div><div className="flex-1 overflow-hidden"><p className="text-white font-bold truncate capitalize">{userData.level}</p><p className="text-xs text-slate-400 font-mono mt-0.5 truncate">XP: {userData.xp || 0}</p></div></div></GlassCard></div>
        </aside>
      </>
      <main className="flex-1 relative h-screen overflow-y-auto overflow-x-hidden pt-24 md:pt-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"><div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" /><div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" /></div>
        <div className="relative z-10 p-6 md:p-12 max-w-7xl mx-auto pb-20">
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-fadeIn">
              <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8"><div><h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Visão Geral</h2><p className="text-slate-400 text-lg flex items-center gap-2">Bem-vindo ao quartel general, <span className="text-cyan-400 font-bold">{userData.niche}</span>.</p></div><div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span className="text-xs font-bold text-slate-300 tracking-wider">SISTEMA ONLINE</span></div></header>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><GlassCard className="h-full flex flex-col justify-between overflow-hidden group"><div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-cyan-500/20 transition-colors duration-700" /><div className="relative z-10"><div className="flex items-center gap-3 mb-6"><span className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider"><Zap size={14} /> Status Atual</span></div><h3 className="text-3xl font-bold text-white mb-2">{progress >= 100 ? "Nível Dominado" : "Em Progresso"}</h3><p className="text-slate-300 max-w-lg text-lg leading-relaxed">{progress >= 100 ? "Você completou todas as diretrizes. Avance de nível agora!" : `Você completou ${progress}% do protocolo ${userData.level}. Continue executando as missões diárias.`}</p></div><div className="relative z-10 mt-8"><div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out relative" style={{ width: `${progress}%` }}><div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-r from-transparent to-white/30 animate-[shimmer_2s_infinite]"></div></div></div><div className="flex justify-between mt-2 text-xs font-mono text-slate-500"><span>INÍCIO</span><span>DOMINÂNCIA TOTAL</span></div></div><Button onClick={() => setIsLevelUpModalOpen(true)} variant="secondary" className={`mt-6 w-full md:w-auto self-end text-sm ${userData.level === 'iniciante' ? 'border-purple-500/50 text-purple-400 hover:bg-purple-900/20' : 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20'}`}>{userData.level === 'iniciante' ? <>Ascender para Nível Mestre <Award size={18} /></> : <>Voltar para Nível Iniciante <RotateCcw size={18} /></>}</Button></GlassCard></div>
                <div className="grid grid-rows-2 gap-6"><GlassCard className="flex items-center gap-5 group hover:bg-purple-900/20 transition-colors"><div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300"><Trophy size={32} /></div><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">XP Acumulado</p><p className="text-3xl font-black text-white">{userData.xp || 0}</p></div></GlassCard><GlassCard className="flex items-center gap-5 group hover:bg-cyan-900/20 transition-colors"><div className="p-4 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300"><Target size={32} /></div><div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Missões Cumpridas</p><p className="text-3xl font-black text-white">{(userData.completedTasks || []).length}</p></div></GlassCard></div>
              </div>
              <div><h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Sparkles size={20} className="text-yellow-400" /> Acesso Rápido</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"><QuickActionCard icon={Rocket} label="Ir para Missões" onClick={() => setActiveTab('tasks')} /><QuickActionCard icon={Wrench} label="Abrir Ferramentas" onClick={() => setActiveTab('arsenal')} />{isMasterComplete && (<a href="https://nexusdigital.net.br" target="_blank" rel="noopener noreferrer" className="col-span-1 md:col-span-2 lg:col-span-2 group relative overflow-hidden rounded-xl border border-yellow-500/50 bg-gradient-to-r from-yellow-900/40 to-orange-900/40 p-6 transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.3)] flex items-center justify-between"><div className="relative z-10 flex items-center gap-4"><div className="rounded-full bg-yellow-500/20 p-3 text-yellow-400 ring-1 ring-yellow-500/50"><Crown size={24} className="animate-pulse" /></div><div><h4 className="text-lg font-black text-white">Dominância Suprema</h4><p className="text-sm font-medium text-yellow-200/80">Você zerou o protocolo. Agora acesse o conhecimento oculto.</p></div></div><div className="relative z-10 rounded-lg bg-yellow-500 px-4 py-2 text-xs font-bold text-black shadow-lg transition-transform group-hover:translate-x-1">ACESSAR</div><div className="absolute -right-12 top-0 h-full w-32 bg-gradient-to-l from-yellow-500/20 to-transparent blur-2xl group-hover:w-48 transition-all duration-500" /></a>)}</div></div>
            </div>
          )}
          {activeTab === 'arsenal' && (
            <div className="animate-fadeIn">
              <header className="mb-12 text-center md:text-left"><h2 className="text-4xl font-black text-white mb-4">Arsenal Nexus</h2><p className="text-slate-400 text-lg max-w-2xl">Curadoria de elite. Apenas ferramentas que geram ROI positivo.</p></header>
              {userData.level === 'iniciante' && (<div className="mb-8 p-6 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 flex flex-col md:flex-row items-start gap-5 shadow-[0_0_30px_-10px_rgba(234,179,8,0.1)]"><div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500 shrink-0 border border-yellow-500/20"><AlertTriangle size={28} /></div><div><h4 className="text-yellow-400 font-black text-xl mb-2 tracking-tight">Dica de Ouro (Modo Gratuito)</h4><p className="text-slate-300 text-base leading-relaxed font-medium">Algumas IAs na versão gratuita possuem limites de uso ou projetos. Se você atingir o teto, uma estratégia válida é <strong className="text-white">utilizar contas de e-mail diferentes</strong> para continuar acessando o serviço gratuitamente e concluir seu planejamento sem custos extras.</p></div></div>)}
              <div className="grid gap-12">{TOOLKIT_DATA.map((cat) => (<div key={cat.id}><div className="flex items-center gap-4 mb-6"><div className={`p-3 rounded-xl bg-slate-900 border border-white/10 ${cat.tools[0].color}`}><cat.icon size={24} /></div><h3 className="text-2xl font-bold text-white">{cat.title}</h3></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{cat.tools.map((tool, idx) => (<ToolCard key={idx} tool={tool} />))}</div></div>))}</div>
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="animate-fadeIn max-w-4xl mx-auto">
              <header className="mb-12 text-center"><span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">Protocolo de 30 Dias</span><h2 className="text-4xl md:text-5xl font-black text-white mb-4">Matriz de Execução</h2><p className="text-slate-400">Siga o plano diário para construir e escalar seu império digital.</p></header>
              <div className="space-y-8">
                <div className="relative"><div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500 to-transparent hidden md:block"></div><h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-mono text-sm border border-cyan-500/30">{userData.level === 'iniciante' ? '01' : '04'}</span>{userData.level === 'iniciante' ? 'Dias 1-5: Fundação & Mentalidade' : 'Dias 16-20: Tráfego & Dados'}</h3><div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">{currentMissions.fase1.map(task => (<TaskItem key={task.id} {...task} done={(userData.completedTasks || []).includes(task.id)} onToggle={toggleTask} />))}<PhaseSummary data={currentMissions.fase1_summary} setActiveTab={setActiveTab} /></div></div>
                <div className="relative pt-8"><div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-purple-500 to-transparent hidden md:block"></div><h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-400 font-mono text-sm border border-purple-500/30">{userData.level === 'iniciante' ? '02' : '05'}</span>{userData.level === 'iniciante' ? 'Dias 6-10: Produto & Estrutura' : 'Dias 21-25: Funis & LTV'}</h3><div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">{currentMissions.fase2.map(task => (<TaskItem key={task.id} {...task} done={(userData.completedTasks || []).includes(task.id)} onToggle={toggleTask} />))}<PhaseSummary data={currentMissions.fase2_summary} setActiveTab={setActiveTab} /></div></div>
                {currentMissions.fase3 && (<div className="relative pt-8"><div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-green-500 to-transparent hidden md:block"></div><h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-green-900/50 flex items-center justify-center text-green-400 font-mono text-sm border border-green-500/30">{userData.level === 'iniciante' ? '03' : '06'}</span>{userData.level === 'iniciante' ? 'Dias 11-15: Lançamento & Venda' : 'Dias 26-30: Escala & Gestão'}</h3><div className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl">{currentMissions.fase3.map(task => (<TaskItem key={task.id} {...task} done={(userData.completedTasks || []).includes(task.id)} onToggle={toggleTask} />))}<PhaseSummary data={currentMissions.fase3_summary} setActiveTab={setActiveTab} /></div></div>)}
              </div>
            </div>
          )}
          {activeTab === 'contacts' && (
            <div className="animate-fadeIn max-w-4xl mx-auto pb-8">
              <header className="mb-12 text-center md:text-left"><h2 className="text-4xl font-black text-white mb-4">Central de Suporte</h2><p className="text-slate-400 text-lg max-w-2xl">Precisa de ajuda personalizada? Fale diretamente com nosso time.</p></header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><a href="https://wa.me/5524981073909" target="_blank" rel="noopener noreferrer" className="group block"><GlassCard hoverEffect={true} className="flex flex-col items-center justify-center py-10 gap-4 h-full border-green-500/30 hover:bg-green-950/20"><div className="p-4 bg-green-500/10 rounded-full text-green-400 group-hover:scale-110 transition-transform duration-300"><MessageCircle size={48} /></div><div className="text-center"><h3 className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">WhatsApp Oficial</h3><p className="text-slate-400 mt-2 text-sm font-mono">+55 24 98107-3909</p></div><span className="mt-4 px-6 py-2 rounded-full bg-green-500 text-black font-bold text-sm group-hover:shadow-lg group-hover:shadow-green-500/20 transition-all">Iniciar Conversa</span></GlassCard></a><a href="https://instagram.com/metodo_nexus" target="_blank" rel="noopener noreferrer" className="group block"><GlassCard hoverEffect={true} className="flex flex-col items-center justify-center py-10 gap-4 h-full border-pink-500/30 hover:bg-pink-950/20"><div className="p-4 bg-pink-500/10 rounded-full text-pink-400 group-hover:scale-110 transition-transform duration-300"><Instagram size={48} /></div><div className="text-center"><h3 className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">Instagram</h3><p className="text-slate-400 mt-2 text-sm">@metodo_nexus</p></div><span className="mt-4 px-6 py-2 rounded-full bg-pink-500 text-black font-bold text-sm group-hover:shadow-lg group-hover:shadow-pink-500/20 transition-all">Ver Perfil</span></GlassCard></a></div>
              <div className="mt-8 p-6 rounded-2xl bg-slate-800/50 border border-white/10 text-center"><p className="text-slate-400 text-sm font-medium">Nossa equipe responderá assim que possível.</p></div>
            </div>
          )}
          {activeTab === 'legal' && (
            <div className="animate-fadeIn max-w-4xl mx-auto pb-8">
              <header className="mb-12 text-center md:text-left"><h2 className="text-4xl font-black text-white mb-4">Legal & Transparência</h2><p className="text-slate-400 text-lg max-w-2xl">Compromisso com sua segurança e privacidade.</p></header>
              <div className="space-y-6"><GlassCard><div className="flex items-center gap-3 mb-6"><div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-cyan-400"><ShieldCheck size={24} /></div><h3 className="text-2xl font-bold text-white">Documentação Oficial</h3></div><div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 mb-6"><a href="https://termos-protocolo-dominan-exayvin.gamma.site" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group hover:bg-white/5 p-3 rounded-lg transition-colors"><span className="font-bold text-lg text-slate-200 group-hover:text-cyan-400 transition-colors">Política de Privacidade | Termos de Uso</span><ExternalLink size={20} className="text-slate-500 group-hover:text-cyan-400 transition-colors" /></a></div><div className="text-slate-400 text-sm leading-relaxed space-y-4 font-medium border-t border-white/5 pt-6"><p>© 2025 Arthur Furtado Silva/Nexus Digital. Todos os direitos reservados.</p><p>Este produto é comercializado com garantia incondicional de satisfação por meio da plataforma de pagamentos segura. Os resultados podem variar de acordo com a dedicação e aplicação individual das estratégias.</p></div></GlassCard></div>
            </div>
          )}
        </div>
      </main>
      <LevelUpModal isOpen={isLevelUpModalOpen} onClose={() => setIsLevelUpModalOpen(false)} onConfirm={handleLevelChange} currentLevel={userData.level} progress={progress} />
    </div>
  );
}