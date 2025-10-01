import Card from '../components/Card';

const Dashboard = () => {
  // Dados simulados - em produção, viriam de uma API
  const stats = {
    totalUsuarios: 1234,
    usuariosAtivos: 987,
    totalDenuncias: 56,
    denunciasPendentes: 23,
    denunciasResolvidas: 33,
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-8">
        <Card
          title="Total de Usuários"
          value={stats.totalUsuarios}
          icon="👥"
          color="blue"
        />
        <Card
          title="Usuários Ativos"
          value={stats.usuariosAtivos}
          icon="✅"
          color="green"
        />
        <Card
          title="Total de Denúncias"
          value={stats.totalDenuncias}
          icon="⚠️"
          color="yellow"
        />
        <Card
          title="Denúncias Pendentes"
          value={stats.denunciasPendentes}
          icon="⏳"
          color="red"
        />
        <Card
          title="Denúncias Resolvidas"
          value={stats.denunciasResolvidas}
          icon="✔️"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <span className="text-2xl">👤</span>
              <div>
                <p className="font-medium">Novo usuário cadastrado</p>
                <p className="text-sm text-gray-500">Há 5 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium">Nova denúncia recebida</p>
                <p className="text-sm text-gray-500">Há 15 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium">Denúncia resolvida</p>
                <p className="text-sm text-gray-500">Há 1 hora</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estatísticas Rápidas</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Taxa de Resolução</span>
                <span className="text-sm font-medium">59%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '59%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Usuários Ativos</span>
                <span className="text-sm font-medium">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Denúncias Pendentes</span>
                <span className="text-sm font-medium">41%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '41%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
