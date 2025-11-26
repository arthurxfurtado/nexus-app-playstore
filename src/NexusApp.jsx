import React from 'react';
import { Rocket, ArrowRight, ShieldCheck } from 'lucide-react'; // Ícones sugeridos

export default function SetupScreen() {
  return (
    // 1. FUNDO GERAL (Mesmo tom dark do dashboard)
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Efeito de luz de fundo (Glow) para dar profundidade */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. CARD CENTRAL (Estilo idêntico aos widgets do dashboard) */}
      <div className="w-full max-w-xl bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* Cabeçalho do Card */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
             {/* Logo simplificado ou ícone */}
             <Rocket className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Nexus<span className="text-blue-500">Digital</span>
            </h1>
            <p className="text-sm text-gray-400">Configuração do Sistema</p>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Defina seu Nicho</h2>
            <p className="text-gray-400 text-sm">
              Para calibrar o Arsenal Nexus, precisamos saber qual mercado você vai dominar.
            </p>
          </div>

          {/* 3. INPUT ESTILIZADO (Estilo Dark Clean) */}
          <div className="group relative">
            <input 
              type="text" 
              placeholder="Ex: Marketing Digital, Finanças, Dropshipping..." 
              className="w-full bg-[#0B0F19] border border-gray-700 text-gray-200 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-4 outline-none transition-all placeholder-gray-600"
            />
            {/* Ícone ou dica visual dentro do input se quiser */}
          </div>

          {/* Tags de Sugestão (Opcional, mas fica bonito) */}
          <div className="flex flex-wrap gap-2">
            {['Marketing', 'SaaS', 'E-book', 'Infoproduto'].map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-medium text-gray-400 bg-[#1F2937] rounded-full border border-gray-700 hover:text-white hover:border-gray-500 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 4. BOTÃO DE AÇÃO (Gradiente igual à barra de progresso) */}
        <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4" />
                <span>Ambiente Seguro</span>
            </div>
            
            <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-900/20 transform hover:scale-[1.02]">
              Inicializar Protocolo
              <ArrowRight className="w-4 h-4" />
            </button>
        </div>

      </div>
      
      {/* Rodapé simples */}
      <p className="mt-6 text-center text-xs text-gray-600">
        &copy; 2025 Nexus Digital. Todos os direitos reservados.
      </p>
    </div>
  );
}