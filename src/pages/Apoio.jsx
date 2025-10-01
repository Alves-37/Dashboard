import { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import AlertModal from '../components/AlertModal';
import ItemCard from '../components/ItemCard';

const Apoio = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [mensagemToDelete, setMensagemToDelete] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' });

  // Dados simulados - em produção, viriam de uma API
  // Campos do formulário do prototipo37: nome, email, mensagem
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      mensagem: 'Não consigo fazer login na minha conta. Quando tento entrar, aparece uma mensagem de erro.',
      status: 'Pendente',
      data: '2024-09-28 14:30'
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@email.com',
      mensagem: 'Como faço para alterar meu perfil? Gostaria de mudar minha foto e informações de contato.',
      status: 'Em Atendimento',
      data: '2024-09-27 10:15'
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro@email.com',
      mensagem: 'Aparece erro 500 ao tentar enviar mensagem para uma empresa. Já tentei várias vezes.',
      status: 'Resolvido',
      data: '2024-09-25 16:45'
    },
    {
      id: 4,
      nome: 'Ana Oliveira',
      email: 'ana@email.com',
      mensagem: 'Gostaria de saber mais sobre os planos disponíveis e suas funcionalidades.',
      status: 'Pendente',
      data: '2024-09-26 09:20'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const filteredMensagens = mensagens.filter(msg => {
    const matchesSearch = msg.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.mensagem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || msg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setShowAlertModal(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setMensagens(mensagens.map(msg =>
      msg.id === id ? { ...msg, status: newStatus } : msg
    ));
    showAlert('Sucesso!', `Status alterado para "${newStatus}" com sucesso.`, 'success');
  };

  const handleMarcarRespondido = (id) => {
    setMensagens(mensagens.map(msg =>
      msg.id === id ? { ...msg, status: 'Resolvido' } : msg
    ));
    showAlert('Sucesso!', 'Mensagem marcada como respondida.', 'success');
  };

  const handleDelete = (id) => {
    setMensagemToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setMensagens(mensagens.filter(msg => msg.id !== mensagemToDelete));
    setIsModalOpen(false);
    setMensagemToDelete(null);
    showAlert('Sucesso!', 'Mensagem de apoio excluída com sucesso.', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Em Atendimento': return 'bg-blue-100 text-blue-800';
      case 'Resolvido': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Central de Apoio</h1>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
            <input
              type="text"
              placeholder="Buscar por nome, email ou mensagem..."
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
              <option>Em Atendimento</option>
              <option>Resolvido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredMensagens.map((msg) => (
          <ItemCard
            key={msg.id}
            onClick={() => {
              setSelectedTicket(msg);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{msg.nome}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{msg.email}</p>
                <p className="text-sm text-gray-600 line-clamp-3">{msg.mensagem}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">📅 {msg.data}</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Ver Detalhes →
                </button>
              </div>
            </div>
          </ItemCard>
        ))}
      </div>

      {filteredMensagens.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma mensagem encontrada</h3>
          <p className="text-gray-600">Tente ajustar os filtros de busca</p>
        </div>
      )}

      {/* Modal de Detalhes */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        title="Detalhes da Mensagem"
      >
        {selectedTicket && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-gray-900 font-semibold">#{selectedTicket.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data/Hora</label>
                <p className="text-gray-900">{selectedTicket.data}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-gray-900 font-medium text-lg">{selectedTicket.nome}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">
                <a href={`mailto:${selectedTicket.email}`} className="text-blue-600 hover:underline">
                  {selectedTicket.email}
                </a>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Mensagem</label>
              <p className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{selectedTicket.mensagem}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status Atual</label>
              <div className="mt-2">
                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-2">Alterar Status</label>
              <select
                value={selectedTicket.status}
                onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>Pendente</option>
                <option>Em Atendimento</option>
                <option>Resolvido</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  handleMarcarRespondido(selectedTicket.id);
                  setIsModalOpen(false);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium"
              >
                ✓ Marcar como Respondido
              </button>
              <button
                onClick={() => handleDelete(selectedTicket.id)}
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
          setMensagemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta mensagem de apoio?\n\nEsta ação não pode ser desfeita!"
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

export default Apoio;
