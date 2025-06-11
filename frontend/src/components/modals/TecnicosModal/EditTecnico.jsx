import { Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOrden } from '../../../context/OrdenContext';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../../context/AuthContext';
import { formatearNombres } from '../../../utils/formatter';

function EditTecnico(props) {
  const {
    loadLista,
    handleAlertaEdit,
    tecnicoId,
    tecnicoUsername,
    tecnicoApellidos,
    tecnicoNombres,
    tecnicoCelular,
    tecnicoEmail,
    tecnicoDireccion,
  } = props;
  const [openEditTecnico, setOpenEditTecnico] = useState(false);

  const { getClientDataAPIByDni } = useOrden();

  const { updateUser } = useAuth();

  const [dni, setDni] = useState('');
  const [dniError, setDniError] = useState('');
  const [loadingDni, setLoadingDni] = useState(false);

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

  const [newPassword, setNewPassword] = useState('');

  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

  useEffect(() => {
    setDni(tecnicoUsername);
    setApellidos(tecnicoApellidos);
    setNombres(tecnicoNombres);
    setCelular(tecnicoCelular);
    setEmail(tecnicoEmail);
    setDireccion(tecnicoDireccion);
  }, [
    tecnicoUsername,
    tecnicoApellidos,
    tecnicoNombres,
    tecnicoCelular,
    tecnicoEmail,
    tecnicoDireccion,
  ]);

  const handleOpenEditArea = async () => {
    setOpenEditTecnico(true);
  };

  const handleCancelButton = () => {
    setDni(tecnicoUsername);
    setApellidos(tecnicoApellidos);
    setNombres(tecnicoNombres);
    setCelular(tecnicoCelular);
    setEmail(tecnicoEmail);
    setDireccion(tecnicoDireccion);
    setNewPassword('');
    setConfirmNewPassword('');
    setConfirmNewPasswordError('');
    setDniError('');
    setApellidosError('');
    setNombresError('');
    setCelularError('');
    setEmailError('');
    setDireccionError('');
    setOpenEditTecnico(false);
  };

  const handleSaveButton = async () => {
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
      if (newPassword !== confirmNewPassword) {
        setConfirmNewPasswordError('Las contraseñas no coinciden');
        return;
      }

      let newDataTecnico = {};

      if (newPassword.length === 0) {
        newDataTecnico = {
          username: dni,
          apellidos,
          nombres,
          celular,
          email,
          direccion,
        };
      } else {
        newDataTecnico = {
          username: dni,
          apellidos,
          nombres,
          celular,
          email,
          direccion,
          password: newPassword,
        };
      }

      await updateUser(tecnicoId, newDataTecnico);

      loadLista();
      handleAlertaEdit();
      setOpenEditTecnico(false);
    } catch (error) {
      console.log(error);
    }
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

  return (
    <>
      <Tooltip title="Editar" placement="left" disableInteractive>
        <button
          onClick={handleOpenEditArea}
          className="border p-1 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-300"
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </Tooltip>
      <Modal open={openEditTecnico} onClose={handleCancelButton}>
        <div className="w-1/3 h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-1 select-none">
          <div className="col-span-1 flex border-b border-b-gray-300 p-2 items-center">
            <h2 className="mr-[10px] select-none font-bold text-gray-500">
              EDITAR TÉCNICO
            </h2>
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </span>
          </div>
          <div className="col-span-1 w-full flex flex-col p-2">
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
                onClick={() => setDniError('')}
                onChange={(e) => setDni(e.target.value)}
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
            <p className="select-none">Nueva Contraseña</p>
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
          <div className="w-full flex flex-col p-2">
            <p className="select-none flex flex-col">
              Confirmar Nueva Contraseña
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
              onClick={handleCancelButton}
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
      </Modal>
    </>
  );
}

export { EditTecnico };
