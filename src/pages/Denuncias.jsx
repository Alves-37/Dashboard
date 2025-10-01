import { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import AlertModal from '../components/AlertModal';
import ItemCard from '../components/ItemCard';

const Denuncias = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' });
  const [denunciaToDelete, setDenunciaToDelete] = useState(null);
  // Dados simulados - em produção, viriam de uma API
  // Campos do formulário do prototipo37: referenciaTipo, motivo, descricao, anexo (opcional)
  const [denuncias, setDenuncias] = useState([
    {
      id: 1,
      referenciaTipo: 'empresa',
      motivo: 'conteudo_inadequado',
      descricao: 'Empresa publicou vaga com informações discriminatórias sobre idade e gênero.',
      usuarioId: 101,
      usuarioNome: 'João Silva',
      usuarioEmail: 'joao@email.com',
      anexo: null,
      status: 'Pendente',
      data: '2024-09-28 14:30',
    },
    {
      id: 2,
      referenciaTipo: 'mensagem',
      motivo: 'spam',
      descricao: 'Recebendo mensagens repetitivas não solicitadas de um usuário.',
      usuarioId: 102,
      usuarioNome: 'Maria Santos',
      usuarioEmail: 'maria@email.com',
      anexo: 'screenshot.png',
      status: 'Em Análise',
      data: '2024-09-27 10:15',
    },
    {
      id: 3,
      referenciaTipo: 'candidato',
      motivo: 'assedio',
      descricao: 'Candidato enviou mensagens inadequadas e ofensivas.',
      usuarioId: 103,
      usuarioNome: 'Pedro Costa',
      usuarioEmail: 'pedro@email.com',
      anexo: 'evidencia.pdf',
      status: 'Resolvida',
      data: '2024-09-25 16:45',
    },
    {
      id: 4,
      referenciaTipo: 'vaga',
      motivo: 'fraude',
      descricao: 'Vaga falsa solicitando pagamento antecipado para processo seletivo.',
      usuarioId: 104,
      usuarioNome: 'Ana Oliveira',
      usuarioEmail: 'ana@email.com',
      anexo: null,
      status: 'Pendente',
      data: '2024-09-26 09:20',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [selectedDenuncia, setSelectedDenuncia] = useState(null);

  const filteredDenuncias = denuncias.filter(denuncia => {
    const matchesSearch = denuncia.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         denuncia.usuarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         denuncia.motivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || denuncia.status === filterStatus;
    const matchesTipo = filterTipo === 'Todos' || denuncia.referenciaTipo === filterTipo;
    return matchesSearch && matchesStatus && matchesTipo;
  });

  const handleStatusChange = (id, newStatus) => {
    setDenuncias(denuncias.map(denuncia =>
      denuncia.id === id ? { ...denuncia, status: newStatus } : denuncia
    ));
    showAlert('Sucesso!', `Status alterado para "${newStatus}" com sucesso.`, 'success');
  };

  const handleDelete = (id) => {
    setDenunciaToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setDenuncias(denuncias.filter(denuncia => denuncia.id !== denunciaToDelete));
    setIsModalOpen(false);
    setDenunciaToDelete(null);
    showAlert('Sucesso!', 'Denúncia excluída com sucesso.', 'success');
  };

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setShowAlertModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Em Análise': return 'bg-blue-100 text-blue-800';
      case 'Resolvida': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      'empresa': 'Empresa',
      'candidato': 'Candidato',
      'vaga': 'Vaga',
      'mensagem': 'Mensagem',
      'outro': 'Outro'
    };
    return tipos[tipo] || tipo;
  };

  const getTipoColor = (tipo) => {
    const cores = {
      'empresa': 'bg-blue-100 text-blue-800',
      'candidato': 'bg-green-100 text-green-800',
      'vaga': 'bg-yellow-100 text-yellow-800',
      'mensagem': 'bg-purple-100 text-purple-800',
      'outro': 'bg-gray-100 text-gray-800'
    };
    return cores[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getMotivoLabel = (motivo) => {
    const motivos = {
      'fraude': 'Fraude',
      'spam': 'Spam',
      'assedio': 'Assédio',
      'conteudo_inadequado': 'Conteúdo Inadequado',
      'outro': 'Outro'
    };
    return motivos[motivo] || motivo;
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Gestão de Denúncias</h1>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
            <input
              type="text"
              placeholder="Buscar denúncias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option>Todos</option>
              <option>Pendente</option>
              <option>Em Análise</option>
              <option>Resolvida</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option>Todos</option>
              <option value="empresa">Empresa</option>
              <option value="candidato">Candidato</option>
              <option value="vaga">Vaga</option>
              <option value="mensagem">Mensagem</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredDenuncias.map((denuncia) => (
          <ItemCard
            key={denuncia.id}
            onClick={() => {
              setSelectedDenuncia(denuncia);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(denuncia.referenciaTipo)}`}>
                    {getTipoLabel(denuncia.referenciaTipo)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(denuncia.status)}`}>
                    {denuncia.status}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{getMotivoLabel(denuncia.motivo)}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{denuncia.descricao}</p>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Denunciante:</span>
                <span className="font-medium text-gray-900">{denuncia.usuarioNome}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Data:</span>
                <span className="text-gray-900">{denuncia.data}</span>
              </div>
              {denuncia.anexo && (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span>Anexo disponível</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                Ver Detalhes →
              </button>
            </div>
          </ItemCard>
        ))}
      </div>

      {filteredDenuncias.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma denúncia encontrada</h3>
          <p className="text-gray-600">Tente ajustar os filtros de busca</p>
        </div>
      )}

      {/* Modal de Detalhes */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDenuncia(null);
        }}
        title="Detalhes da Denúncia"
      >
        {selectedDenuncia && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-gray-900 font-semibold">#{selectedDenuncia.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data/Hora</label>
                <p className="text-gray-900">{selectedDenuncia.data}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Usuário</label>
                <p className="text-gray-900 font-medium">{selectedDenuncia.usuarioNome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">
                  <a href={`mailto:${selectedDenuncia.usuarioEmail}`} className="text-blue-600 hover:underline">
                    {selectedDenuncia.usuarioEmail}
                  </a>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo de Denúncia</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getTipoColor(selectedDenuncia.referenciaTipo)}`}>
                    {getTipoLabel(selectedDenuncia.referenciaTipo)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Motivo</label>
                <p className="text-gray-900 mt-1">{getMotivoLabel(selectedDenuncia.motivo)}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Descrição</label>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedDenuncia.descricao}</p>
            </div>

            {selectedDenuncia.anexo && (
              <div>
                <label className="text-sm font-medium text-gray-500">Anexo/Evidência</label>
                <div className="mt-2 flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-blue-700 font-medium">{selectedDenuncia.anexo}</span>
                  </div>
                  <button
                    onClick={() => {
                      // Em produção, fazer download do arquivo do servidor
                      showAlert(
                        'Download',
                        `Arquivo: ${selectedDenuncia.anexo}\n\nEm produção, isso fará o download do arquivo do servidor.`,
                        'info'
                      );
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500">Status Atual</label>
              <div className="mt-2">
                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedDenuncia.status)}`}>
                  {selectedDenuncia.status}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-2">Alterar Status</label>
              <select
                value={selectedDenuncia.status}
                onChange={(e) => handleStatusChange(selectedDenuncia.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>Pendente</option>
                <option>Em Análise</option>
                <option>Resolvida</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  handleStatusChange(selectedDenuncia.id, 'Resolvida');
                  setIsModalOpen(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
              >
                ✓ Resolver
              </button>
              <button
                onClick={() => handleDelete(selectedDenuncia.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
              >
                🗑 Excluir
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setDenunciaToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta denúncia?\n\nEsta ação não pode ser desfeita!"
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de Alerta */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
};

export default Denuncias;
