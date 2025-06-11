import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useOrden } from '../../context/OrdenContext';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../context/AuthContext';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import { formatearNombres } from '../../utils/formatter';

function RegistrarTecnicoPage() {
  const { getClientDataAPIByDni } = useOrden();
  const { signUp } = useAuth();

  const navigate = useNavigate();

  const [dni, setDni] = useState('');
  const [dniError, setDniError] = useState('');
  const [loadingDni, setLoadingDni] = useState(false);
  const handleDniInput = (event) => {
    const inputValue = event.target.value;
    setDni(inputValue);
  };
  const handleDniInputClick = () => {
    setDniError('');
  };

  const handleFindDni = async () => {
    try {
      setDniError('');
      if (dni.length !== 8) {
        setDniError('DNI inválido');
        return;
      }
      setLoadingDni(true);
      const resAPI = await getClientDataAPIByDni({ dni: dni });
      if (!resAPI) {
        setDniError('DNI inválido');
        setLoadingDni(false);
        return;
      }
      if (resAPI) {
        const { apellidoMaterno, apellidoPaterno, nombres } = resAPI.data;
        const nombresFormateados = formatearNombres(nombres)
        const apellidosFormateados = formatearNombres(`${apellidoPaterno} ${apellidoMaterno}`)
        setApellidos(apellidosFormateados);
        setNombres(nombresFormateados);
        setLoadingDni(false);
        setDniError('');
        setApellidosError('');
        setNombresError('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [apellidos, setApellidos] = useState('');
  const [apellidosError, setApellidosError] = useState('');

  const [nombres, setNombres] = useState('');
  const [nombresError, setNombresError] = useState('');

  const [celular, setCelular] = useState('');
  const [celularError, setCelularError] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [direccion, setDireccion] = useState('');
  const [direccionError, setDireccionError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAlertaCreate = () => {
    Swal.fire({
      icon: 'success',
      title: 'Tecnico registrado correctamente',
    });
  }

  const handleRegistrar = async () => {
    try {
      if (dni.length !== 8) {
        setDniError('DNI inválido');
        return;
      }
      if (apellidos.length === 0) {
        setApellidosError('Apellidos inválidos');
        return;
      }
      if (nombres.length === 0) {
        setNombresError('Nombres inválidos');
        return;
      }
      if (celular.length === 0) {
        setCelularError('Celular inválido');
        return;
      }
      if (email.length === 0) {
        setEmailError('Email inválido');
        return;
      }
      if (direccion.length === 0) {
        setDireccionError('Dirección inválida');
        return;
      }
      if (password.length === 0) {
        setPasswordError('Contraseña inválida');
        return;
      }

      const newDataTecnico = {
        username: dni,
        apellidos,
        nombres,
        celular,
        email,
        direccion,
        password,
      };
      await signUp(newDataTecnico);
      handleAlertaCreate();
      navigate('/tecnicos');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen bg-[#efeff4]overflow-hidden">
      <Sidebar />
      <div className="absolute left-[320px] h-screen w-[calc(100%-320px)] flex flex-col justify-center items-center">
        <div className="w-[500px] grid grid-cols-1 border border-gray-400 rounded-lg bg-white">
          <div className="flex border-b border-b-gray-300 p-2">
            <h2 className="mr-[10px] select-none font-bold text-gray-500">
              REGISTRAR TÉCNICO
            </h2>
            <span>
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
          </div>
          <div className="w-full flex flex-col p-2">
            <p className="select-none">
              DNI <span className="text-red-500 font-bold">* </span>
              {dniError && (
                <span className="text-red-500 font-medium">{dniError}</span>
              )}
            </p>
            <div className="flex w-full h-[45px] rounded-md items-center">
              <input
                type="text"
                placeholder="Buscar"
                autoComplete="off"
                value={dni}
                onClick={handleDniInputClick}
                onChange={handleDniInput}
                className="w-[150px] border border-gray-400 rounded-md p-2"
              />
              {loadingDni ? (
                <div className="flex justify-center items-center w-10 h-[45px] bg-white rounded-md ml-1 border border-blue-600">
                  <CircularProgress size={20} />
                </div>
              ) : (
                <span
                  className="flex justify-center items-center h-10 w-10 bg-blue-600 rounded-md ml-1 cursor-pointer"
                  onClick={handleFindDni}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col p-2">
            <p className="select-none">
              Apellidos <span className="text-red-500 font-bold">* </span>
              {apellidosError && (
                <span className="text-red-500 font-medium">
                  {apellidosError}
                </span>
              )}
            </p>
            <div className="flex w-full h-[45px] rounded-md items-center">
              <input
                type="text"
                autoComplete="off"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                onClick={() => setApellidosError('')}
                className="w-full h-full rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
              />
            </div>
          </div>
          <div className="w-full flex flex-col p-2">
            <p className="select-none">
              Nombres <span className="text-red-500 font-bold">* </span>
              {nombresError && (
                <span className="text-red-500 font-medium">{nombresError}</span>
              )}
            </p>
            <div className="flex w-full h-[45px] rounded-md items-center">
              <input
                type="text"
                autoComplete="off"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                onClick={() => setNombresError('')}
                className="w-full h-full rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
              />
            </div>
          </div>
          <div className="w-full flex flex-col p-2">
            <p className="select-none">
              Celular <span className="text-red-500 font-bold">* </span>
              {celularError && (
                <span className="text-red-500 font-medium">{celularError}</span>
              )}
            </p>
            <div className="flex w-full h-[45px] rounded-md items-center">
              <input
                type="text"
                autoComplete="off"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                onClick={() => setCelularError('')}
                className="w-full h-full rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
              />
            </div>
          </div>
          <div className="w-full flex flex-col p-2">
            <p className="select-none">
              Email <span className="text-red-500 font-bold">* </span>
              {emailError && (
                <span className="text-red-500 font-medium">{emailError}</span>
              )}
            </p>
            <div className="flex w-full h-[45px] rounded-md items-center">
              <input
                type="text"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onClick={() => setEmailError('')}
                className="w-full h-full rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
              />
            </div>
          </div>
          <div className="w-full flex flex-col p-2">
            <p className="select-none">
              Direccion <span className="text-red-500 font-bold">* </span>
              {direccionError && (
                <span className="text-red-500 font-medium">
                  {direccionError}
                </span>
              )}
            </p>
            <div className="flex w-full h-[45px] rounded-md items-center">
              <input
                type="text"
                autoComplete="off"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                onClick={() => setDireccionError('')}
                className="w-full h-full rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
              />
            </div>
          </div>
          <div className="w-full flex flex-col p-2">
            <p className="select-none">
              Contraseña <span className="text-red-500 font-bold">* </span>
              {passwordError && (
                <span className="text-red-500 font-medium">
                  {passwordError}
                </span>
              )}
            </p>
            <div className="flex w-full h-[45px] rounded-md items-center">
              <TextField
                id="outlined-password-input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onClick={() => setPasswordError('')}
                className="w-full h-full rounded-2xl pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end mb-2 mr-2">
            <button
              onClick={handleRegistrar}
              className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white px-4 py-2 rounded-md shadow-md flex"
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
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
              <p className="text-white ml-[10px]">Registrar</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { RegistrarTecnicoPage };
