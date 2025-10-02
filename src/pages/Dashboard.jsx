import { useEffect, useState } from 'react';
import Card from '../components/Card';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    usuariosAtivos: 0,
    totalDenuncias: 0,
    denunciasPendentes: 0,
    denunciasResolvidas: 0,
  });
  const [atividade, setAtividade] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchOverview() {
      if (authLoading || !isAuthenticated) return;
      try {
        setLoading(true);
        const res = await api.get('/admin/stats/overview');
        if (cancelled) return;
        const data = res.data || {};
        const usuarios = data.usuarios || {};
        const denuncias = data.denuncias || {};
        setStats({
          totalUsuarios: usuarios.total || 0,
          usuariosAtivos: usuarios.ativos || 0,
          totalDenuncias: denuncias.total || 0,
          denunciasPendentes: denuncias.abertas || 0,
          denunciasResolvidas: denuncias.resolvidas || 0,
        });
        setAtividade(Array.isArray(data.atividade) ? data.atividade : []);
      } catch (e) {
        // opcional: exibir toast/alert
        console.error('Erro ao carregar overview:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOverview();
    return () => { cancelled = true; };
  }, [authLoading, isAuthenticated]);

  const pct = (num, den) => {
    if (!den || den <= 0) return 0;
    return Math.round((num / den) * 100);
  };

  const timeAgo = (dateStr) => {
    try {
      const now = Date.now();
      const at = new Date(dateStr).getTime();
      const diffMs = Math.max(0, now - at);
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Agora';
      if (mins < 60) return `Há ${mins} minuto${mins > 1 ? 's' : ''}`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
      const days = Math.floor(hours / 24);
      return `Há ${days} dia${days > 1 ? 's' : ''}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-6 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </>
        ) : (
          <>
            <Card title="Total de Usuários" value={stats.totalUsuarios} icon="👥" color="blue" />
            <Card title="Usuários Ativos" value={stats.usuariosAtivos} icon="✅" color="green" />
            <Card title="Total de Denúncias" value={stats.totalDenuncias} icon="⚠️" color="yellow" />
            <Card title="Denúncias Pendentes" value={stats.denunciasPendentes} icon="⏳" color="red" />
            <Card title="Denúncias Resolvidas" value={stats.denunciasResolvidas} icon="✔️" color="purple" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Atividade Recente</h2>
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <div className="w-6 h-6 bg-gray-200 rounded" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {atividade.slice(0, 3).map((ev, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <span className="text-2xl">{ev.icon || '•'}</span>
                  <div>
                    <p className="font-medium">{ev.title}</p>
                    <p className="text-sm text-gray-500">{timeAgo(ev.at)}</p>
                  </div>
                </div>
              ))}
              {atividade.length === 0 && (
                <div className="text-sm text-gray-500">Sem eventos recentes.</div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estatísticas Rápidas</h2>
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-10" />
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Taxa de Resolução</span>
                  <span className="text-sm font-medium">{pct(stats.denunciasResolvidas, stats.totalDenuncias)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${pct(stats.denunciasResolvidas, stats.totalDenuncias)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Usuários Ativos</span>
                  <span className="text-sm font-medium">{pct(stats.usuariosAtivos, stats.totalUsuarios)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct(stats.usuariosAtivos, stats.totalUsuarios)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Denúncias Pendentes</span>
                  <span className="text-sm font-medium">{pct(stats.denunciasPendentes, stats.totalDenuncias)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${pct(stats.denunciasPendentes, stats.totalDenuncias)}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
