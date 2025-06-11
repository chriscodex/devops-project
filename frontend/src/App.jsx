import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { GlobalAppProvider } from './context/GlobalContext';
import { OrdenProvider } from './context/OrdenContext';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es-do';

import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import { OrdenesPage } from './pages/Ordenes/OrdenesPage';
import { OrdenDetailPage } from './pages/Ordenes/OrdenDetailPage';
import { NuevaOrdenPage } from './pages/Ordenes/NuevaOrdenPage';
import { ConfigUserPage } from './pages/Usuario/ConfigUserPage';
import { HistorialOrdenesPage } from './pages/Reportes/HistorialOrdenes';
import { ClientsPage } from './pages/ClientesYEquipo/Clients';
import { OrdersEquiposPage } from './pages/ClientesYEquipo/OrdersEquipos';
import { RegistrarTecnicoPage } from './pages/Tecnicos/RegistrarTecnicoPage';
import { ListaTecnicosPage } from './pages/Tecnicos/ListaTecnicosPage';
import { ClientHistorial } from './pages/ClientesYEquipo/ClientHistorial';
import { PrioridadesControl } from './pages/ControlPanel/Ordenes/PrioridadesPage';
import { AreasControl } from './pages/ControlPanel/Ordenes/AreasPage';
import { TiposServicioControl } from './pages/ControlPanel/Ordenes/TiposServicioPage';
import { MarcasControl } from './pages/ControlPanel/Equipos/MarcasPage';
import { CategoriasControl } from './pages/ControlPanel/Equipos/CategoriasPage';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es-do">
      <GlobalAppProvider>
        <AuthProvider>
          <OrdenProvider>
            <BrowserRouter>
              {/* <Navbar /> */}
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Private Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<OrdenesPage />} />

                  {/* Ordenes */}
                  <Route path="/ordenes" element={<OrdenesPage />} />
                  <Route path="/ordenes/:id" element={<OrdenDetailPage />} />
                  <Route path="/nueva-orden" element={<NuevaOrdenPage />} />

                  {/* Historial */}
                  <Route
                    path="/historial-ordenes"
                    element={<HistorialOrdenesPage />}
                  />
                  <Route
                    path="/ordenes/cliente/:clientId"
                    element={<ClientHistorial />}
                  />

                  {/* Clientes */}
                  <Route path="/clientes" element={<ClientsPage />} />
                  <Route
                    path="/clientes/equipos"
                    element={<OrdersEquiposPage />}
                  />

                  {/* Usuario */}
                  <Route path="/config-user" element={<ConfigUserPage />} />

                  {/* Tecnicos */}
                  <Route path="/registrar" element={<RegistrarTecnicoPage />} />
                  <Route path="/tecnicos" element={<ListaTecnicosPage />} />

                  {/* Panel de Control */}
                  <Route
                    path="/control/prioridades"
                    element={<PrioridadesControl />}
                  />
                  <Route path="/control/areas" element={<AreasControl />} />
                  <Route
                    path="/control/tipos-servicio"
                    element={<TiposServicioControl />}
                  />
                  <Route path="/control/marcas" element={<MarcasControl />} />
                  <Route
                    path="/control/categorias"
                    element={<CategoriasControl />}
                  />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </OrdenProvider>
        </AuthProvider>
      </GlobalAppProvider>
    </LocalizationProvider>
  );
}

export default App;
