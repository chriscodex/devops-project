import { Modal } from '@mui/material';
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useOrden } from '../../../context/OrdenContext';
import { formatearNombres } from '../../../utils/formatter';

function AddClientModal({ editCliente, setEditCliente }) {
  const {
    getClientDataAPIByDni,
    getClientByDni,
    getRucData,
    getClientByRuc,
    setCliente,
    cliente,
  } = useOrden();

  const handleAgregarClientePersona = () => {
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
    const newCliente = {
      tipo: clientType,
      dni: dni,
      personaResponsable: clientInput,
      celular: celularInput,
      email: emailInput ? emailInput : 'Ninguno',
    };
    setCliente(newCliente);
    setOpenAddClient(false);
    setEditCliente(true);
  };

  const handleAgregarClienteEmpresa = () => {
    if (
      rucInput.length === 0 ||
      (rucInput.length < 11 && clientType === 'empresa')
    ) {
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
    const newCliente = {
      tipo: clientType,
      ruc: rucInput,
      razonSocial: razonSocialInput,
      personaResponsable: clientInput,
      celular: celularInput,
      email: emailInput,
    };
    setCliente(newCliente);
    setOpenAddClient(false);
    setEditCliente(true);
  };

  const [clientType, setClientType] = useState('persona');

  const handleSelectClientType = (event) => {
    const nuevoValor = event.target.value;
    setClientType(nuevoValor);
  };

  // Client Data by DNI
  const [clientInput, setClientInput] = useState('');
  const handleClientInputClick = () => {
    setClientInputError('');
  };

  // Get DNI From Input
  const [dni, setDni] = useState('');
  const handleDniInput = (event) => {
    const inputValue = event.target.value;
    setDni(inputValue);
  };

  const handleDniInputClick = () => {
    setDniError('');
  };

  // Celular input
  const [celularInput, setCelularInput] = useState('');
  const handleCelularInput = (event) => {
    const inputValue = event.target.value;
    setCelularInput(inputValue);
  };

  // Correo input
  const [emailInput, setEmailInput] = useState('');
  const handleEmailInput = (event) => {
    const inputValue = event.target.value;
    setEmailInput(inputValue);
  };

  // Errores
  const [dniError, setDniError] = useState('');
  const [clientInputError, setClientInputError] = useState('');
  const [celularInputError, setCelularInputError] = useState('');
  const [rucInputError, setRucInputError] = useState('');
  const [razonSocialInputError, setRazonSocialInputError] = useState('');

  /* Empresa Client */
  const [rucInput, setRucInput] = useState('');
  const [razonSocialInput, setRazonSocialInput] = useState('');
  const handleRucInputChange = (event) => {
    const inputValue = event.target.value;
    setRucInput(inputValue);
  };

  const [loadingRuc, setLoadingRuc] = useState(false);

  const handleFindRuc = async () => {
    try {
      if (rucInput.length !== 11) {
        setRucInputError('RUC inválido');
        return;
      }
      setLoadingRuc(true);
      const resDatabase = await getClientByRuc(rucInput);
      if (resDatabase) {
        setRazonSocialInput(resDatabase.razonSocial);
        setClientInput(resDatabase.personaResponsable);
        setCelularInput(resDatabase.celular);
        setEmailInput(resDatabase.email === 'Ninguno' ? '' : resDatabase.email);
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

  const handleRazonSocialChange = (event) => {
    const inputValue = event.target.value;
    setRazonSocialInput(inputValue);
  };

  const handleClientInputChange = (event) => {
    const inputValue = event.target.value;
    setClientInput(inputValue);
  };

  // Loading DNI
  const [loadingDni, setLoadingDni] = useState(false);

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
        setClientInput(resDatabase.personaResponsable);
        setCelularInput(resDatabase.celular);
        setEmailInput(resDatabase.email === 'Ninguno' ? '' : resDatabase.email);
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

  const [openAddClient, setOpenAddClient] = useState(false);

  const handleOpenAddClient = () => {
    setOpenAddClient(true);
  };

  const handleCloseAddClient = () => {
    setOpenAddClient(false);
    setRucInput('');
    setRazonSocialInput('');
    setClientInput('');
    setDni('');
    setCelularInput('');
    setEmailInput('');
  };

  const handleCancelarAddClient = () => {
    setOpenAddClient(false);
    setRucInput('');
    setRazonSocialInput('');
    setClientInput('');
    setDni('');
    setCelularInput('');
    setEmailInput('');
  };

  const handleCancelarEditAddClient = () => {
    setClientInput(cliente.personaResponsable);
    cliente.dni ? setDni(cliente.dni) : setDni('');
    setCelularInput(cliente.celular);
    cliente.email ? setEmailInput(cliente.email) : setEmailInput('');
    cliente.ruc ? setRucInput(cliente.ruc) : setRucInput('');
    cliente.razonSocial
      ? setRazonSocialInput(cliente.razonSocial)
      : setRazonSocialInput('');
    setOpenAddClient(false);
  };

  return (
    <>
      <button
        onClick={handleOpenAddClient}
        className="w-[180px] h-full bg-blue-600 hover:bg-blue-800 text-white rounded-md flex items-center justify-center"
      >
        <p className="mr-1">{editCliente ? 'Editar' : 'Agregar'}</p>
        {editCliente ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        )}
      </button>
      <Modal
        open={openAddClient}
        onClose={handleCloseAddClient}
        className="w-full h-full relative"
      >
        <div className="w-[75%] h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-3 gap-5 select-none">
          <div className="col-span-3 px-3 border-b border-b-gray-400 flex text-blue-600">
            <h1 className="text-2xl my-3 font-bold">
              {editCliente ? 'Editar Cliente' : 'Agregar Cliente'}
            </h1>
            <span className="flex items-center ml-1">
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
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
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
                  onClick={
                    editCliente
                      ? handleCancelarEditAddClient
                      : handleCancelarAddClient
                  }
                  className="h-10 px-2 bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-black rounded-md flex items-center justify-center mr-3"
                >
                  <p className="mr-1">Cancelar</p>
                </button>
                <button
                  onClick={handleAgregarClientePersona}
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
                  onClick={
                    editCliente
                      ? handleCancelarEditAddClient
                      : handleCancelarAddClient
                  }
                  className="h-10 px-2 bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-black rounded-md flex items-center justify-center mr-3"
                >
                  <p>Cancelar</p>
                </button>
                <button
                  onClick={handleAgregarClienteEmpresa}
                  className="h-10 px-2 bg-blue-600 hover:bg-blue-800 text-white rounded-md flex items-center justify-center mr-3"
                >
                  <p>Guardar</p>
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export { AddClientModal };
