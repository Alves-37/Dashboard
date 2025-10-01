import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import { useSidebar } from './Sidebar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-white shadow-md px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Botão Mobile Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-xl font-semibold text-gray-800 truncate">
              <span className="hidden sm:inline">Bem-vindo, </span>
              <span className="sm:hidden">Olá, </span>
              {user?.nome?.split(' ')[0] || user?.name?.split(' ')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate hidden sm:block">
              {user?.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-base font-medium whitespace-nowrap"
          >
            Sair
          </button>
        </div>
      </nav>

      {/* Modal de Confirmação de Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema?\n\nVocê precisará fazer login novamente para acessar o dashboard."
        confirmText="Sim, Sair"
        cancelText="Cancelar"
        type="warning"
      />
    </>
  );
};

export default Navbar;
