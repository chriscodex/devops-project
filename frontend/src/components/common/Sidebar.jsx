import './Sidebar.css';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const [usersOpen, setUsersOpen] = useState(false);
  const [clientesEquipoOpen, setClientesEquipoOpen] = useState(false);
  const [ordenesOpen, setOrdenesOpen] = useState(false);
  const [panelControlOpen, setPanelControlOpen] = useState(false);
  const [ordenesControlOpen, setOrdenesControlOpen] = useState(false);
  const [equipoControlOpen, setEquipoControlOpen] = useState(false);
  const [userCustom, setUserCustom] = useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const usersOpenHandler = () => {
    setUsersOpen(!usersOpen);
    setClientesEquipoOpen(false);
    setOrdenesOpen(false);
    setPanelControlOpen(false);
  };
  const clientesEquipoOpenHandler = () => {
    setClientesEquipoOpen(!clientesEquipoOpen);
    setUsersOpen(false);
    setOrdenesOpen(false);
    setPanelControlOpen(false);
  };
  const ordenesOpenHandler = () => {
    setOrdenesOpen(!ordenesOpen);
    setUsersOpen(false);
    setClientesEquipoOpen(false);
    setPanelControlOpen(false);
  };
  const panelControlOpenHandler = () => {
    setPanelControlOpen(!panelControlOpen);
    setOrdenesOpen(false);
    setEquipoControlOpen(false);
    setOrdenesControlOpen(false);
    setClientesEquipoOpen(false);
    setUsersOpen(false);
  };

  const ordenesControlOpenHandler = () => {
    setOrdenesControlOpen(!ordenesControlOpen);
    setEquipoControlOpen(false);
    setClientesEquipoOpen(false);
    setUsersOpen(false);
  };

  const equipoControlOpenHandler = () => {
    setEquipoControlOpen(!equipoControlOpen);
    setOrdenesControlOpen(false);
    setClientesEquipoOpen(false);
    setUsersOpen(false);
  };

  const getFirstWord = (cadena) => {
    const cadenaSinEspacios = cadena.trim();

    if (!cadenaSinEspacios) {
      return null;
    }

    const palabras = cadenaSinEspacios.split(/\s+/);

    return palabras[0];
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed left-0 top-0 w-[320px] bg-gray-900 h-screen flex flex-col items-center overflow-hidden select-none text-white z-50">
          {/* Logo */}
          <span className="w-[200px] h-[200px] mt-[20px] mb-[30px] flex justify-center items-center">
            <img
              src="/perfil/netcomputer.jpg"
              alt="profile"
              className="rounded-[50%] w-[200px] h-[200px]"
            />
          </span>
          <ul className="w-full font-light">
            {user.rol === 'administrador' ? (
              <>
                {/* Usuarios */}
                <li
                  className={`flex justify-between items-center px-[20px] py-2 border-y-[1px] hover:bg-[#363839] hover:text-white ${
                    usersOpen ? 'bg-[#363839] border-b-[0px]' : ''
                  }`}
                  onClick={usersOpenHandler}
                >
                  <p
                    className={`flex ${usersOpen ? 'font-bold' : 'font-light'}`}
                  >
                    <span className="mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                        />
                      </svg>
                    </span>
                    Técnicos
                  </p>
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{ rotate: usersOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </motion.span>
                </li>
                {usersOpen && (
                  <>
                    <ul className="w-full flex flex-col bg-[#F4F4F4]  border-b-[2px] text-black">
                      <li
                        onClick={() => navigate('/registrar')}
                        className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                      >
                        <motion.h2
                          onClick={() => navigate('/registrar')}
                          initial={{ opacity: 0, x: -100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.35 }}
                          className="px-[40px] py-2"
                        >
                          Registrar Técnico
                        </motion.h2>
                      </li>
                      <li
                        onClick={() => navigate('/tecnicos')}
                        className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                      >
                        <motion.h2
                          onClick={() => navigate('/tecnicos')}
                          initial={{ opacity: 0, x: -100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.35 }}
                          className="px-[40px] py-2"
                        >
                          Lista de Técnicos
                        </motion.h2>
                      </li>
                    </ul>
                  </>
                )}
              </>
            ) : null}
            {/* Órdenes */}
            <li
              className={`flex justify-between items-center px-[20px] py-2 border-y-[1px] hover:bg-[#363839] hover:text-white ${
                ordenesOpen ? 'bg-[#363839] border-b-[0px]' : ''
              }`}
              onClick={ordenesOpenHandler}
            >
              <p className={`flex ${ordenesOpen ? 'font-bold' : 'font-light'}`}>
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                    />
                  </svg>
                </span>
                Ordenes
              </p>
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: ordenesOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </motion.span>
            </li>
            {ordenesOpen && (
              <>
                <ul className="w-full flex flex-col bg-[#F4F4F4]  border-b-[2px] text-black">
                  {user.rol === 'tecnico' ? (
                    <li
                      className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                      onClick={() => navigate('/nueva-orden')}
                    >
                      <motion.h2
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.35 }}
                        className="px-[40px] py-2"
                      >
                        Crear Orden
                      </motion.h2>
                    </li>
                  ) : null}

                  <li
                    className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                    onClick={() => navigate('/ordenes')}
                  >
                    <motion.h2
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.35 }}
                      className="px-[40px] py-2"
                    >
                      Lista de Órdenes
                    </motion.h2>
                  </li>
                  <li
                    className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                    onClick={() => navigate('/historial-ordenes')}
                  >
                    <motion.h2
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.35 }}
                      className="px-[40px] py-2"
                    >
                      Reporte de Órdenes
                    </motion.h2>
                  </li>
                </ul>
              </>
            )}
            {/* Clientes y Equipo */}
            <li
              className={`flex justify-between items-center px-[20px] py-2 border-y-[1px] hover:bg-[#363839] hover:text-white ${
                clientesEquipoOpen ? 'bg-[#363839] border-b-[0px]' : ''
              }`}
              onClick={clientesEquipoOpenHandler}
            >
              <p
                className={`flex ${
                  clientesEquipoOpen ? 'font-bold' : 'font-light'
                }`}
              >
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                </span>
                Clientes y Equipos
              </p>
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: clientesEquipoOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </motion.span>
            </li>
            {clientesEquipoOpen && (
              <>
                <ul className="w-full flex flex-col bg-[#F4F4F4]  border-b-[2px] text-black">
                  <li
                    onClick={() => navigate('/clientes')}
                    className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                  >
                    <motion.h2
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.35 }}
                      className="px-[40px] py-2"
                    >
                      Clientes
                    </motion.h2>
                  </li>
                  <li
                    onClick={() => navigate('/clientes/equipos')}
                    className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                  >
                    <motion.h2
                      onClick={() => navigate('/clientes/equipos')}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.35 }}
                      className="px-[40px] py-2"
                    >
                      Equipos
                    </motion.h2>
                  </li>
                </ul>
              </>
            )}
            {/* Panel de Control */}
            <li
              className={`flex justify-between items-center px-[20px] py-2 border-y-[1px] hover:bg-[#363839] hover:text-white ${
                panelControlOpen ? 'bg-[#363839] border-b-[0px]' : ''
              }`}
              onClick={panelControlOpenHandler}
            >
              <p
                className={`flex ${
                  panelControlOpen ? 'font-bold' : 'font-light'
                }`}
              >
                <span className="mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                Panel de Control
              </p>
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: panelControlOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </motion.span>
            </li>
            {panelControlOpen && (
              <>
                <ul className="w-full flex flex-col bg-gray-300  border-b-[2px] text-black">
                  <li
                    onClick={ordenesControlOpenHandler}
                    className={`border-b hover:bg-gray-400`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.35 }}
                      className={`flex justify-between items-center pl-[40px] pr-5 py-2 ${
                        ordenesControlOpen ? 'bg-gray-400 text-white' : ''
                      }`}
                    >
                      <p
                        className={`${
                          ordenesControlOpen ? 'font-bold' : 'font-light'
                        }`}
                      >
                        Órdenes
                      </p>
                      <motion.span
                        initial={{ rotate: 0 }}
                        animate={{ rotate: ordenesControlOpen ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </motion.span>
                    </motion.div>
                  </li>
                  {ordenesControlOpen && (
                    <>
                      <ul className="w-full flex flex-col bg-[#F4F4F4]  border-b-[2px] text-black">
                        <li
                          className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                          onClick={() => navigate('/control/prioridades')}
                        >
                          <motion.h2
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.35 }}
                            className="px-[70px] py-2"
                          >
                            Prioridades
                          </motion.h2>
                        </li>
                        <li
                          className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                          onClick={() => navigate('/control/areas')}
                        >
                          <motion.h2
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.35 }}
                            className="px-[70px] py-2"
                          >
                            Áreas
                          </motion.h2>
                        </li>
                        <li
                          className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                          onClick={() => navigate('/control/tipos-servicio')}
                        >
                          <motion.h2
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.35 }}
                            className="px-[70px] py-2"
                          >
                            Tipos de Servicio
                          </motion.h2>
                        </li>
                      </ul>
                    </>
                  )}
                  <li
                    onClick={equipoControlOpenHandler}
                    className={`border-b hover:bg-gray-400`}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.35 }}
                      className={`flex justify-between items-center pl-[40px] pr-5 py-2 ${
                        equipoControlOpen ? 'bg-gray-400 text-white' : ''
                      }`}
                    >
                      <p
                        className={`${
                          equipoControlOpen ? 'font-bold' : 'font-light'
                        }`}
                      >
                        Equipos
                      </p>
                      <motion.span
                        initial={{ rotate: 0 }}
                        animate={{ rotate: equipoControlOpen ? 90 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                          />
                        </svg>
                      </motion.span>
                    </motion.div>
                  </li>
                  {equipoControlOpen && (
                    <>
                      <ul className="w-full flex flex-col bg-[#F4F4F4]  border-b-[2px] text-black">
                        <li
                          className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                          onClick={() => navigate('/control/marcas')}
                        >
                          <motion.h2
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.35 }}
                            className="px-[70px] py-2"
                          >
                            Marcas
                          </motion.h2>
                        </li>
                        <li
                          className="border-b-[1px] hover:bg-[#ccc] hover:text-black"
                          onClick={() => navigate('/control/categorias')}
                        >
                          <motion.h2
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.35 }}
                            className="px-[70px] py-2"
                          >
                            Categorías
                          </motion.h2>
                        </li>
                      </ul>
                    </>
                  )}
                </ul>
              </>
            )}
          </ul>

          {/* User section */}
          <div
            className={`flex items-center w-full h-[80px] absolute bottom-[80px] justify-end right-[6px] ${
              userCustom ? '' : 'hidden'
            }`}
          >
            <motion.li
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: userCustom ? 1 : 0, x: userCustom ? 0 : 80 }}
              className="list-none border rounded-lg bg-myViolet"
            >
              <ul
                className="p-1 flex cursor-pointer"
                onClick={() => navigate('/config-user')}
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
                Personalizar
              </ul>
              <ul className="p-1 flex cursor-pointer" onClick={() => logout()}>
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                </span>
                Cerrar sesión
              </ul>
            </motion.li>
          </div>
          <div className="flex items-center w-full h-[80px] absolute bottom-0 border-t border-t-gray-400 justify-between">
            <span className="w-[50px] h-[50px] flex justify-center items-center ml-[15px]">
              <img
                src="/perfil/user-default.png"
                alt="profile"
                className="rounded-[50%] w-[50px] h-[50px]"
              />
            </span>
            <p>{`${getFirstWord(user.nombres)} ${getFirstWord(
              user.apellidos
            )}`}</p>
            <button
              className="mr-[10px] border rounded-full"
              onClick={() => setUserCustom(!userCustom)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </button>
          </div>
        </div>
      </AnimatePresence>
    </>
  );
}

export { Sidebar };
