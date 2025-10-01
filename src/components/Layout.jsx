import { Outlet } from 'react-router-dom';
import Sidebar, { SidebarProvider } from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-2 sm:p-4 lg:p-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
