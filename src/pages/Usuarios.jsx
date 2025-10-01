import { useState } from 'react';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import AlertModal from '../components/AlertModal';
import ItemCard from '../components/ItemCard';

const Usuarios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' });
  
  // Dados simulados - em produção, viriam de uma API
  // Campos do cadastro do prototipo37: nome, email, senha (não exibida), tipo (usuario/empresa)
  // Perfil adicional: telefone, bio, formacao, experiencia, etc.
  const [usuarios, setUsuarios] = useState([
    { 
      id: 1, 
      nome: 'João Silva', 
      email: 'joao@email.com', 
      tipo: 'usuario', 
      status: 'Ativo', 
      dataCadastro: '2024-01-15 10:30',
      perfil: {
        telefone: '(11) 98765-4321',
        dataNascimento: '1995-05-20',
        endereco: 'São Paulo, SP',
        bio: 'Desenvolvedor Full Stack com 5 anos de experiência',
        formacao: 'Ciência da Computação',
        instituicao: 'USP',
        experiencia: '5 anos',
        linkedin: 'linkedin.com/in/joaosilva',
        github: 'github.com/joaosilva'
      }
    },
    { 
      id: 2, 
      nome: 'TechCorp Ltda', 
      email: 'contato@techcorp.com', 
      tipo: 'empresa', 
      status: 'Ativo', 
      dataCadastro: '2024-02-20 14:45',
      perfil: {
        razaoSocial: 'TechCorp Tecnologia Ltda',
        nuit: '123456789',
        telefone: '(11) 3000-0000',
        endereco: 'Av. Paulista, 1000 - São Paulo, SP',
        descricao: 'Empresa de tecnologia focada em soluções inovadoras',
        setor: 'Tecnologia',
        tamanho: '50-200',
        website: 'www.techcorp.com'
      }
    },
    { 
      id: 3, 
      nome: 'Pedro Costa', 
      email: 'pedro@email.com', 
      tipo: 'usuario', 
      status: 'Inativo', 
      dataCadastro: '2024-03-10 09:15',
      perfil: {
        telefone: '(21) 99876-5432',
        bio: 'Designer UI/UX apaixonado por criar experiências incríveis',
        formacao: 'Design Gráfico',
        experiencia: '3 anos'
      }
    },
    { 
      id: 4, 
      nome: 'Ana Oliveira', 
      email: 'ana@email.com', 
      tipo: 'usuario', 
      status: 'Ativo', 
      dataCadastro: '2024-04-05 16:20',
      perfil: {
        telefone: '(31) 97654-3210',
        bio: 'Analista de dados com foco em Business Intelligence',
        formacao: 'Estatística'
      }
    },
    { 
      id: 5, 
      nome: 'InnovaSoft', 
      email: 'rh@innovasoft.com', 
      tipo: 'empresa', 
      status: 'Ativo', 
      dataCadastro: '2024-05-12 11:00',
      perfil: {
        razaoSocial: 'InnovaSoft Soluções em Software S.A.',
        telefone: '(21) 2500-5000',
        descricao: 'Desenvolvimento de software personalizado',
        setor: 'TI',
        tamanho: '10-50'
      }
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'Todos' || usuario.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setShowAlertModal(true);
  };

  const handleAtivar = (id) => {
    setUsuarios(usuarios.map(usuario => 
      usuario.id === id ? { ...usuario, status: 'Ativo' } : usuario
    ));
    showAlert('Sucesso!', 'Usuário ativado com sucesso.', 'success');
  };

  const handleDesativar = (id) => {
    setUsuarios(usuarios.map(usuario => 
      usuario.id === id ? { ...usuario, status: 'Inativo' } : usuario
    ));
    showAlert('Sucesso!', 'Usuário desativado com sucesso.', 'success');
  };

  const handleBanir = (id) => {
    setUsuarios(usuarios.map(usuario => 
      usuario.id === id ? { ...usuario, status: 'Banido' } : usuario
    ));
  };

  const handleDelete = (id) => {
    setUserToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    setUsuarios(usuarios.filter(usuario => usuario.id !== userToDelete));
    setIsModalOpen(false);
    setUserToDelete(null);
    showAlert('Sucesso!', 'Usuário excluído com sucesso.', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800';
      case 'Inativo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo) => {
    return tipo === 'usuario' ? 'Candidato' : 'Empresa';
  };

  const getTipoColor = (tipo) => {
    return tipo === 'usuario' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestão de Usuários</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option>Todos</option>
              <option>Ativo</option>
              <option>Inativo</option>
              <option>Banido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredUsuarios.map((usuario) => (
          <ItemCard
            key={usuario.id}
            onClick={() => {
              setSelectedUsuario(usuario);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {usuario.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{usuario.nome}</h3>
                  <p className="text-sm text-gray-500">{usuario.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(usuario.tipo)}`}>
                  {getTipoLabel(usuario.tipo)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(usuario.status)}`}>
                  {usuario.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cadastro:</span>
                <span className="text-sm text-gray-900">{usuario.dataCadastro}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                Ver Detalhes →
              </button>
            </div>
          </ItemCard>
        ))}
      </div>

      {filteredUsuarios.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum usuário encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros de busca</p>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <div>
          Mostrando <span className="font-semibold">{filteredUsuarios.length}</span> de <span className="font-semibold">{usuarios.length}</span> usuários
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            ← Anterior
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Próximo →
          </button>
        </div>
      </div>

      {/* Modal de Detalhes */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUsuario(null);
        }}
        title="Detalhes do Usuário"
      >
        {selectedUsuario && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedUsuario.nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedUsuario.nome}</h3>
                <p className="text-gray-500">{selectedUsuario.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-gray-900 font-semibold">#{selectedUsuario.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Data de Cadastro</label>
                <p className="text-gray-900">{selectedUsuario.dataCadastro}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tipo de Conta</label>
              <div className="mt-2">
                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getTipoColor(selectedUsuario.tipo)}`}>
                  {getTipoLabel(selectedUsuario.tipo)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status Atual</label>
              <div className="mt-2">
                <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(selectedUsuario.status)}`}>
                  {selectedUsuario.status}
                </span>
              </div>
            </div>

            {/* Informações de Perfil */}
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações do Perfil</h3>
              
              {selectedUsuario.tipo === 'usuario' ? (
                // Perfil de Candidato
                <div className="space-y-3">
                  {selectedUsuario.perfil?.telefone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Telefone</label>
                      <p className="text-gray-900">{selectedUsuario.perfil.telefone}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.dataNascimento && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                      <p className="text-gray-900">{selectedUsuario.perfil.dataNascimento}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.endereco && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Endereço</label>
                      <p className="text-gray-900">{selectedUsuario.perfil.endereco}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.bio && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Bio</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedUsuario.perfil.bio}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.formacao && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Formação</label>
                        <p className="text-gray-900">{selectedUsuario.perfil.formacao}</p>
                      </div>
                      {selectedUsuario.perfil?.instituicao && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Instituição</label>
                          <p className="text-gray-900">{selectedUsuario.perfil.instituicao}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedUsuario.perfil?.experiencia && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experiência</label>
                      <p className="text-gray-900">{selectedUsuario.perfil.experiencia}</p>
                    </div>
                  )}
                  {(selectedUsuario.perfil?.linkedin || selectedUsuario.perfil?.github) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Redes Sociais</label>
                      <div className="flex gap-2 mt-1">
                        {selectedUsuario.perfil?.linkedin && (
                          <a href={`https://${selectedUsuario.perfil.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                            LinkedIn
                          </a>
                        )}
                        {selectedUsuario.perfil?.github && (
                          <a href={`https://${selectedUsuario.perfil.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Perfil de Empresa
                <div className="space-y-3">
                  {selectedUsuario.perfil?.razaoSocial && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Razão Social</label>
                      <p className="text-gray-900">{selectedUsuario.perfil.razaoSocial}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.nuit && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">NUIT</label>
                      <p className="text-gray-900">{selectedUsuario.perfil.nuit}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.telefone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Telefone</label>
                      <p className="text-gray-900">{selectedUsuario.perfil.telefone}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.endereco && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Endereço</label>
                      <p className="text-gray-900">{selectedUsuario.perfil.endereco}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.descricao && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Descrição</label>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedUsuario.perfil.descricao}</p>
                    </div>
                  )}
                  {selectedUsuario.perfil?.setor && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Setor</label>
                        <p className="text-gray-900">{selectedUsuario.perfil.setor}</p>
                      </div>
                      {selectedUsuario.perfil?.tamanho && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Tamanho</label>
                          <p className="text-gray-900">{selectedUsuario.perfil.tamanho} funcionários</p>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedUsuario.perfil?.website && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <a href={`https://${selectedUsuario.perfil.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedUsuario.perfil.website}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <label className="text-sm font-medium text-gray-700 block mb-3">Ações do Usuário</label>
              <div className="grid grid-cols-2 gap-3">
                {selectedUsuario.status !== 'Ativo' && (
                  <button
                    onClick={() => {
                      handleAtivar(selectedUsuario.id);
                      setIsModalOpen(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    ✓ Ativar
                  </button>
                )}
                {selectedUsuario.status !== 'Inativo' && (
                  <button
                    onClick={() => {
                      handleDesativar(selectedUsuario.id);
                      setIsModalOpen(false);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    ⊘ Desativar
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedUsuario.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  🗑 Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este usuário permanentemente?\n\nEsta ação não pode ser desfeita!"
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

export default Usuarios;
