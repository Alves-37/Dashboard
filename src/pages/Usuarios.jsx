import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import AlertModal from '../components/AlertModal';
import ItemCard from '../components/ItemCard';

const Usuarios = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'info' });
  
  // Estado vindo da API
  const [usuarios, setUsuarios] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [loadingList, setLoadingList] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos'); // visual apenas, backend ainda não tem status

  // Helper para construir URL da foto
  function buildFotoUrl(foto) {
    if (!foto) return null;
    const f = String(foto);
    if (f.startsWith('http://') || f.startsWith('https://') || f.startsWith('data:')) {
      return f;
    }
    // Se for path relativo (ex: /uploads/xyz.png), construir com a origem do backend
    try {
      const base = api?.defaults?.baseURL || '';
      const url = new URL(base, window.location.origin);
      // base costuma terminar com /api; queremos só a origin
      const origin = url.origin;
      // Se já vier com /uploads no início
      if (f.startsWith('/')) return origin + f;
      // Se não contém 'uploads', prefixar automaticamente
      const rel = f.includes('uploads') ? f : 'uploads/' + f;
      return origin + '/' + rel;
    } catch (e) {
      return f; // fallback
    }
  }

  // Carregar usuários reais do backend ao entrar na página (e quando filtros mudarem)
  useEffect(() => {
    let cancelled = false;
    async function fetchUsuarios() {
      if (authLoading || !isAuthenticated) return; // aguardar token do AuthContext
      try {
        setLoadingList(true);
        const params = {
          page,
          limit,
        };
        if (searchTerm) params.busca = searchTerm;
        // Mapeia filtro visual de tipo
        // Manter "Todos" como sem filtro
        // (status não existe no backend por enquanto)
        // Tipos válidos: usuario | empresa
        // Aqui poderíamos adicionar outro seletor para tipo.

        const res = await api.get('/admin/usuarios', { params });
        if (cancelled) return;
        const { items, total: totalCount } = res.data || { items: [], total: 0 };

        const mapped = (items || []).map((u) => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          tipo: u.tipo,
          suspended: !!u.suspended,
          status: u.suspended ? 'Inativo' : 'Ativo',
          dataCadastro: u.createdAt ? new Date(u.createdAt).toLocaleString() : '',
          // Empresas costumam usar campo 'logo'; candidatos usam 'foto'
          fotoUrl: buildFotoUrl(u.logo || u.foto),
          perfil: {
            telefone: u.telefone,
            endereco: u.endereco,
            bio: u.bio,
            formacao: u.formacao,
            instituicao: u.instituicao,
            experiencia: u.experiencia,
            linkedin: u.linkedin,
            github: u.github,
            razaoSocial: u.razaoSocial,
            nuit: u.nuit,
            website: u.website,
            tamanho: u.tamanho,
            descricao: u.descricao,
          },
        }));

        setUsuarios(mapped);
        setTotal(totalCount || mapped.length);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    }

    fetchUsuarios();
    return () => { cancelled = true; };
  }, [searchTerm, page, limit, authLoading, isAuthenticated]);

  // Resetar paginação quando termo de busca muda
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Filtragem visual local por status (enquanto não há no backend)
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesStatus = filterStatus === 'Todos' || usuario.status === filterStatus;
    return matchesStatus;
  });

  const showAlert = (title, message, type = 'info') => {
    setAlertConfig({ title, message, type });
    setShowAlertModal(true);
  };

  const handleAtivar = async (id) => {
    try {
      await api.put(`/admin/usuarios/${id}/ativar`);
      setUsuarios(usuarios.map(usuario => 
        usuario.id === id ? { ...usuario, suspended: false, status: 'Ativo' } : usuario
      ));
      showAlert('Sucesso!', 'Usuário ativado com sucesso.', 'success');
    } catch (error) {
      console.error('Erro ao ativar usuário:', error);
      showAlert('Erro!', error.response?.data?.error || 'Erro ao ativar usuário.', 'error');
    }
  };

  const handleDesativar = async (id) => {
    try {
      await api.put(`/admin/usuarios/${id}/desativar`);
      setUsuarios(usuarios.map(usuario => 
        usuario.id === id ? { ...usuario, suspended: true, status: 'Inativo' } : usuario
      ));
      showAlert('Sucesso!', 'Usuário desativado com sucesso.', 'success');
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      showAlert('Erro!', error.response?.data?.error || 'Erro ao desativar usuário.', 'error');
    }
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

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/usuarios/${userToDelete}`);
      setUsuarios(usuarios.filter(usuario => usuario.id !== userToDelete));
      setShowConfirmDelete(false);
      setIsModalOpen(false);
      setUserToDelete(null);
      showAlert('Sucesso!', 'Usuário excluído com sucesso.', 'success');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      setShowConfirmDelete(false);
      showAlert('Erro!', error.response?.data?.error || 'Erro ao excluir usuário.', 'error');
    }
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
      {loadingList && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 sm:p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {!loadingList && filteredUsuarios.map((usuario) => (
          <ItemCard
            key={usuario.id}
            onClick={() => {
              setSelectedUsuario(usuario);
              setIsModalOpen(true);
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {usuario.fotoUrl ? (
                  <img
                    src={usuario.fotoUrl}
                    alt={usuario.nome}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </div>
                )}
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

      {!loadingList && filteredUsuarios.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum usuário encontrado</h3>
          <p className="text-gray-600">Tente ajustar os filtros de busca</p>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <div>
          {loadingList ? (
            <span>Carregando...</span>
          ) : (
            <>
              Mostrando <span className="font-semibold">{filteredUsuarios.length}</span> de <span className="font-semibold">{total}</span> usuários
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loadingList}
            className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${page <= 1 || loadingList ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
            ← Anterior
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loadingList || (page * limit >= total)}
            className={`px-4 py-2 border border-gray-300 rounded-lg transition-colors ${loadingList || (page * limit >= total) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          >
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
              {selectedUsuario.fotoUrl ? (
                <img
                  src={selectedUsuario.fotoUrl}
                  alt={selectedUsuario.nome}
                  className="w-16 h-16 rounded-full object-cover border"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUsuario.nome.charAt(0).toUpperCase()}
                </div>
              )}
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
