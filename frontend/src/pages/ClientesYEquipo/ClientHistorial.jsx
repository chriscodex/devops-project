import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useOrden } from '../../context/OrdenContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { formatDate } from '../../utils/formatter';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function ClientHistorial() {
  const { setEquipo, setCliente, getOrdenesByCliente, getClientById } =
    useOrden();

  const navigate = useNavigate();
  const params = useParams();
  const queryParameters = useQuery();

  const [lista, setLista] = useState([]);
  const [clientData, setClientData] = useState({});

  const [busquedaHecha, setBusquedaHecha] = useState(false);
  const [totalLista, setTotalLista] = useState(0);

  const [queryDB, setQueryDB] = useState({});
  const [creacionFechaInicio, setCreacionFechaInicio] = useState(null);
  const [creacionFechaFinal, setCreacionFechaFinal] = useState(null);
  const [entregaFechaInicio, setEntregaFechaInicio] = useState(null);
  const [entregaFechaFinal, setEntregaFechaFinal] = useState(null);

  const elementosPorPagina = 20;

  const findByQuery = async () => {
    try {
      let queryFind = {};

      const creacionFechaInicioQuery = queryParameters.get(
        'creacionFechaInicio'
      );
      const creacionFechaFinalQuery = queryParameters.get('creacionFechaFinal');
      const entregaFechaInicioQuery = queryParameters.get('entregaFechaInicio');
      const entregaFechaFinalQuery = queryParameters.get('entregaFechaFinal');

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

      const res = await getOrdenesByCliente(
        params.clientId,
        queryFind,
        currentPage,
        elementosPorPagina
      );
      setLista(res);

      setQueryDB(queryFind);

      const totalItems = await getOrdenesByCliente(
        params.clientId,
        queryFind,
        1,
        0
      );
      setTotalLista(totalItems?.length);

      setBusquedaHecha(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getClientData = async () => {
      try {
        const orderId = params.clientId;
        const res = await getClientById(orderId);
        setClientData(res);
      } catch (error) {
        console.log(error);
      }
    };
    getClientData();
    findByQuery();
    setEquipo({});
    setCliente({});
  }, []);

  const handleBuscar = async () => {
    try {
      let query = {};
      let urlQuery = '';
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

      const response = await getOrdenesByCliente(
        params.clientId,
        query,
        1,
        elementosPorPagina
      );

      const totalItems = await getOrdenesByCliente(
        params.clientId,
        query,
        1,
        0
      );
      setTotalLista(totalItems.length);

      setLista(response);

      setQueryDB(query);

      setCurrentPage(1);

      setBusquedaHecha(true);

      if (urlQuery === '') {
        window.history.replaceState(
          {},
          '',
          `/ordenes/cliente/${params.clientId}`
        );
      } else {
        window.history.replaceState({}, '', urlQuery);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Tabla
  const [currentPage, setCurrentPage] = useState(1);

  const handleLimpiar = () => {
    setCreacionFechaInicio(null);
    setCreacionFechaFinal(null);
    setEntregaFechaInicio(null);
    setEntregaFechaFinal(null);

    window.history.replaceState({}, '', '/clientes');
  };

  const loadLista = async (pagina) => {
    try {
      const res = await getOrdenesByCliente(
        params.clientId,
        queryDB,
        pagina,
        elementosPorPagina
      );
      setLista(res);
    } catch (error) {
      console.log(error);
    }
  };

  const previousPage = () => {
    if (currentPage <= 1) {
      return;
    }
    loadLista(currentPage - 1);
    setCurrentPage(currentPage - 1);
  };

  const nextPage = async () => {
    try {
      const res = await getOrdenesByCliente(
        params.clientId,
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

  return (
    <div className="w-full h-screen bg-[#efeff4] overflow-hidden">
      <Sidebar />
      <div className="absolute left-[310px] h-auto w-[calc(100%-310px)] flex flex-col">
        <div className="flex flex-col items-center w-full h-full font-normal">
          <h1 className="text-[2rem] mt-[20px] text-center bg-white px-[20px] p-[6px] rounded-[10px] shadow-md mb-2 font-bold text-blue-800 select-none">
            Historial
          </h1>
          <div className="px-[20px] w-full grid lg:grid-cols-2 md:grid-cols-1 mb-3">
            <div className="border rounded-lg bg-white grid p-3">
              <div className="">
                {clientData?.tipo === 'empresa' ? (
                  <>
                    <div className="flex items-center border-b py-2">
                      <p className="font-medium mr-2">Razon Social: </p>
                      {clientData?.razonSocial}
                    </div>
                    <div className="flex items-center border-b py-2">
                      <p className="font-medium mr-2">RUC: </p>
                      {clientData?.ruc}
                    </div>
                  </>
                ) : null}
                <div className="flex items-center border-b py-2">
                  <span className="font-medium mr-2">
                    {clientData?.tipo === 'persona'
                      ? 'Cliente: '
                      : 'Persona Responsable: '}
                  </span>
                  <span>{clientData?.personaResponsable}</span>
                </div>
                {clientData?.tipo === 'persona' ? (
                  <>
                    <div className="flex items-center border-b py-2">
                      <p className="font-medium mr-2">DNI: </p>
                      {clientData?.dni}
                    </div>
                  </>
                ) : null}
                <div className="flex items-center border-b py-2">
                  <p className="font-medium mr-2">Celular: </p>
                  {clientData?.celular}
                </div>
                <div className="flex items-center py-2">
                  <p className="font-medium mr-2">Email: </p>
                  {clientData?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[calc(100%-50px)] h-auto bg-white rounded-[10px] shadow-md flex flex-col">
            <div className="w-full flex flex-wrap justify-between">
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
                <div className="flex mx-2 mb-2">
                  <div className="px-2 py-1 border rounded-lg">
                    <p className="text-black font-medium">
                      Total de Órdenes: {totalLista}
                    </p>
                  </div>
                </div>
                {/* Heading */}
                <div className="font-bold text-gray-500 flex justify-between items-center py-1 pl-[10px]">
                  <div className="flex w-[300px]">
                    <h2 className="mr-[10px] select-none">
                      HISTORIAL DE ORDENES
                    </h2>
                  </div>
                </div>
              </>
            ) : null}
            {/* Lista */}
            <div className="w-full h-auto rounded-b-[10px] border-t-[1px] border-t-gray-400">
              {busquedaHecha ? (
                <>
                  <table className="w-full table-auto">
                    <thead className="w-full select-none">
                      <tr>
                        <th className="border-r px-2">N°</th>
                        <th className="border-r px-2">F. Creación</th>
                        <th className="border-r px-2">ID</th>
                        <th className="border-r px-4">Estado</th>
                        <th className="border-r px-4">Equipo</th>
                        <th className="border-r px-2">F. Entrega</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody className="">
                      {lista?.map((orden, index) => {
                        return (
                          <tr key={index} className="h-10 border">
                            <td className="text-center px-2">
                              {(currentPage - 1) * elementosPorPagina +
                                index +
                                1}
                            </td>
                            <td className="text-center px-2">
                              {formatDate(orden?.createdAt)}
                            </td>
                            <td className="text-center px-2">
                              {orden?._id.slice(-6)}
                            </td>
                            <td className="text-center px-2">
                              <span
                                className={`py-1 px-2 rounded-lg text-white ${
                                  orden?.estado === 'finalizada'
                                    ? 'bg-rose-600'
                                    : orden?.estado === 'pendiente'
                                    ? 'bg-[#20b5d3]'
                                    : orden?.estado === 'en progreso'
                                    ? 'bg-[#ff9a00]'
                                    : orden?.estado === 'completada'
                                    ? 'bg-[#008000]'
                                    : null
                                }`}
                              >
                                {orden?.estado === 'finalizada'
                                  ? 'Finalizada'
                                  : orden?.estado === 'pendiente'
                                  ? 'Pendiente'
                                  : orden?.estado === 'en progreso'
                                  ? 'En Progreso'
                                  : orden?.estado === 'completada'
                                  ? 'Completada'
                                  : null}
                              </span>
                            </td>
                            <td className="text-center px-2">{`${orden?.equipo?.categoria} - ${orden?.equipo?.marca} - ${orden?.equipo?.producto}`}</td>
                            <td className="text-center px-2">
                              {formatDate(orden?.fecha)}
                            </td>
                            <td className="text-center px-2">
                              <div className="flex justify-center items-center gap-1">
                                <span
                                  className="border px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-300 cursor-pointer relative flex"
                                  onClick={() => {
                                    navigate(`/ordenes/${orden._id}`);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                    />
                                  </svg>
                                  Ver Orden
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
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

export { ClientHistorial };
