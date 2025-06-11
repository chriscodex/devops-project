import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ConfigUserPage() {
  const { user, updateUser } = useAuth();

  const [celular, setCelular] = useState('');
  const [celularError, setCelularError] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [direccion, setDireccion] = useState('');
  const [direccionError, setDireccionError] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  const navigate = useNavigate();

  const handleCancelar = () => {
    navigate('/ordenes');
  };

  const handleSaveButton = async () => {
    try {
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
      if (newPassword.length !== 0) {
        if (newPassword !== confirmNewPassword) {
          setConfirmNewPasswordError('Las contraseñas no coinciden');
          return;
        }
      }
      let userUpdated = {
        celular: celular,
        email: email,
        direccion: direccion,
      };
      if (newPassword.length !== 0 && confirmNewPassword === newPassword) {
        userUpdated = {
          ...userUpdated,
          password: newPassword,
        };
      }
      await updateUser(user.id, userUpdated);
      setEmailError('');
      setCelularError('');
      setDireccionError('');
      setConfirmNewPasswordError('');
      setNewPassword('');
      setConfirmNewPassword('');
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Datos actualizados correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCelular(user.celular);
    setEmail(user.email);
    setDireccion(user.direccion);
  }, [user]);

  return (
    <div className="w-full h-screen bg-[#efeff4]overflow-hidden">
      <Sidebar />
      <div className="absolute left-[320px] h-screen w-[calc(100%-320px)] flex justify-center items-center flex-col">
        <div className="flex p-2 items-center mb-5">
          <h2 className="mr-[10px] select-none font-bold text-2xl">
            PERSONALIZAR
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </span>
        </div>
        <div className="w-[500px] flex flex-col p-2">
          <p className="select-none font-medium">DNI</p>
          <div className="flex w-full h-[45px] rounded-md items-center">
            <input
              type="text"
              autoComplete="off"
              value={user?.username}
              disabled
              className="w-[150px] bg-gray-200 border border-gray-400 rounded-md p-2"
            />
          </div>
        </div>
        <div className="w-[500px] flex flex-col p-2">
          <p className="select-none font-medium">Apellidos</p>
          <div className="flex w-full h-[45px] rounded-md items-center">
            <input
              type="text"
              autoComplete="off"
              disabled
              value={user?.apellidos}
              className="w-full h-full bg-gray-200 rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
            />
          </div>
        </div>
        <div className="w-[500px] flex flex-col p-2">
          <p className="select-none font-medium">Nombres</p>
          <div className="flex h-[45px] rounded-md items-center">
            <input
              type="text"
              autoComplete="off"
              disabled
              value={user?.nombres}
              className="w-full h-full bg-gray-200 rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
            />
          </div>
        </div>
        <div className="w-[500px] flex flex-col p-2">
          <p className="select-none">
            <span className="font-medium">Celular</span>
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
        <div className="w-[500px] flex flex-col p-2">
          <p className="select-none">
            <span className="font-medium">Email</span>
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
        <div className="w-[500px] flex flex-col p-2">
          <p className="select-none">
            <span className="font-medium">Direccion</span>
            {direccionError && (
              <span className="text-red-500 font-medium">{direccionError}</span>
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
        <div className="w-[500px] flex flex-col p-2">
          <p className="select-none font-medium">Nueva Contraseña</p>
          <div className="flex w-full h-[45px] rounded-md items-center">
            <input
              type="password"
              autoComplete="off"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-full rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
            />
          </div>
        </div>
        <div className="w-[500px] flex flex-col p-2">
          <p className="select-none flex flex-col">
            <span className="font-medium">Confirmar Nueva Contraseña</span>
            {confirmNewPasswordError && (
              <span className="text-red-500 font-medium">
                {confirmNewPasswordError}
              </span>
            )}
          </p>
          <div className="flex w-full h-[45px] rounded-md items-center">
            <input
              type="password"
              autoComplete="off"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              onClick={() => setConfirmNewPasswordError('')}
              className="w-full h-full rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end mb-2 mr-2">
          <button
            onClick={handleCancelar}
            className="h-10 px-2 bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-black rounded-md flex items-center justify-center mr-3"
          >
            <p className="text-black">Cancelar</p>
          </button>
          <button
            onClick={handleSaveButton}
            className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white px-4 py-2 rounded-md shadow-md flex"
          >
            <p className="text-white">Guardar</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export { ConfigUserPage };
