import { useEffect, useMemo, useState } from 'react';
import { generarReporteOrdenes } from '../../utils/generarReporteOrdenes';
import { Sidebar } from '../../components/common/Sidebar';
import { useOrden } from '../../context/OrdenContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { generarPdf } from '../../utils/generarPdf';
import { Tooltip } from '@mui/material';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function HistorialOrdenesPage() {
  const {
    setEquipo,
    setCliente,
    getAreas,
    getTiposServicios,
    getUsers,
    getOrdenesByParameters,
  } = useOrden();

  const navigate = useNavigate();
  const queryParameters = useQuery();

  const [areas, setAreas] = useState([]);
  const [tiposServicio, setTiposServicio] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const [lista, setLista] = useState([]);

  const [queryDB, setQueryDB] = useState({});

  const [busquedaHecha, setBusquedaHecha] = useState(false);

  const elementosPorPagina = 20;

  const findByQuery = async () => {
    try {
      let queryFind = {};
      const identificadorQuery = queryParameters.get('orderId');
      const estadoQuery = queryParameters.get('estado');
      const areaQuery = queryParameters.get('area');
      const tipoServicioQuery = queryParameters.get('tipoServicio');
      const userIdQuery = queryParameters.get('userId');
      const creacionFechaInicioQuery = queryParameters.get(
        'creacionFechaInicio'
      );
      const creacionFechaFinalQuery = queryParameters.get('creacionFechaFinal');
      const entregaFechaInicioQuery = queryParameters.get('entregaFechaInicio');
      const entregaFechaFinalQuery = queryParameters.get('entregaFechaFinal');

      if (identificadorQuery) {
        queryFind = { ...queryFind, orderId: identificadorQuery };
        setOrderIdInput(identificadorQuery);
      }
      if (estadoQuery) {
        queryFind = { ...queryFind, estado: estadoQuery };
        setEstadoSelected(estadoQuery);
      }
      if (areaQuery) {
        queryFind = { ...queryFind, area: areaQuery };
        setAreaSelected(areaQuery);
      }
      if (tipoServicioQuery) {
        queryFind = { ...queryFind, tipoServicio: tipoServicioQuery };
        setTipoServicioSelected(tipoServicioQuery);
      }
      if (userIdQuery) {
        queryFind = { ...queryFind, userId: userIdQuery };
        setTecnicoSelected(userIdQuery);
      }
      if (creacionFechaInicioQuery) {
        queryFind = {
          ...queryFind,
          creacionFechaInicio: creacionFechaInicioQuery,
        };
        setCreacionFechaInicio(creacionFechaInicioQuery);
      }
      if (creacionFechaFinalQuery) {
        queryFind = {
          ...queryFind,
          creacionFechaFinal: creacionFechaFinalQuery,
        };
        setCreacionFechaFinal(creacionFechaFinalQuery);
      }
      if (entregaFechaInicioQuery) {
        queryFind = {
          ...queryFind,
          entregaFechaInicio: entregaFechaInicioQuery,
        };
        setEntregaFechaInicio(entregaFechaInicioQuery);
      }
      if (entregaFechaFinalQuery) {
        queryFind = {
          ...queryFind,
          entregaFechaFinal: entregaFechaFinalQuery,
        };
        setEntregaFechaFinal(entregaFechaFinalQuery);
      }

      if (Object.keys(queryFind).length === 0) {
        return;
      }

      const res = await getOrdenesByParameters(queryFind, currentPage, elementosPorPagina);
      setLista(res);

      setQueryDB(queryFind);

      const totalItems = await getOrdenesByParameters(queryFind, 1, 0);
      setTotalLista(totalItems?.length);
      setBusquedaHecha(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findByQuery();
    setEquipo({});
    setCliente({});
  }, []);

  const [totalLista, setTotalLista] = useState(0);

  const [orderIdInput, setOrderIdInput] = useState('');
  const [creacionFechaInicio, setCreacionFechaInicio] = useState(null);
  const [creacionFechaFinal, setCreacionFechaFinal] = useState(null);
  const [entregaFechaInicio, setEntregaFechaInicio] = useState(null);
  const [entregaFechaFinal, setEntregaFechaFinal] = useState(null);

  const [tecnicoSelected, setTecnicoSelected] = useState('');
  const [areaSelected, setAreaSelected] = useState('');
  const [tipoServicioSelected, setTipoServicioSelected] = useState('');
  const [estadoSelected, setEstadoSelected] = useState('');

  const handleBuscar = async () => {
    try {
      let query = {};
      let urlQuery = '';

      if (orderIdInput.length !== 0) {
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&orderId=${orderIdInput}`;
        } else {
          urlQuery = `?orderId=${orderIdInput}`;
        }
        query = { ...query, orderId: orderIdInput };
      }
      if (tecnicoSelected !== '') {
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&userId=${tecnicoSelected}`;
        } else {
          urlQuery = `?userId=${tecnicoSelected}`;
        }
        query = { ...query, userId: tecnicoSelected };
      }
      if (areaSelected !== '') {
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&area=${areaSelected}`;
        } else {
          urlQuery = `?area=${areaSelected}`;
        }
        query = { ...query, area: areaSelected };
      }
      if (tipoServicioSelected !== '') {
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&tipoServicio=${tipoServicioSelected}`;
        } else {
          urlQuery = `?tipoServicio=${tipoServicioSelected}`;
        }
        query = { ...query, tipoServicio: tipoServicioSelected };
      }
      if (estadoSelected !== '') {
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&estado=${estadoSelected}`;
        } else {
          urlQuery = `?estado=${estadoSelected}`;
        }
        query = { ...query, estado: estadoSelected };
      }
      if (creacionFechaInicio) {
        if (!creacionFechaFinal) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al buscar',
            text: 'Debe indicar una Fecha Final de Creación',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
          });
          return;
        }
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&creacionFechaInicio=${creacionFechaInicio}`;
        } else {
          urlQuery = `?creacionFechaInicio=${creacionFechaInicio}`;
        }
        query = { ...query, creacionFechaInicio: creacionFechaInicio };
      }
      if (creacionFechaFinal) {
        if (!creacionFechaInicio) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al buscar',
            text: 'Debe indicar una Fecha Inicial de Creación',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
          });
          return;
        }
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&creacionFechaFinal=${creacionFechaFinal}`;
        } else {
          urlQuery = `?creacionFechaFinal=${creacionFechaFinal}`;
        }
        query = { ...query, creacionFechaFinal: creacionFechaFinal };
      }
      if (entregaFechaInicio) {
        if (!entregaFechaFinal) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al buscar',
            text: 'Debe indicar una Fecha Final de Entrega',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
          });
          return;
        }
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&entregaFechaInicio=${entregaFechaInicio}`;
        } else {
          urlQuery = `?entregaFechaInicio=${entregaFechaInicio}`;
        }
        query = { ...query, entregaFechaInicio: entregaFechaInicio };
      }
      if (entregaFechaFinal) {
        if (!entregaFechaInicio) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error al buscar',
            text: 'Debe indicar una Fecha Inicial de Entrega',
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 3500,
          });
          return;
        }
        if (urlQuery !== '') {
          urlQuery = urlQuery + `&entregaFechaFinal=${entregaFechaFinal}`;
        } else {
          urlQuery = `?entregaFechaFinal=${entregaFechaFinal}`;
        }
        query = { ...query, entregaFechaFinal: entregaFechaFinal };
      }

      const response = await getOrdenesByParameters(
        query,
        1,
        elementosPorPagina
      );

      const totalItems = await getOrdenesByParameters(query, 1, 0);
      setTotalLista(totalItems.length);

      setLista(response);

      setQueryDB(query);

      setCurrentPage(1);

      setBusquedaHecha(true);

      if (urlQuery === '') {
        window.history.replaceState({}, '', '/historial-ordenes');
      } else {
        window.history.replaceState({}, '', urlQuery);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLimpiar = () => {
    setOrderIdInput('');
    setCreacionFechaInicio(null);
    setCreacionFechaFinal(null);
    setEntregaFechaInicio(null);
    setEntregaFechaFinal(null);
    setTecnicoSelected('');
    setAreaSelected('');
    setTipoServicioSelected('');
    setEstadoSelected('');

    window.history.replaceState({}, '', '/historial-ordenes');
  };

  const handleDescargar = async () => {
    if (!busquedaHecha) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error al generar la lista',
        text: 'Realice una búsqueda',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3500,
      });
      return;
    }
    const response = await getOrdenesByParameters(queryDB, 1, 0);

    await generarReporteOrdenes(response, queryDB);
  };

  const loadLista = async (pagina) => {
    try {
      const res = await getOrdenesByParameters(
        queryDB,
        pagina,
        elementosPorPagina
      );
      setLista(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Tabla
  const [currentPage, setCurrentPage] = useState(1);

  const previousPage = () => {
    if (currentPage <= 1) {
      return;
    }
    loadLista(currentPage - 1);
    setCurrentPage(currentPage - 1);
  };

  const nextPage = async () => {
    try {
      const res = await getOrdenesByParameters(
        queryDB,
        currentPage + 1,
        elementosPorPagina
      );
      if (res.length === 0) {
        return;
      }
      setLista(res);
      setCurrentPage(currentPage + 1);
    } catch (error) {
      console.log(error);
    }
  };

  const asyncPetitions = async () => {
    const [areas, tiposServicio, tecnicos] = await Promise.all([
      getAreas(),
      getTiposServicios(),
      getUsers(),
    ]);
    setAreas(areas);
    setTiposServicio(tiposServicio);
    setTecnicos(tecnicos);
  };

  useEffect(() => {
    asyncPetitions();
  }, []);

  return (
    <div className="w-full h-screen bg-[#efeff4] overflow-hidden">
      <Sidebar />
      <div className="absolute left-[330px] h-auto w-[calc(100%-350px)] flex flex-col min-w-[1000px]">
        <div className="flex flex-col items-center w-full h-full font-normal">
          <h1 className="text-[2rem] mt-[20px] text-center bg-white px-[20px] p-[6px] rounded-[10px] shadow-md mb-2 font-bold text-blue-800 select-none">
            REPORTE DE ÓRDENES
          </h1>
          <div className="w-full h-auto bg-white rounded-[10px] shadow-md flex flex-col">
            {/* Heading */}
            <div className="w-full flex flex-wrap justify-between">
              <div className="flex flex-col justify-center items-center p-2 border rounded-lg m-2">
                <span className="pb-2 font-medium">Identificador</span>
                <div className="flex justify-center items-center mt-2">
                  <input
                    type="text"
                    value={orderIdInput}
                    onChange={(e) => setOrderIdInput(e.target.value)}
                    className="w-[250px] h-[20px] border-gray-300 border-[1px] py-5 px-[10px] rounded-md"
                    placeholder="ID de la orden"
                  />
                </div>
              </div>
              <div className="border rounded-lg p-2 m-2 flex flex-col">
                <span className="border-b pb-2 font-medium">
                  Fecha de Creación
                </span>
                <div className="flex mt-3">
                  <div className="flex flex-col justify-center items-center p-2">
                    <DatePicker
                      label="Fecha de Inicio"
                      value={
                        creacionFechaInicio ? dayjs(creacionFechaInicio) : null
                      }
                      onChange={(newValue) => {
                        setCreacionFechaInicio(newValue.toISOString());
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center p-2">
                    <DatePicker
                      label="Fecha Final"
                      value={
                        creacionFechaFinal ? dayjs(creacionFechaFinal) : null
                      }
                      onChange={(newValue) => {
                        setCreacionFechaFinal(newValue.toISOString());
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-2 m-2 flex flex-col">
                <span className="border-b pb-2 font-medium">
                  Fecha de Entrega
                </span>
                <div className="flex mt-3">
                  <div className="flex flex-col justify-center items-center p-2">
                    <DatePicker
                      label="Fecha de Inicio"
                      value={
                        entregaFechaInicio ? dayjs(entregaFechaInicio) : null
                      }
                      onChange={(newValue) => {
                        setEntregaFechaInicio(newValue.toISOString());
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center p-2">
                    <DatePicker
                      label="Fecha Final"
                      value={
                        entregaFechaFinal ? dayjs(entregaFechaFinal) : null
                      }
                      onChange={(newValue) => {
                        setEntregaFechaFinal(newValue.toISOString());
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center items-center px-2 border mx-2 rounded-lg">
                <span className="font-medium mb-2">Técnico</span>
                <select
                  name="areasReporteOrdenes"
                  id=""
                  value={tecnicoSelected}
                  onChange={(e) => setTecnicoSelected(e.target.value)}
                  className="w-[400px] border border-gray-400 rounded-[5px] py-2"
                >
                  <option value="">Todos</option>
                  {tecnicos?.map((tecnico) => {
                    return (
                      <option key={tecnico?._id} value={tecnico?._id}>
                        {`${tecnico?.nombres} ${tecnico?.apellidos}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-col justify-center items-center px-2 border mx-2 rounded-lg py-2 mt-2">
                <span className="font-medium mb-2">Área</span>
                <select
                  name="areasReporteOrdenes"
                  id=""
                  value={areaSelected}
                  onChange={(e) => setAreaSelected(e.target.value)}
                  className="w-[250px] col-span-3 border border-gray-400 rounded-[5px] py-2"
                >
                  <option value="">Todos</option>
                  {areas?.map((area) => {
                    return (
                      <option key={area?._id} value={area?.id}>
                        {area?.area}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-col justify-center items-center px-2 border mx-2 rounded-lg py-2 mt-2">
                <span className="font-medium mb-2">Tipo de Servicio</span>
                <select
                  name="areasReporteOrdenes"
                  id=""
                  value={tipoServicioSelected}
                  onChange={(e) => setTipoServicioSelected(e.target.value)}
                  className="w-[300px] col-span-3 border border-gray-400 rounded-[5px] py-2"
                >
                  <option value="">Todos</option>
                  {tiposServicio?.map((tipoServicio) => {
                    return (
                      <option key={tipoServicio?._id} value={tipoServicio?.id}>
                        {tipoServicio?.tipoServicio}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="flex flex-col justify-center items-center px-2 border mx-2 rounded-lg py-2 mt-2">
                <span className="font-medium mb-2">Estado</span>
                <select
                  name="ReporteOrdenesEstado"
                  id=""
                  value={estadoSelected}
                  onChange={(e) => setEstadoSelected(e.target.value)}
                  className="w-[250px] col-span-3 border border-gray-400 rounded-[5px] py-2"
                >
                  <option value="">Todos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="completada">Completadas</option>
                  <option value="finalizada">Finalizadas</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between mx-2 mb-5 mt-5">
              <button
                className="w-[150px] bg-blue-700 border border-gray-400 hover:bg-blue-800 text-white px-2 py-2 rounded-md shadow-md flex self-start justify-center items-center"
                onClick={handleBuscar}
              >
                <p className="text-white font-bold">Buscar</p>
                <span className="ml-2">
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
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </span>
              </button>
              <button
                className="w-[150px] bg-rose-700 border border-gray-400 hover:bg-rose-800 text-white px-2 py-2 rounded-md shadow-md flex self-start justify-center items-center"
                onClick={handleLimpiar}
              >
                <p className="text-white font-bold">Limpiar</p>
                <span className="ml-2">
                  <svg
                    fill="#ffffff"
                    height="20"
                    width="20"
                    version="1.1"
                    viewBox="0 0 315.001 315.001"
                    enableBackground="new 0 0 315.001 315.001"
                  >
                    <path d="m312.951,2.05c-2.733-2.731-7.165-2.732-9.9,0l-132.826,132.824c-2.661-1.336-5.511-2.049-8.468-2.049-7.14,0-13.186,3.962-16.813,7.048-3.48-0.997-7.107-1.501-10.828-1.501-19.045,0-38.755,13.193-58.068,27.796-0.002,0.001-0.003,0.002-0.005,0.004-3.023,2.285-6.036,4.604-9.035,6.913l-.975,.751c-31.116,23.949-62.928,47.934-63.247,48.174-1.618,1.22-2.628,3.081-2.769,5.102-0.141,2.021 0.601,4.005 2.033,5.438l80.4,80.4c1.317,1.316 3.101,2.05 4.95,2.05 0.162,0 0.325-0.006 0.488-0.017 2.021-0.142 3.882-1.152 5.102-2.771 0.239-0.317 24.222-32.129 48.175-63.248l.76-.986c19.943-25.901 40.528-52.636 33.207-77.93 2.977-3.502 6.767-9.254 7.027-16.062 0.124-3.229-0.584-6.333-2.032-9.215l132.824-132.821c2.733-2.734 2.733-7.166 0-9.9zm-170.333,221.813l-51.471-51.475c4.971-3.616 9.916-7.013 14.771-9.942l46.671,46.673c-2.917,4.807-6.312,9.731-9.971,14.744zm-12.546,16.563c-17.571,22.827-35.156,46.024-43.408,56.937l-9.466-9.466 23.992-27.241c2.556-2.901 2.274-7.325-0.626-9.88-2.902-2.556-7.326-2.274-9.88,0.626l-23.405,26.576-10.18-10.18 8.904-8.903c2.734-2.733 2.734-7.166 0.001-9.899-2.733-2.733-7.166-2.733-9.899-0.001l-8.905,8.904-10.178-10.178 26.573-23.406c2.901-2.556 3.182-6.979 0.626-9.88-2.556-2.902-6.979-3.182-9.88-0.626l-27.239,23.992-9.465-9.465c10.912-8.252 34.108-25.838 56.936-43.407l.976-.752c1.427-1.099 2.857-2.2 4.29-3.298l54.28,54.283c-1.089,1.42-2.186,2.845-3.286,4.274l-.761,.99zm32.46-77.439c-2.321,1.99-3.083,5.257-1.88,8.068 3.259,7.619 2.262,16.02-1.348,24.979l-40.293-40.295c5.258-2.125 10.325-3.368 15.104-3.368 3.505,0 6.721,0.646 9.83,1.977 2.814,1.202 6.079,0.441 8.068-1.881 1.515-1.768 6.071-5.643 9.743-5.643 0.938,0 2.403,0.22 4.301,2.117 1.963,1.962 2.145,3.496 2.113,4.479-0.129,3.896-4.236,8.341-5.638,9.567z" />
                  </svg>
                </span>
              </button>
            </div>
            {busquedaHecha ? (
              <>
                <div className="flex justify-end mx-2 mb-5">
                  <button
                    className="w-[150px] bg-rose-700 border border-gray-400 hover:bg-rose-800 text-white px-2 py-2 rounded-md shadow-md flex self-start justify-center items-center"
                    onClick={handleDescargar}
                  >
                    <p className="text-white font-bold">Descargar</p>
                    <span className="ml-2">
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
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
                <div className="flex mx-2 mb-2">
                  <div className="px-2 py-1 border rounded-lg">
                    <p className="text-black font-medium">
                      Total de Ordenes: {`${totalLista}`}{' '}
                    </p>
                  </div>
                </div>
              </>
            ) : null}

            {/* Lista */}
            <div className="w-full h-auto rounded-b-[10px] border-t-[1px] border-t-gray-400">
              {busquedaHecha ? (
                <table className="w-full table-auto">
                  <thead className="w-full select-none">
                    <tr>
                      <th className="border-r px-2">N°</th>
                      <th className="border-r px-2">ID</th>
                      <th className="border-r px-2">Tipo de Servicio</th>
                      <th className="border-r px-2">Equipo</th>
                      <th className="border-r px-2">Cliente</th>
                      <th className="px-2">Precio</th>
                      <th className="px-2"> </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {lista?.map((item, index) => {
                      return (
                        <tr key={index} className="h-10 border">
                          <td className="text-center px-2">
                            {(currentPage - 1) * elementosPorPagina + index + 1}
                          </td>
                          <td className="text-center px-2">
                            {item?.identificador}
                          </td>
                          <td className={`text-center`}>
                            {item?.tipoServicio}
                          </td>
                          <td className="text-center">
                            {`${item?.equipo?.marca} - ${item?.equipo?.categoria} - ${item?.equipo?.producto}`}
                          </td>
                          <td className="text-center">
                            {item?.cliente?.tipo === 'persona'
                              ? item?.cliente?.personaResponsable
                              : item?.cliente?.razonSocial}
                          </td>
                          <td className="text-center">
                            S/. {}
                            {Number(
                              parseFloat(item?.monto) +
                                parseFloat(item?.montoAdicional)
                            ).toFixed(2)}
                          </td>
                          <td className="text-center px-2">
                            <div className="flex justify-center items-center gap-1">
                              <Tooltip
                                title="Ver detalle"
                                placement="left"
                                disableInteractive
                              >
                                <span
                                  className="border p-1 rounded-lg bg-gray-100 hover:bg-gray-300 cursor-pointer relative"
                                  onClick={() => {
                                    navigate(`/ordenes/${item?._id}`);
                                  }}
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
                                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                    />
                                  </svg>
                                </span>
                              </Tooltip>
                              <Tooltip
                                title="Imprimir"
                                placement="left"
                                disableInteractive
                              >
                                <span
                                  className="border p-1 rounded-lg bg-gray-100 hover:bg-gray-300 cursor-pointer relative"
                                  onClick={() => {
                                    generarPdf(item);
                                  }}
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
                                      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                                    />
                                  </svg>
                                </span>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
          <nav>
            <ul className="w-full flex justify-center items-center mt-1 h-10 select-none mb-1">
              <li
                className="rounded-l-lg h-10 flex items-center justify-center px-3 bg-white cursor-pointer"
                onClick={previousPage}
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
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </li>
              <li
                className={`border h-10 w-10 flex justify-center items-center cursor-pointer bg-blue-600 text-white`}
              >
                <a href="#">{currentPage}</a>
              </li>
              <li
                className="rounded-r-lg h-10 flex items-center justify-center px-3 bg-white cursor-pointer"
                onClick={nextPage}
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
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export { HistorialOrdenesPage };
