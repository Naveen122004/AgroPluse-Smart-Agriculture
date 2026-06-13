import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar authenticated />
      <main className="flex-grow-1 py-4">
        <div className="container-fluid px-3 px-lg-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
