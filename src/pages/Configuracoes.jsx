import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import AlertModal from '../components/AlertModal';

const Configuracoes = () => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' });
  const [isResetting, setIsResetting] = useState(false);

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setShowAlertModal(true);
  };

  const handleResetDatabase = async () => {
    setIsResetting(true);
    
    // Simular reset do banco de dados
    setTimeout(() => {
      setIsResetting(false);
      setShowResetModal(false);
      showAlert(
        'Sucesso!',
        'Banco de dados resetado com sucesso!\n\nTodos os dados foram restaurados para o estado inicial.',
        'success'
      );
      
      // Em produção, fazer requisição para API
      // await api.post('/admin/reset-database');
      
      // Recarregar após fechar o modal
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, 2000);
  };

  const handleExportData = () => {
    showAlert(
      'Em Desenvolvimento',
      'Funcionalidade de exportação de dados será implementada em breve.',
      'info'
    );
    // Em produção: fazer download de arquivo JSON ou CSV
  };

  const handleClearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    showAlert(
      'Cache Limpo!',
      'Todos os dados temporários foram removidos com sucesso.',
      'success'
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Configurações do Sistema</h1>

      {/* Seção: Banco de Dados */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
          Gerenciamento de Dados
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Resetar Banco de Dados</h3>
              <p className="text-sm text-gray-600">Restaura todos os dados para o estado inicial. Esta ação não pode ser desfeita.</p>
            </div>
            <button
              onClick={() => setShowResetModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Resetar
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Exportar Dados</h3>
              <p className="text-sm text-gray-600">Baixa todos os dados do sistema em formato JSON.</p>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Seção: Cache e Performance */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Cache e Performance
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Limpar Cache</h3>
              <p className="text-sm text-gray-600">Remove dados temporários armazenados localmente.</p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Seção: Informações do Sistema */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Informações do Sistema
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Versão</p>
            <p className="text-lg font-semibold text-gray-800">1.0.0</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Ambiente</p>
            <p className="text-lg font-semibold text-gray-800">Desenvolvimento</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">API Base URL</p>
            <p className="text-lg font-semibold text-gray-800 truncate">http://localhost:5000/api</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Última Atualização</p>
            <p className="text-lg font-semibold text-gray-800">01/10/2025</p>
          </div>
        </div>
      </div>

      {/* Modal de Alerta */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />

      {/* Modal de Confirmação de Reset */}
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetDatabase}
        title="Confirmar Reset"
        message={`Tem certeza que deseja resetar o banco de dados?\n\nEsta ação irá:\n• Remover todos os usuários\n• Remover todas as denúncias\n• Remover todas as mensagens de apoio\n• Restaurar dados de exemplo\n\nEsta ação não pode ser desfeita!`}
        confirmText={isResetting ? "Resetando..." : "Sim, Resetar"}
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal antigo - remover */}
      {false && showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Confirmar Reset</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja resetar o banco de dados? 
              <br /><br />
              <strong className="text-red-600">Esta ação irá:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Remover todos os usuários</li>
                <li>Remover todas as denúncias</li>
                <li>Remover todas as mensagens de apoio</li>
                <li>Restaurar dados de exemplo</li>
              </ul>
              <br />
              <strong className="text-red-600">Esta ação não pode ser desfeita!</strong>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetDatabase}
                disabled={isResetting}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isResetting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetando...
                  </>
                ) : (
                  'Sim, Resetar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;
