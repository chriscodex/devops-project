import { useEffect, useState } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useOrden } from '../../context/OrdenContext';
import { Tooltip } from '@mui/material';
import Swal from 'sweetalert2';
import { generarPdf } from '../../utils/generarPdf';
import { useAuth } from '../../context/AuthContext';
import { ordenarAlfabeticamente } from '../../utils/ordenarOrdenesAlfabeticamente';

function OrdenesPage() {
  const {
    ordenes,
    setOrdenes,
    getOrdenesByEstado,
    getOrdenesNumberByEstado,
    deleteOrden,
    updateOrden,
    currentPageOrdenes,
    setCurrentPageOrdenes,
    setEquipo,
    setCliente,
  } = useOrden();

  const { user } = useAuth();

  const [numberPendientes, setNumberPendientes] = useState(0);
  const [numberEnProgreso, setNumberEnProgreso] = useState(0);
  const [numberCompletadas, setNumberCompletadas] = useState(0);

  const refreshNumbersStateOrders = async () => {
    try {
      const [pendientes, enProgreso, completadas] = await Promise.all([
        getOrdenesNumberByEstado('pendiente'),
        getOrdenesNumberByEstado('en progreso'),
        getOrdenesNumberByEstado('completada'),
      ]);

      setNumberPendientes(pendientes);
      setNumberEnProgreso(enProgreso);
      setNumberCompletadas(completadas);
    } catch (error) {
      console.error('Error al obtener números de órdenes:', error);
    }
  };

  const [primerasOrdenes, setPrimerasOrdenes] = useState([]);

  useEffect(() => {
    const asyncPetitions = async () => {
      const ordenesPendientes = await getOrdenesByEstado('pendiente');
      setPrimerasOrdenes(ordenesPendientes);
    };

    setCurrentPageOrdenes('pendiente');
    asyncPetitions();
    refreshNumbersStateOrders();
    setEquipo({});
    setCliente({});
  }, []);

  const navigate = useNavigate();

  const handlePendienteButton = async () => {
    try {
      const ordenesPendientes = await getOrdenesByEstado('pendiente');
      setCurrentPage(1);
      setPrimerasOrdenes(ordenesPendientes);
      setBuscarInput('');
      setCurrentPageOrdenes('pendiente');
    } catch (error) {
      console.log(error);
    }
  };

  const handleProgressButton = async () => {
    try {
      const ordenesEnProgreso = await getOrdenesByEstado('en progreso');
      setCurrentPage(1);
      setPrimerasOrdenes(ordenesEnProgreso);
      setBuscarInput('');
      setCurrentPageOrdenes('en progreso');
    } catch (error) {
      console.log(error);
    }
  };

  const handleCompletedButton = async () => {
    try {
      const ordenesCompletadas = await getOrdenesByEstado('completada');
      setCurrentPage(1);
      setPrimerasOrdenes(ordenesCompletadas);
      setBuscarInput('');
      setCurrentPageOrdenes('completada');
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteOrden = async (id) => {
    Swal.fire({
      title: '¿Seguro que desea eliminar esta orden?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteOrden(id);
            if (currentPageOrdenes === 'pendiente') {
              getOrdenesByEstado('pendiente');
            }
            if (currentPageOrdenes === 'en progreso') {
              getOrdenesByEstado('en progreso');
            }
            if (currentPageOrdenes === 'completada') {
              getOrdenesByEstado('completada');
            }
            refreshNumbersStateOrders();
          } catch (error) {
            console.log(error);
          }
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleMovePendienteState = async (id) => {
    try {
      await updateOrden(id, { estado: 'pendiente' });
      const ordenesEnProgreso = await getOrdenesByEstado('en progreso');
      setPrimerasOrdenes(ordenesEnProgreso);
      if (buscarInput) {
        const ordenesEnProgresoFiltradas = ordenesEnProgreso.filter((order) => {
          return order.cliente.personaResponsable
            .toLowerCase()
            .includes(buscarInput.toLowerCase());
        });
        setOrdenes(ordenarAlfabeticamente(ordenesEnProgresoFiltradas));
        if (
          currentPage > 1 &&
          ordenesEnProgresoFiltradas.length % recordsPerPage === 0
        ) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        if (
          currentPage > 1 &&
          ordenesEnProgreso.length % recordsPerPage === 0
        ) {
          setCurrentPage(currentPage - 1);
        }
      }
      refreshNumbersStateOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoveEnProgresoState = async (id) => {
    try {
      if (currentPageOrdenes === 'completada') {
        await updateOrden(id, { estado: 'en progreso' });
        const ordenesCompletadas = await getOrdenesByEstado('completada');
        setPrimerasOrdenes(ordenesCompletadas);
        if (buscarInput) {
          const ordenesComplatadasFiltradas = ordenesCompletadas.filter(
            (order) => {
              return order.cliente.personaResponsable
                .toLowerCase()
                .includes(buscarInput.toLowerCase());
            }
          );
          setOrdenes(ordenarAlfabeticamente(ordenesComplatadasFiltradas));
          if (
            currentPage > 1 &&
            ordenesComplatadasFiltradas.length % recordsPerPage === 0
          ) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          if (
            currentPage > 1 &&
            ordenesCompletadas.length % recordsPerPage === 0
          ) {
            setCurrentPage(currentPage - 1);
          }
        }
        refreshNumbersStateOrders();
      }
      if (currentPageOrdenes === 'pendiente') {
        await updateOrden(id, { estado: 'en progreso' });
        const ordenesPendientes = await getOrdenesByEstado('pendiente');
        setPrimerasOrdenes(ordenesPendientes);
        if (buscarInput) {
          const ordenesPendientesFiltradas = ordenesPendientes.filter(
            (order) => {
              return order.cliente.personaResponsable
                .toLowerCase()
                .includes(buscarInput.toLowerCase());
            }
          );
          setOrdenes(ordenarAlfabeticamente(ordenesPendientesFiltradas));
          if (
            currentPage > 1 &&
            ordenesPendientesFiltradas.length % recordsPerPage === 0
          ) {
            setCurrentPage(currentPage - 1);
          }
        } else {
          if (
            currentPage > 1 &&
            ordenesPendientes.length % recordsPerPage === 0
          ) {
            setCurrentPage(currentPage - 1);
          }
        }
        refreshNumbersStateOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMoveCompletadaState = async (id) => {
    try {
      await updateOrden(id, { estado: 'completada' });
      const ordenesEnProgreso = await getOrdenesByEstado('en progreso');
      setPrimerasOrdenes(ordenesEnProgreso);
      if (buscarInput) {
        const ordenesEnProgresoFiltradas = ordenesEnProgreso.filter((order) => {
          return order.cliente.personaResponsable
            .toLowerCase()
            .includes(buscarInput.toLowerCase());
        });
        setOrdenes(ordenarAlfabeticamente(ordenesEnProgresoFiltradas));
        if (
          currentPage > 1 &&
          ordenesEnProgresoFiltradas.length % recordsPerPage === 0
        ) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        if (
          currentPage > 1 &&
          ordenesEnProgreso.length % recordsPerPage === 0
        ) {
          setCurrentPage(currentPage - 1);
        }
      }
      refreshNumbersStateOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRefresh = async () => {
    await getOrdenesByEstado(currentPageOrdenes);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 18;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = ordenes.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(ordenes.length / recordsPerPage);
  const numbers = [...Array(totalPages + 1).keys()].slice(1);

  const previousPage = () => {
    if (lastIndex === records.length) {
      return;
    }
    if (ordenes.length < recordsPerPage) {
      return;
    }
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  };

  const changeCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (lastIndex >= ordenes.length) {
      return;
    }
    if (currentPage !== lastIndex) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [buscarInput, setBuscarInput] = useState('');

  const handleBuscarInput = (event) => {
    const inputValue = event.target.value;
    setBuscarInput(inputValue);

    const filteredOrders = primerasOrdenes?.filter((order) => {
      if (order?.cliente?.tipo === 'empresa') {
        return (
          order?.cliente?.razonSocial
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          order?.cliente?.ruc.includes(inputValue) // Agregamos el filtro por RUC
        );
      }
      if (order?.cliente?.tipo === 'persona') {
        return (
          order?.cliente?.personaResponsable
            .toLowerCase()
            .includes(inputValue.toLowerCase()) ||
          order?.cliente?.dni.includes(inputValue) // Agregamos el filtro por DNI
        );
      }
    });
    setOrdenes(ordenarAlfabeticamente(filteredOrders));
  };

  const getFirstWord = (cadena) => {
    const cadenaSinEspacios = cadena?.trim();

    if (!cadenaSinEspacios) {
      return null;
    }

    const palabras = cadenaSinEspacios.split(/\s+/);

    return palabras[0];
  };

  return (
    <div className="w-full h-screen bg-[#efeff4] relative overflow-x-hidden">
      <Sidebar />

      <div className="absolute left-[310px] h-auto w-[calc(100%-310px)] flex flex-col min-w-[1000px]">
        <div className="flex flex-col items-center w-full h-full font-normal">
          {/* Title */}
          <h1 className="text-[2rem] mt-[20px] text-center bg-white px-[20px] p-[6px] rounded-[10px] shadow-md mb-2 font-bold text-blue-800 select-none">
            Órdenes de Trabajo
          </h1>

          {/* Lista de estado */}
          <ul className="w-[calc(100%-50px)] flex justify-center items-center rounded-md text-[1rem] text-black mt-1">
            <li className="bg-[#20b5d3] text-white font-medium flex rounded-md shadow-lg select-none p-3 mr-10">
              <p className="mr-3">Pendientes: </p>
              <p>{numberPendientes}</p>
            </li>
            <li className="bg-[#ff9a00] text-white font-medium flex rounded-md shadow-lg select-none p-3 mr-10">
              <p className="mr-3">En Progreso: </p>
              <p>{numberEnProgreso}</p>
            </li>
            <li className="bg-[#008000] text-white font-medium flex rounded-md shadow-lg select-none p-3">
              <p className="mr-3">Completadas: </p>
              <p>{numberCompletadas}</p>
            </li>
          </ul>

          {/* Button crear */}
          <div className="w-full h-full flex justify-start ml-[50px] mb-3">
            {user.rol === 'tecnico' ? (
              <button
                onClick={() => navigate('/nueva-orden')}
                className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md shadow-md flex"
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
                <p className="text-white ml-[10px]">Nueva Orden</p>
              </button>
            ) : null}
          </div>

          {/* Estados */}
          <div className="w-[calc(100%-50px)] h-10 rounded-[10px] shadow-md mb-3 flex items-center justify-between font-normal">
            <div
              className={`w-[33%] h-full items-center flex justify-center border-gray-400 border rounded-l-[10px] cursor-pointer ${
                currentPageOrdenes === 'pendiente'
                  ? 'bg-[#20b5d3] text-white font-medium'
                  : 'bg-gray-300 '
              }`}
              onClick={handlePendienteButton}
            >
              Pendientes
            </div>
            <div
              className={`w-[34%] h-full items-center flex justify-center border-y-[1px] border-y-gray-400 cursor-pointer ${
                currentPageOrdenes === 'en progreso'
                  ? 'bg-[#ff9a00] text-white font-medium'
                  : 'bg-gray-300 '
              }`}
              onClick={handleProgressButton}
            >
              En Progreso
            </div>
            <div
              className={`w-[33%] h-full items-center flex justify-center border-gray-400 border rounded-r-[10px] cursor-pointer ${
                currentPageOrdenes === 'completada'
                  ? 'bg-[#008000] text-white font-medium'
                  : 'bg-gray-300 '
              }`}
              onClick={handleCompletedButton}
            >
              Completadas
            </div>
          </div>

          {/* Lista de Ordenes */}
          <div className="w-[calc(100%-50px)] h-auto bg-white rounded-[10px] shadow-md flex flex-col">
            {/* Heading */}
            <div className="font-bold text-gray-500 flex justify-between items-center py-1 pl-[10px]">
              <div className="flex w-[300px]">
                <h2 className="mr-[10px] select-none">LISTA DE ÓRDENES</h2>
                <span onClick={handleRefresh} className="cursor-pointer">
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
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </span>
              </div>
              <div className="flex">
                <input
                  type="text"
                  autoComplete="off"
                  value={buscarInput}
                  onChange={handleBuscarInput}
                  className="w-[300px] h-[20px] border-gray-300 border-[1px] py-[15px] px-[10px] mr-[10px] rounded-md"
                  placeholder="Buscar por Nombre, DNI o RUC"
                />
              </div>
            </div>

            {/* Lista */}
            <div className="w-full h-[750px] rounded-b-[10px] border-t-[1px] border-t-gray-400">
              <table className="w-full table-auto">
                <thead className="w-full select-none">
                  <tr>
                    <th className="border-r px-2">N°</th>
                    <th className="border-r px-2">ID</th>
                    <th className="border-r px-2">Prioridad</th>
                    <th className="border-r px-2">Equipo</th>
                    <th className="border-r px-2">Cliente</th>
                    <th className="border-r px-2">Responsable</th>
                    <th className="px-2">Precio</th>
                    <th className="px-2"> </th>
                  </tr>
                </thead>
                <tbody className="">
                  {records?.map((item, index) => {
                    return (
                      <tr key={item?._id} className="h-10 border">
                        <td className="text-center px-2">
                          {(currentPage - 1) * recordsPerPage + index + 1}
                        </td>
                        <td className="text-center px-2">
                          {item._id?.slice(-6)}
                        </td>
                        <td className={`text-center`}>
                          <span
                            className={
                              item?.prioridad === 'Alta'
                                ? 'bg-red-500 text-white px-2 py-1 rounded-lg'
                                : ''
                            }
                          >
                            {item?.prioridad}
                          </span>
                        </td>
                        <td className="text-center">
                          {item?.equipo?.categoria}
                        </td>
                        <td className="text-center">
                          {item?.cliente?.tipo === 'persona'
                            ? item?.cliente?.personaResponsable
                            : item?.cliente?.razonSocial}
                        </td>
                        <td className="text-center">{`${getFirstWord(
                          item?.user?.nombres
                        )} ${getFirstWord(item?.user?.apellidos)}`}</td>
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
                              title="Detalle de la orden"
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
                                onClick={() => generarPdf(item)}
                                className="border p-1 rounded-lg bg-gray-100 hover:bg-gray-300 cursor-pointer"
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
                            {(currentPageOrdenes === 'en progreso' ||
                              currentPageOrdenes === 'completada') && (
                              <Tooltip
                                title="Mover al estado anterior"
                                placement="right"
                                disableInteractive
                              >
                                <span
                                  className="border p-1 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-300"
                                  onClick={
                                    currentPageOrdenes === 'en progreso'
                                      ? () => handleMovePendienteState(item._id)
                                      : currentPageOrdenes === 'completada'
                                      ? () =>
                                          handleMoveEnProgresoState(item._id)
                                      : null
                                  }
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
                                      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                                    />
                                  </svg>
                                </span>
                              </Tooltip>
                            )}
                            {/* Adelante button */}
                            {(currentPageOrdenes === 'en progreso' ||
                              currentPageOrdenes === 'pendiente') && (
                              <Tooltip
                                title="Mover al siguiente estado"
                                placement="right"
                                disableInteractive
                              >
                                <span
                                  className="border p-1 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-300"
                                  onClick={
                                    currentPageOrdenes === 'pendiente'
                                      ? () =>
                                          handleMoveEnProgresoState(item._id)
                                      : currentPageOrdenes === 'en progreso'
                                      ? () =>
                                          handleMoveCompletadaState(item._id)
                                      : null
                                  }
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
                                      d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
                                    />
                                  </svg>
                                </span>
                              </Tooltip>
                            )}
                            <Tooltip
                              title="Eliminar"
                              placement="right"
                              disableInteractive
                            >
                              <span
                                className="border p-1 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-300"
                                onClick={() => handleDeleteOrden(item._id)}
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
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
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
              {numbers.map((item, index) => (
                <li
                  key={index}
                  onClick={() => changeCurrentPage(item)}
                  className={`border h-10 w-10 flex justify-center items-center cursor-pointer ${
                    currentPage === item
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-black'
                  }`}
                >
                  <a href="#">{item}</a>
                </li>
              ))}
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

export { OrdenesPage };
