import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useOrden } from '../../context/OrdenContext';

import { AddEquipoModal } from '../../components/modals/AddEquipoModal/AddEquipoModal';
import { AddClientModal } from '../../components/modals/AddClientModal/AddClientModal';

import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function NuevaOrdenPage() {
  const {
    getAllMarcas,
    getAllCategoriasEquipo,
    getPrioridades,
    getAreas,
    getTiposServicios,
    tiposServicio,
    areas,
    prioridades,
    cliente,
    setCliente,
    equipo,
    setEquipo,
    createOrden,
  } = useOrden();

  // Get all marcas & all categories
  useEffect(() => {
    getAllMarcas();
    getAllCategoriasEquipo();
    getPrioridades();
    getAreas();
    getTiposServicios();
    setEquipo({});
    setCliente({});
  }, []);

  const handleAlertaCreate = () => {
    Swal.fire({
      icon: 'success',
      title: 'Orden creada correctamente',
    });
  };

  const handleCrearOrden = async () => {
    try {
      if (Object.keys(cliente).length === 0) {
        setClienteError('Agregue un cliente');
        return;
      }
      if (Object.keys(equipo).length === 0) {
        setEquipoError('Agregue un equipo');
        return;
      }
      if (trabajoInput.length === 0) {
        setTrabajoInputError('Trabajo inválido');
        return;
      }
      if (monto.length === 0) {
        setMontoInputError('Monto inválido');
        return;
      }

      const date = dayjs(fecha).format('YYYY-MM-DDTHH:mm');

      const currentDate = dayjs().format('YYYY-MM-DDTHH:mm');

      const newOrden = {
        equipo,
        cliente,
        prioridad,
        area,
        tipoServicio,
        trabajo: trabajoInput,
        fecha: `${date}:00.00Z`,
        monto,
        estado: 'pendiente',
        createdAt: `${currentDate}:00.00Z`
      };
      const response = await createOrden(newOrden);
      if (response.status !== 200) {
        return;
      }
      setCliente({});
      setEquipo({});
      setTrabajoInput('');
      setMonto('');
      setFecha(new Date());
      setPrioridad('normal');
      setArea('Taller');
      setTipoServicio('diagnostico');
      setClienteData('Agregue un cliente');
      setEquipoData('Agregue un equipo');
      setTrabajoInputError('');
      setMontoInputError('');
      handleAlertaCreate();
      navigate(`/ordenes/${response.data._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const [clienteError, setClienteError] = useState('');
  const [equipoError, setEquipoError] = useState('');

  const [editEquipo, setEditEquipo] = useState(false);
  const [editCliente, setEditCliente] = useState(false);

  const [fecha, setFecha] = useState(new Date());

  const [equipoData, setEquipoData] = useState('Agregue un equipo');
  const [clienteData, setClienteData] = useState('Agregue un cliente');

  useEffect(() => {
    if (Object.keys(equipo).length != 0) {
      const equipoPlaceholder = `${equipo.marca} - ${equipo.categoria} - ${equipo.producto}`;
      setEquipoData(equipoPlaceholder);
      setEquipoError('');
    }
    if (Object.keys(cliente).length != 0) {
      if (cliente.tipo === 'empresa') {
        const clientePlaceholder = `${cliente.razonSocial}`;
        setClienteData(clientePlaceholder);
        setClienteError('');
      }
      if (cliente.tipo === 'persona') {
        const clientePlaceholder = `${cliente.personaResponsable}`;
        setClienteData(clientePlaceholder);
        setClienteError('');
      }
    }
  }, [equipo, cliente]);

  const [prioridad, setPrioridad] = useState(prioridades[0]?.prioridad || '');
  const handlePrioridadSelect = (event) => {
    setPrioridad(event.target.value);
  };

  const [area, setArea] = useState(areas[0]?.area || '');
  const handleAreaSelect = (event) => {
    setArea(event.target.value);
  };

  const [tipoServicio, setTipoServicio] = useState(
    tiposServicio[0]?.tipoServicio || ''
  );
  const handleTipoServicioSelect = (event) => {
    setTipoServicio(event.target.value);
  };

  const [trabajoInput, setTrabajoInput] = useState('');
  const [trabajoInputError, setTrabajoInputError] = useState('');
  const handleTrabajoInput = (event) => {
    setTrabajoInput(event.target.value);
  };

  const [monto, setMonto] = useState('');
  const [montoInputError, setMontoInputError] = useState('');
  const handleMontoInput = (event) => {
    const newInputValue = event.target.value;

    if (!/^\d*\.?\d*$/.test(newInputValue)) {
      setMonto(newInputValue.replace(/[^\d.]/g, ''));
    } else {
      setMonto(newInputValue);
    }
  };

  useEffect(() => {
    setPrioridad(prioridades[0]?.prioridad);
    setArea(areas[0]?.area);
    setTipoServicio(tiposServicio[0]?.tipoServicio);
  }, [prioridades, areas, tiposServicio]);

  return (
    <div className="w-full h-screen bg-[#efeff4] overflow-hidden">
      <Sidebar />

      <div className="absolute left-[320px] h-screen w-[calc(100%-320px)] flex flex-col">
        <div className="flex flex-col items-center justify-center w-full h-full font-light">
          {/* Crear Orden */}
          <div className="w-[calc(100%-50px)] h-[90vh] bg-white rounded-[10px] shadow-md flex flex-col mt-[120px] font-normal">
            {/* Heading */}
            <div className="font-bold text-gray-500 flex justify-between items-center py-[10px] pl-[10px]">
              <div className="flex w-[300px]">
                <h2 className="mr-[10px] select-none">NUEVA ORDEN</h2>
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
            </div>

            {/* Lista */}
            <div className="w-full h-full rounded-b-[10px] border-t-[1px] border-t-gray-400 flex flex-col">
              {/* Row -1 */}
              <div className="w-full flex h-[80px]">
                {/* Cliente */}
                <div className="w-[50%] h-full flex justify-start items-center">
                  <div className="w-full flex flex-col ml-[20px] ">
                    <p className="select-none">
                      Cliente <span className="text-red-500 font-bold">* </span>
                      {clienteError && (
                        <span className="text-red-500 font-medium">
                          {clienteError}
                        </span>
                      )}
                    </p>
                    <div className="flex w-full h-[45px] rounded-md items-center">
                      <input
                        type="text"
                        placeholder={clienteData}
                        autoComplete="off"
                        className="w-full h-full rounded-md pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
                        disabled
                      />
                      <AddClientModal
                        editCliente={editCliente}
                        setEditCliente={setEditCliente}
                      />
                    </div>
                  </div>
                </div>

                {/* Equipo */}
                <div className="w-[50%] h-full flex justify-start items-center mr-[20px]">
                  <div className="w-full flex flex-col ml-[20px] ">
                    <p className="select-none">
                      Equipo
                      <span className="text-red-500 font-bold"> * </span>
                      {equipoError && (
                        <span className="text-red-500 font-medium">
                          {equipoError}
                        </span>
                      )}
                    </p>
                    <div className="flex w-full h-[45px] rounded-[5px]">
                      <input
                        type="text"
                        disabled
                        placeholder={equipoData}
                        className="w-full h-full rounded-[5px] pl-[10px] border border-gray-400 focus:outline-blue-500 mr-1 placeholder-black"
                      />
                      <AddEquipoModal
                        editEquipo={editEquipo}
                        setEditEquipo={setEditEquipo}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row-2 */}
              <div className="w-full flex justify-between mt-[20px]">
                {/* Prioridad */}
                <div className="w-[25%] h-[80px] flexjustify-start items-center">
                  <div className="w-full flex flex-col ml-[20px] ">
                    <p className="select-none">Prioridad</p>
                    <div className="flex w-full h-[45px]">
                      <select
                        name="prioridad"
                        id=""
                        value={prioridad}
                        onChange={handlePrioridadSelect}
                        className="w-full  border border-gray-400 rounded-[5px]"
                      >
                        {prioridades?.map((prioridad) => (
                          <option
                            key={prioridad?._id}
                            value={prioridad?.prioridad}
                          >
                            {prioridad?.prioridad}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Area */}
                <div className="w-[25%] h-[80px] flex justify-start items-center">
                  <div className="w-full flex flex-col ml-[20px] ">
                    <p className="select-none">Área</p>
                    <div className="flex w-full h-[45px]">
                      <select
                        name="prioridad"
                        id=""
                        onChange={handleAreaSelect}
                        value={area}
                        className="w-full border border-gray-400 rounded-[5px]"
                      >
                        {areas?.map((area) => (
                          <option key={area?._id} value={area?.area}>
                            {area?.area}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tipo de Servicio */}
                <div className="w-[25%] h-[80px] flex justify-start items-center mr-[50px]">
                  <div className="w-full flex flex-col ml-[20px] ">
                    <p className="select-none">Tipo de servicio</p>
                    <div className="flex w-full h-[45px]">
                      <select
                        name="servicio"
                        id=""
                        value={tipoServicio}
                        onChange={handleTipoServicioSelect}
                        className="w-full border border-gray-400 rounded-[5px]"
                      >
                        {tiposServicio?.map((tipoDeServicio) => (
                          <option
                            key={tipoDeServicio?._id}
                            value={tipoDeServicio?.tipoServicio}
                          >
                            {tipoDeServicio?.tipoServicio}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row -3 */}
              <div className="w-full h-[200px] px-[20px] pt-[20px] flex flex-col">
                <p className="select-none">
                  Servicio <span className="text-red-500 font-bold">* </span>
                </p>
                <textarea
                  rows="4"
                  cols="50"
                  value={trabajoInput}
                  onChange={handleTrabajoInput}
                  onClick={() => setTrabajoInputError('')}
                  className="w-full h-full border border-gray-400 rounded-[5px] focus:outline-blue-500 p-[5px] resize-none"
                  placeholder="Servicio  a realizar"
                ></textarea>
                {trabajoInputError && (
                  <p className="text-red-500 font-medium">
                    Ingrese una descripción
                  </p>
                )}
              </div>

              {/* Row -5 */}
              <div className="w-full h-[100px] px-[20px] pt-[20px] flex justify-between">
                {/* Fecha y Hora */}
                <div className="w-[220px] flex justify-between items-center">
                  <div>
                    <MobileDateTimePicker
                      defaultValue={dayjs(new Date())}
                      label="Fecha y Hora de Entrega"
                      onAccept={(newDate) => setFecha(newDate)}
                      localeText={{
                        cancelButtonLabel: 'Cancelar',
                        toolbarTitle: 'Fecha y Hora',
                        okButtonLabel: 'Aceptar',
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="w-[220px] h-[80px] flex justify-between items-center">
                    <h2 className="mr-[15px] select-none">Monto</h2>
                    <div className="flex w-full h-[45px] border border-gray-400 rounded-[5px]">
                      <span className="bg-[#E5E7EB] flex justify-center items-center w-[45px] rounded-l-[5px] select-none">
                        S/
                      </span>
                      <input
                        type="text"
                        placeholder="Cantidad"
                        value={monto}
                        autoComplete="off"
                        onChange={handleMontoInput}
                        onClick={() => setMontoInputError('')}
                        className="w-full h-full rounded-r-[5px] pl-[10px] focus:outline-blue-500"
                      />
                    </div>
                  </div>
                  {montoInputError && (
                    <p className="text-red-500 font-medium text-end">
                      Ingresa un monto
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Button crear */}
          <div className="w-full flex justify-end mt-[20px] mb-[25px] pr-[40px]">
            <button
              onClick={handleCrearOrden}
              className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white px-4 py-2 rounded-md shadow-md flex"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-green-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <p className="text-white ml-[10px]">Grabar</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { NuevaOrdenPage };
