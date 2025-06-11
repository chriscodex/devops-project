import { Modal, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOrden } from '../../../../context/OrdenContext';
import CircularProgress from '@mui/material/CircularProgress';
import { formatearNombres } from '../../../../utils/formatter';
import Swal from 'sweetalert2';

function EditCliente(props) {
  const {
    tipoClient,
    ordenId,
    clientId,
    loadOrden,
    dniClient,
    nombreClient,
    celularClient,
    emailClient,
    rucClient,
    razonSocialClient,
  } = props;
  const {
    getClientByDni,
    getClientDataAPIByDni,
    getClientByRuc,
    getRucData,
    updateClientOrden,
  } = useOrden();
  const [openEditClientePersona, setOpenEditClientePersona] = useState(false);

  const handleOpenEditClientePersona = async () => {
    setOpenEditClientePersona(true);
  };

  const handleCancelButton = () => {
    setClientInput(nombreClient);
    if (dniClient) setDni(dniClient);
    if (celularClient) setCelularInput(celularClient);
    if (emailClient) setEmailInput(emailClient);
    if (rucClient) setRucInput(rucClient);
    if (razonSocialClient) setRazonSocialInput(razonSocialClient);
    setDniError('');
    setClientInputError('');
    setCelularInputError('');
    setRazonSocialInputError('');
    setRucInputError('');
    setOpenEditClientePersona(false);
  };

  const handleSaveClienteEmpresaButton = async () => {
    try {
      if (rucInput.length !== 11 && clientType === 'empresa') {
        setRucInputError('RUC inválido');
        return;
      }
      if (razonSocialInput.length === 0 && clientType === 'empresa') {
        setRazonSocialInputError('Ingrese una razon social');
        return;
      }
      if (clientInput.length === 0 && clientType === 'empresa') {
        setClientInputError('Ingrese un nombre');
        return;
      }
      if (celularInput.length === 0 && clientType === 'empresa') {
        setCelularInputError('Ingrese un número de celular');
        return;
      }
      const newClienteEmpresa = {
        tipo: clientType,
        ruc: rucInput,
        razonSocial: razonSocialInput,
        personaResponsable: clientInput,
        celular: celularInput,
        email: emailInput,
      };
      await updateClientOrden(clientId, ordenId, newClienteEmpresa);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cliente actualizado',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300,
      });
      setOpenEditClientePersona(false);
      loadOrden();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveClientePersonaButton = async () => {
    try {
      if (dni.length === 0 || (dni.length < 8 && clientType === 'persona')) {
        setDniError('DNI inválido');
        return;
      }
      if (clientInput.length === 0 && clientType === 'persona') {
        setClientInputError('Ingrese un nombre');
        return;
      }
      if (celularInput.length === 0 && clientType === 'persona') {
        setCelularInputError('Ingrese un número de celular');
        return;
      }
      const newClientePersona = {
        tipo: clientType,
        dni: dni,
        personaResponsable: clientInput,
        celular: celularInput,
        email: emailInput ? emailInput : 'Ninguno',
      };

      await updateClientOrden(clientId, ordenId, newClientePersona);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cliente actualizado',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300,
      });
      loadOrden();
      setOpenEditClientePersona(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [clientType, setClientType] = useState(tipoClient);

  const handleSelectClientType = (event) => {
    const nuevoValor = event.target.value;
    setClientType(nuevoValor);
  };

  // Get DNI From Input
  const [dni, setDni] = useState(dniClient || '');
  const [dniError, setDniError] = useState('');
  const [loadingDni, setLoadingDni] = useState(false);

  const handleDniInput = (event) => {
    const inputValue = event.target.value;
    setDni(inputValue);
  };

  const handleDniInputClick = () => {
    setDniError('');
  };

  // Client Data by DNI
  const [clientInput, setClientInput] = useState(nombreClient || '');
  const [clientInputError, setClientInputError] = useState('');
  const handleClientInputChange = (event) => {
    const inputValue = event.target.value;
    setClientInput(inputValue);
  };
  const handleClientInputClick = () => {
    setClientInputError('');
  };

  const [emailInput, setEmailInput] = useState(emailClient || '');
  const handleEmailInput = (event) => {
    const inputValue = event.target.value;
    setEmailInput(inputValue);
  };

  const [celularInput, setCelularInput] = useState(celularClient || '');
  const [celularInputError, setCelularInputError] = useState('');
  const handleCelularInput = (event) => {
    const inputValue = event.target.value;
    setCelularInput(inputValue);
  };

  const [rucInput, setRucInput] = useState(rucClient || '');
  const [rucInputError, setRucInputError] = useState('');
  const [loadingRuc, setLoadingRuc] = useState(false);
  const handleRucInputChange = (event) => {
    const inputValue = event.target.value;
    setRucInput(inputValue);
  };

  const [razonSocialInput, setRazonSocialInput] = useState(
    razonSocialClient || ''
  );
  const [razonSocialInputError, setRazonSocialInputError] = useState('');
  const handleRazonSocialChange = (event) => {
    const inputValue = event.target.value;
    setRazonSocialInput(inputValue);
  };

  const handleFindDni = async () => {
    try {
      setDniError('');
      if (dni.length !== 8) {
        setDniError('DNI inválido');
        return;
      }
      setLoadingDni(true);
      const resDatabase = await getClientByDni(dni);
      if (resDatabase) {
        setClientInput(resDatabase?.personaResponsable);
        setCelularInput(resDatabase?.celular);
        setEmailInput(resDatabase?.email);
        setLoadingDni(false);
        setClientInputError('');
        setCelularInputError('');
        return;
      }

      const resAPI = await getClientDataAPIByDni({ dni: dni });
      if (!resAPI) {
        setDniError('DNI inválido');
        setLoadingDni(false);
        return;
      }
      if (resAPI) {
        const { apellidoMaterno, apellidoPaterno, nombres } = resAPI.data;
        const nombresFormateados = formatearNombres(nombres);
        const apellidosFormateados = formatearNombres(
          `${apellidoPaterno} ${apellidoMaterno}`
        );
        const clientApellidosNombres = `${apellidosFormateados} ${nombresFormateados}`;
        setClientInput(clientApellidosNombres);
        setLoadingDni(false);
        setClientInputError('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFindRuc = async () => {
    try {
      if (rucInput.length !== 11) {
        setRucInputError('RUC inválido');
        return;
      }
      setLoadingRuc(true);
      const resDatabase = await getClientByRuc(rucInput);
      if (resDatabase) {
        setRazonSocialInput(resDatabase?.razonSocial);
        setClientInput(resDatabase?.personaResponsable);
        setCelularInput(resDatabase?.celular);
        setEmailInput(resDatabase?.email);
        setLoadingRuc(false);
        setRucInputError('');
        setRazonSocialInputError('');
        setClientInputError('');
        return;
      }
      const res = await getRucData({
        ruc: rucInput,
      });
      if (!res) {
        setLoadingRuc(false);
        return;
      }
      if (res) {
        const { razonSocial } = res.data;
        setRazonSocialInput(razonSocial);
        setLoadingRuc(false);
        setRazonSocialInputError('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setClientType(tipoClient);
    setClientInput(nombreClient);
    dniClient ? setDni(dniClient) : setDni('');
    setCelularInput(celularClient);
    emailClient === 'Ninguno' ? setEmailInput('') : setEmailInput(emailClient);
    rucClient ? setRucInput(rucClient) : setRucInput('');
    razonSocialClient
      ? setRazonSocialInput(razonSocialClient)
      : setRazonSocialInput('');
  }, [
    nombreClient,
    dniClient,
    celularClient,
    emailClient,
    rucClient,
    razonSocialClient,
    tipoClient,
  ]);

  return (
    <>
      <Tooltip title="Editar" placement="bottom" disableInteractive>
        <button
          onClick={handleOpenEditClientePersona}
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 opacity-80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </Tooltip>
      <Modal open={openEditClientePersona} onClose={handleCancelButton}>
        <div className="w-[75%] h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-3 gap-5 select-none">
          <div className="col-span-3 px-3 border-b border-b-gray-400 flex text-blue-600">
            <h1 className="text-2xl my-3 font-bold">Editar Cliente</h1>
            <span className="flex items-center ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </span>
          </div>
          <div className="flex flex-col p-4 justify-center">
            <label htmlFor="">Tipo de Cliente</label>
            <select
              name="tipoDeCliente"
              id=""
              value={clientType}
              onChange={handleSelectClientType}
              className="border border-gray-400 rounded-md h-10"
            >
              <option value="persona">Persona</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>
          <div className="flex flex-col col-span-2 p-4">
            {clientType === 'persona' ? (
              <>
                <div className="grid grid-cols-8 gap-3">
                  <div className="col-span-3 flex flex-col">
                    <div className="flex items-center">
                      <label htmlFor="" className="mr-1">
                        DNI
                      </label>
                      <span className="text-red-500">*</span>
                    </div>
                    <div className="flex">
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
                    {dniError && (
                      <span className="text-red-500">{dniError}</span>
                    )}
                  </div>
                  <div className="col-span-5 flex flex-col">
                    <div>
                      <label htmlFor="">Cliente</label>
                      <span className="text-red-500"> *</span>
                    </div>
                    <input
                      type="text"
                      autoComplete="off"
                      value={clientInput}
                      onChange={handleClientInputChange}
                      onClick={handleClientInputClick}
                      className="w-full border border-gray-400 rounded-md p-2"
                    />
                    {clientInputError && (
                      <span className="text-red-500">{clientInputError}</span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-2 flex flex-col">
                    <div>
                      <label htmlFor="">RUC </label>
                      <span className="text-red-500">*</span>
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="Buscar"
                        value={rucInput}
                        onChange={handleRucInputChange}
                        onClick={() => {
                          setRucInputError('');
                        }}
                        className="w-[180px] h-10 border border-gray-400 rounded-md p-2"
                      />
                      {loadingRuc ? (
                        <div className="flex justify-center items-center w-10 h-[45px] bg-white rounded-md ml-1 border border-blue-600">
                          <CircularProgress size={20} />
                        </div>
                      ) : (
                        <span
                          className="flex justify-center items-center h-10 w-10 bg-blue-600 rounded-md ml-1 cursor-pointer"
                          onClick={handleFindRuc}
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
                    {rucInputError && (
                      <span className="text-red-500">{rucInputError}</span>
                    )}
                  </div>
                  <div className="col-span-3 flex flex-col">
                    <label htmlFor="">
                      Razón Social <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      value={razonSocialInput}
                      onChange={handleRazonSocialChange}
                      onClick={() => {
                        setRazonSocialInputError('');
                      }}
                      className="w-full h-10 border border-gray-400 rounded-md p-2"
                    />
                    {razonSocialInputError && (
                      <span className="text-red-500">
                        {razonSocialInputError}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          {clientType === 'persona' ? (
            <>
              <div className="flex flex-col pb-4 pl-4">
                <label htmlFor="">
                  Celular <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={celularInput}
                  onClick={() => {
                    setCelularInputError('');
                  }}
                  onChange={handleCelularInput}
                  className="h-10 border border-gray-400 rounded-md p-2 mr-1"
                />
                {celularInputError && (
                  <span className="text-red-500">{celularInputError}</span>
                )}
              </div>
              <div className="flex flex-col pb-4 pl-4">
                <label htmlFor="">Correo Electrónico</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={emailInput}
                  onChange={handleEmailInput}
                  className="h-10 border border-gray-400 rounded-md p-2 mr-1"
                />
              </div>
              <div className="col-span-3 flex justify-end h-[60px] border-t border-t-gray-400 items-center">
                <button
                  onClick={handleCancelButton}
                  className="h-10 px-2 bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-black rounded-md flex items-center justify-center mr-3"
                >
                  <p className="mr-1">Cancelar</p>
                </button>

                <button
                  onClick={handleSaveClientePersonaButton}
                  className="h-10 px-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md flex items-center justify-center mr-3"
                >
                  <p className="mr-1">Guardar</p>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col pb-4 pl-4">
                <label htmlFor="">DNI</label>
                <div className="flex">
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Buscar"
                    value={dni}
                    onClick={handleDniInputClick}
                    onChange={handleDniInput}
                    className="w-[220px] h-10 border border-gray-400 rounded-md p-2 mr-1"
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
                {dniError && <span className="text-red-500">{dniError}</span>}
              </div>
              <div className="col-span-2 flex flex-col pb-4 px-4">
                <label htmlFor="">
                  Persona Responsable <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={clientInput}
                  onChange={handleClientInputChange}
                  onClick={() => {
                    setClientInputError('');
                  }}
                  className="w-full h-10 border border-gray-400 rounded-md p-2"
                />
                {clientInputError && (
                  <span className="text-red-500">{clientInputError}</span>
                )}
              </div>
              <div className="flex flex-col pb-4 pl-4">
                <label htmlFor="">
                  Celular <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={celularInput}
                  onClick={() => {
                    setCelularInputError('');
                  }}
                  onChange={handleCelularInput}
                  className="w-full h-10 border border-gray-400 rounded-md p-2"
                />
                {celularInputError && (
                  <span className="text-red-500">{celularInputError}</span>
                )}
              </div>
              <div className="flex flex-col pb-4 pl-4 col-span-2">
                <div className="w-1/2">
                  <label htmlFor="">Correo Electrónico</label>
                  <input
                    type="text"
                    autoComplete="off"
                    value={emailInput}
                    onChange={handleEmailInput}
                    className="w-full h-10 border border-gray-400 rounded-md p-2"
                  />
                </div>
              </div>
              <div className="col-span-3 flex justify-end h-[60px] border-t border-t-gray-400 items-center">
                <button
                  onClick={handleCancelButton}
                  className="h-10 px-2 bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-black rounded-md flex items-center justify-center mr-3"
                >
                  <p className="mr-1">Cancelar</p>
                </button>
                <button
                  onClick={handleSaveClienteEmpresaButton}
                  className="h-10 px-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md flex items-center justify-center mr-3"
                >
                  <p className="mr-1">Guardar</p>
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export { EditCliente };
