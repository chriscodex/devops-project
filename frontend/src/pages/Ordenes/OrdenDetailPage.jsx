import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Sidebar } from '../../components/common/Sidebar';
import { useOrden } from '../../context/OrdenContext';
import { AddServicioAdicional } from '../../components/modals/OrderDetail/AddServicioAdicional';
import { EditServicioAdicional } from '../../components/modals/OrderDetail/EditServicioAdicional';
import { EditPrioridad } from '../../components/modals/OrderDetail/Modificar/EditPrioridad';
import { EditArea } from '../../components/modals/OrderDetail/Modificar/EditArea';
import { EditTipoServicio } from '../../components/modals/OrderDetail/Modificar/EditTipoServicio';
import { EditTrabajo } from '../../components/modals/OrderDetail/Modificar/EditTrabajo';
import { EditCliente } from '../../components/modals/OrderDetail/Modificar/EditCliente';
import { EditEquipo } from '../../components/modals/OrderDetail/Modificar/EditEquipo';
import { EditMonto } from '../../components/modals/OrderDetail/Modificar/EditMonto';
import { EditFecha } from '../../components/modals/OrderDetail/Modificar/EditFecha';
import { Tooltip } from '@mui/material';
import { EditTecnicoAsignado } from '../../components/modals/OrderDetail/Modificar/EditTecnicoAsignado';
import { generarPdf } from '../../utils/generarPdf';

function OrdenDetailPage() {
  const {
    getOrdenData,
    deleteServicioAdicional,
    getServiciosAdicionalesByOrdenId,
    getTotalServiciosAdicionalesByOrdenId,
    getAllMarcas,
    getAllCategoriasEquipo,
    updateOrden,
    deleteOrden,
  } = useOrden();

  const navigate = useNavigate();
  const params = useParams();
  const [orderDetail, setOrderDetail] = useState({});

  const [serviciosAdicionales, setServiciosAdicionales] = useState([]);

  async function loadServiciosAdicionales() {
    try {
      const response = await getServiciosAdicionalesByOrdenId(params.id);
      setServiciosAdicionales(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadOrden() {
    try {
      if (params.id) {
        const order = await getOrdenData(params.id);
        if (!order) {
          navigate('/ordenes');
        } else {
          setOrderDetail(order);
          setEstadoOrden(order?.estado);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadOrden();
    loadServiciosAdicionales();
    getAllMarcas();
    getAllCategoriasEquipo();
  }, []);

  const [estadoOrden, setEstadoOrden] = useState(orderDetail?.estado);
  const handleSelectEstado = async (event) => {
    try {
      const nuevoValor = event.target.value;
      await updateOrden(params.id, { estado: nuevoValor });
      loadOrden();
      setEstadoOrden(nuevoValor);
    } catch (error) {
      console.log(error);
    }
  };

  const [
    costoTotalServiciosAdicionalesValue,
    setCostoTotalServiciosAdicionalesValue,
  ] = useState(0);

  const handleDeleteServicioAdicional = async (servicioId) => {
    try {
      await deleteServicioAdicional(servicioId);
      const response = await getServiciosAdicionalesByOrdenId(params.id);
      setServiciosAdicionales(response);

      const responseTotal = await getTotalServiciosAdicionalesByOrdenId(
        params.id
      );
      await updateOrden(params.id, {
        montoAdicional: responseTotal.costoTotal,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const sumaAdicionales = serviciosAdicionales.reduce(
      (acumulador, objeto) => {
        return acumulador + parseFloat(objeto.costo);
      },
      0
    );

    setCostoTotalServiciosAdicionalesValue(sumaAdicionales);
  }, [serviciosAdicionales]);

  const handleFinalizarOrden = async () => {
    Swal.fire({
      title: '¿Seguro que desea finalizar la orden?',
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
          await updateOrden(params.id, {
            estado: 'finalizada',
            finalizada: true,
          });
          loadOrden();
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteOrden = async () => {
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
            await deleteOrden(orderDetail?._id);
            navigate('/ordenes');
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

  const handleGenerarPdf = (ordenData) => {
    const doc = new jsPDF();

    // Header Empresa
    doc.addImage('/perfil/netcomputerBanner.jpg', 5, 9, 138, 20);
    const rowsOrden = [
      [
        {
          content: `FICHA DE LA EMPRESA`,
          styles: {
            fontStyle: 'bold',
            fontSize: 8,
          },
        },
      ],
      [
        {
          content: `FECHA DE IMPRESIÓN ${new Date().toLocaleDateString()}`,
          styles: {
            fontSize: 8,
          },
        },
      ],
      [
        {
          content: `ORDEN N° ${ordenData?._id?.slice(-6)}`,
          styles: {
            fontStyle: 'bold',
            fontSize: 12,
          },
        },
      ],
      [
        {
          content: `Soporte@netcomputer.com.pe`,
          styles: {
            fontStyle: 'normal',
            fontSize: 8,
          },
        },
      ],
    ];
    doc.autoTable({
      theme: 'plain',
      startY: 5,
      margin: {
        left: 150,
      },
      tableWidth: 'wrap',
      body: rowsOrden,
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
    });

    const columnsClient = [
      {
        content: `Datos del Cliente`,
        styles: {
          fontStyle: 'bold',
          fillColor: [209, 213, 219],
        },
      },
      {
        content: `Datos del Equipo`,
        styles: {
          fontStyle: 'bold',
          fillColor: [209, 213, 219],
          lineWidth: {
            left: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ];
    let rowsClient = [];
    if (ordenData?.cliente?.tipo === 'persona') {
      rowsClient = [
        [
          `Apellidos y Nombres: ${ordenData?.cliente?.personaResponsable}`,
          {
            content: `Marca: ${ordenData?.equipo?.marca}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          `DNI: ${ordenData?.cliente?.dni}`,
          {
            content: `Categoría: ${ordenData?.equipo?.categoria}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          `Celular: ${ordenData?.cliente?.celular}`,
          {
            content: `Accesorios: ${ordenData?.equipo?.accesorios}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];
    }
    if (ordenData?.cliente?.tipo === 'empresa') {
      rowsClient = [
        [
          `RUC: ${ordenData?.cliente?.ruc}`,
          {
            content: `Marca: ${ordenData?.equipo?.marca}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          `Razon Social: ${ordenData?.cliente?.razonSocial}`,
          {
            content: `Categoría: ${ordenData?.equipo?.categoria}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          `Persona Responsable: ${ordenData?.cliente?.personaResponsable}`,
          {
            content: `Accesorios: ${ordenData?.equipo?.accesorios}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];
    }
    const rowTecnico = [
      [
        {
          content: `Tecnico:`,
          styles: {
            fontStyle: 'bold',
            fillColor: [209, 213, 219],
            lineWidth: {
              top: 0.1,
              right: 0.1,
            },
            lineColor: [0, 0, 0],
            cellWidth: 110,
          },
        },
        {
          content: `${ordenData?.user?.nombres} ${ordenData?.user?.apellidos}`,
          styles: {
            fontStyle: 'normal',
            lineWidth: {
              top: 0.1,
            },
            lineColor: [0, 0, 0],
          },
        },
      ],
    ];
    rowsClient.push(...rowTecnico);
    if (serviciosAdicionales.length === 0) {
      const newData = [
        [
          {
            content: `Servicio: ${ordenData?.tipoServicio}`,
            colSpan: 2,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: `${ordenData?.trabajo}`,
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              lineWidth: {
                bottom: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: `Costo Total:`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `S/. ${Number(ordenData?.monto).toFixed(2)}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];
      rowsClient.push(...newData);
    } else {
      const newData = [
        [
          {
            content: `Servicio: ${ordenData?.tipoServicio}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `S/. ${Number(ordenData?.monto).toFixed(2)}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: `${ordenData?.trabajo}`,
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              lineWidth: {
                bottom: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: `Servicios Adicionales`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `S/. ${Number(costoTotalServiciosAdicionalesValue).toFixed(
              2
            )}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];
      serviciosAdicionales?.forEach((servicio) => {
        newData?.push([
          `${servicio?.descripcion}`,
          `S/. ${Number(servicio?.costo).toFixed(2)}`,
        ]);
      });
      rowsClient.push(...newData);
      rowsClient?.push([
        {
          content: `Costo Total:`,
          styles: {
            fontStyle: 'bold',
            fillColor: [209, 213, 219],
            lineWidth: {
              top: 0.1,
              bottom: 0.1,
            },
            lineColor: [0, 0, 0],
          },
        },
        {
          content: `S/. ${Number(
            Number(ordenData?.monto) +
              Number(costoTotalServiciosAdicionalesValue)
          ).toFixed(2)}`,
          styles: {
            fontStyle: 'bold',
            fillColor: [209, 213, 219],
            lineWidth: {
              top: 0.1,
              bottom: 0.1,
            },
            lineColor: [0, 0, 0],
          },
        },
      ]);
    }

    doc.autoTable({
      startY: 35,
      margin: 5,
      head: [columnsClient],
      body: rowsClient,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellBorder: 'none',
        tableLineWidth: 1,
        tableLineColor: [0, 0, 0],
      },
      tableLineWidth: 0.1,
      tableLineColor: [0, 0, 0],
    });

    const centerY = doc.internal.pageSize.height / 2;

    // Firma
    doc.autoTable({
      startY: centerY - 8,
      margin: {
        left: 120,
      },
      body: [[`Firma de entregado, ${ordenData?.cliente?.personaResponsable}`]],
      theme: 'plain',
      columnStyles: {
        0: {
          lineWidth: {
            top: 0.1,
          },
          lineColor: [0, 0, 0],
          halign: 'center', // Alineación horizontal
          valign: 'middle',
        },
      },
      styles: {
        fontSize: 8,
        cellBorder: 'none',
      },
      tableWidth: 'wrap',
    });

    doc.setLineDash([2, 2]); // [longitud del segmento, longitud del espacio]

    // Dibujar una línea horizontal que atraviese el centro del documento
    const lineWidth = doc.internal.pageSize.width - 15; // Ancho del documento con un margen de 10 unidades a cada lado

    doc.line(5, centerY, 10 + lineWidth, centerY);

    // Restablecer el estilo de la línea a sólido para las líneas subsiguientes
    doc.setLineDash([]);

    // Header Empresa
    doc.addImage('/perfil/netcomputerBanner.jpg', 5, centerY + 9, 138, 20);
    (rowsOrden[0] = [
      {
        content: `FICHA DEL CLIENTE`,
        styles: {
          fontStyle: 'bold',
          fontSize: 8,
        },
      },
    ]),
      doc.autoTable({
        theme: 'plain',
        startY: centerY + 5,
        margin: {
          left: 145,
        },
        tableWidth: 'wrap',
        body: rowsOrden,
        styles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
      });

    doc.autoTable({
      startY: centerY + 35,
      margin: 5,
      head: [columnsClient],
      body: rowsClient,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellBorder: 'none',
        tableLineWidth: 1,
        tableLineColor: [0, 0, 0],
      },
      tableLineWidth: 0.1,
      tableLineColor: [0, 0, 0],
    });

    // Generar un Blob con el contenido del PDF
    const blob = doc.output('blob');

    // Crear una URL para el Blob
    const url = URL.createObjectURL(blob);

    // Abrir una nueva ventana con la vista previa del PDF
    const nuevaVentana = window.open(url, '_blank');
    nuevaVentana.name = 'orden';

    // Asegurarse de cerrar la URL cuando la ventana se cierre
    nuevaVentana.addEventListener('beforeunload', () => {
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="bg-zinc-800 w-full h-full">
      <Sidebar />
      <div className="w-[calc(100%-320px)] h-full absolute left-[320px] bg-[#ECECF1]">
        <header className="w-full flex justify-center items-center mt-3">
          <h1 className="w-[400px] text-[2rem] my-2 text-center bg-white px-[20px] p-[6px] rounded-[10px] shadow-md font-bold text-blue-800 select-none">
            Detalle de la Orden
          </h1>
        </header>
        <div className="flex justify-between">
          <p
            className={`text-white ${
              estadoOrden === 'pendiente'
                ? 'bg-[#20b5d3]'
                : estadoOrden === 'en progreso'
                ? 'bg-[#ff9a00]'
                : estadoOrden === 'completada'
                ? 'bg-[#008000]'
                : estadoOrden === 'finalizada'
                ? 'bg-rose-600'
                : 'bg-[#ecba09]'
            } shadow-md font-semibold rounded-lg py-1 px-2 ml-3 `}
          >
            Estado:{' '}
            <span className="font-medium">
              {estadoOrden === 'pendiente'
                ? 'Pendiente'
                : estadoOrden === 'en progreso'
                ? 'En Progreso'
                : estadoOrden === 'completada'
                ? 'Completada'
                : estadoOrden === 'finalizada'
                ? 'Finalizada'
                : 'Cargando ...'}
            </span>
          </p>
          <ul className="flex justify-end pr-3 gap-5">
            {!orderDetail?.finalizada && (
              <li>
                <button
                  onClick={handleDeleteOrden}
                  className="flex bg-white hover:bg-gray-300 shadow-md font-medium rounded-lg py-1 px-2"
                >
                  Eliminar
                  <span className="ml-1">
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
                </button>
              </li>
            )}

            <li>
              <button
                onClick={() => generarPdf(orderDetail)}
                className="flex bg-white hover:bg-gray-300 shadow-md font-medium rounded-lg py-1 px-2"
              >
                Imprimir
                <span className="ml-1">
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
              </button>
            </li>
            {!orderDetail?.finalizada && (
              <li className="flex bg-white hover:bg-gray-30 ring-0 focus:ring-4 focus:ring-gray-500 shadow-md font-medium rounded-lg py-1 px-2 select-none">
                <p>Cambiar Estado</p>
                <select
                  name="estadoOrden"
                  id="ordenEstado"
                  value={estadoOrden}
                  onChange={handleSelectEstado}
                  className="ml-2 border border-gray-400 rounded-lg cursor-pointer"
                >
                  {estadoOrden === 'pendiente' ? (
                    <>
                      <option value="en progreso">Pendiente</option>
                      <option value="en progreso">En Progreso</option>
                      <option value="completada">Completada</option>
                    </>
                  ) : estadoOrden === 'en progreso' ? (
                    <>
                      <option value="pendiente">En Progreso</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="completada">Completada</option>
                    </>
                  ) : (
                    <>
                      <option value="completada">Completada</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="en progreso">En Progreso</option>
                    </>
                  )}
                </select>
              </li>
            )}

            {
              <li>
                <button
                  onClick={
                    estadoOrden === 'completada' ? handleFinalizarOrden : null
                  }
                  className={`flex bg-rose-600 text-white hover:bg-rose-700 shadow-md font-medium rounded-lg py-1 px-2 select-none ${
                    estadoOrden === 'completada'
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                >
                  Finalizar Orden
                  <span className="ml-1">
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
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </span>
                </button>
              </li>
            }
          </ul>
        </div>
        <main className="w-full grid lg:grid-cols-2 md:grid-cols-1">
          <div className="flex flex-col p-3">
            <div className="border rounded-lg shadow-lg bg-white p-3">
              <h1 className="border-b border-b-gray-400 pb-3 font-semibold flex items-center justify-between">
                <span className="select-none">CLIENTE</span>
                {orderDetail?.prioridad && (
                  <>
                    {!orderDetail?.finalizada && (
                      <EditCliente
                        clientId={orderDetail?.cliente?._id}
                        tipoClient={orderDetail?.cliente?.tipo}
                        dniClient={orderDetail?.cliente?.dni}
                        nombreClient={orderDetail?.cliente?.personaResponsable}
                        celularClient={orderDetail?.cliente?.celular}
                        emailClient={orderDetail?.cliente?.email}
                        ordenId={orderDetail?._id}
                        rucClient={orderDetail?.cliente?.ruc}
                        razonSocialClient={orderDetail?.cliente?.razonSocial}
                        loadOrden={loadOrden}
                      />
                    )}
                  </>
                )}
              </h1>
              <div className="">
                {orderDetail?.cliente?.tipo === 'empresa' ? (
                  <>
                    <div className="flex items-center border-b py-2">
                      <p className="font-medium mr-2">Razon Social: </p>
                      {orderDetail?.cliente?.razonSocial}
                    </div>
                    <div className="flex items-center border-b py-2">
                      <p className="font-medium mr-2">RUC: </p>
                      {orderDetail?.cliente?.ruc}
                    </div>
                  </>
                ) : null}
                <div className="flex items-center border-b py-2">
                  <span className="font-medium mr-2">
                    {orderDetail?.cliente?.tipo === 'persona'
                      ? 'Cliente: '
                      : 'Persona Responsable: '}
                  </span>
                  <span>{orderDetail?.cliente?.personaResponsable}</span>
                </div>
                {orderDetail?.cliente?.tipo === 'persona' ? (
                  <>
                    <div className="flex items-center border-b py-2">
                      <p className="font-medium mr-2">DNI: </p>
                      {orderDetail?.cliente?.dni}
                    </div>
                  </>
                ) : null}
                <div className="flex items-center border-b py-2">
                  <p className="font-medium mr-2">Celular: </p>
                  {orderDetail?.cliente?.celular}
                </div>
                <div className="flex items-center py-2">
                  <p className="font-medium mr-2">Email: </p>
                  {orderDetail?.cliente?.email}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-3">
            <div className="border rounded-lg shadow-lg bg-white p-3">
              <h1 className="border-b border-b-gray-400 pb-3 font-semibold flex justify-between items-center">
                <span className="select-none">EQUIPO</span>
                {orderDetail?.prioridad && (
                  <>
                    {!orderDetail.finalizada && (
                      <EditEquipo
                        ordenId={orderDetail?._id}
                        loadOrden={loadOrden}
                        marcaOrden={orderDetail?.equipo?.marca}
                        categoriaOrden={orderDetail?.equipo?.categoria}
                        productoNameOrden={orderDetail?.equipo?.producto}
                        serieOrden={orderDetail?.equipo?.serie}
                        accesoriosOrden={orderDetail?.equipo?.accesorios}
                        observacionesOrden={orderDetail?.equipo?.observaciones}
                      />
                    )}
                  </>
                )}
              </h1>
              <div className="grid grid-cols-2">
                <h2 className="flex items-center py-2">
                  <p className="font-medium mr-2">Marca: </p>
                  {orderDetail?.equipo?.marca}
                </h2>
                <h2 className="flex items-center py-2">
                  <p className="font-medium mr-2">Categoría: </p>
                  {orderDetail?.equipo?.categoria}
                </h2>
                <h2 className="flex items-center py-2">
                  <p className="font-medium mr-2">Producto: </p>
                  {orderDetail?.equipo?.producto}
                </h2>
                <h2 className="flex items-center py-2">
                  <p className="font-medium mr-2">Serie: </p>
                  {orderDetail?.equipo?.serie}
                </h2>
                <h2 className="col-span-2 flex items-center py-2">
                  <p className="font-medium mr-2">Accesorios: </p>
                  {orderDetail?.equipo?.accesorios}
                </h2>
                <h2 className="col-span-2 flex items-center py-2">
                  <p className="font-medium mr-2">Observaciones:</p>{' '}
                  {orderDetail?.equipo?.observaciones}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-3">
            <div className="border rounded-lg shadow-lg bg-white p-3">
              <h1 className="border-b border-b-gray-400 pb-3 font-semibold">
                <span className="select-none">ORDEN</span>
              </h1>
              <div className="flex flex-col gap-1">
                <div className="border-b py-2 flex">
                  <p className="font-medium mr-2">Identificador:</p>
                  {orderDetail?._id?.slice(-6)}
                </div>
                <div className="flex items-center border-b py-2">
                  <p className="font-medium mr-1">Fecha de Creación:</p>
                  <span className="ml-1">
                    {orderDetail?.createdAt &&
                      new Date(orderDetail?.createdAt).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        timeZone: 'UTC',
                      })}
                  </span>
                </div>
                <div className="flex items-center border-b py-2">
                  <p className="font-medium mr-2">Prioridad:</p>
                  {orderDetail?.prioridad && (
                    <>
                      {orderDetail?.prioridad}
                      {!orderDetail.finalizada && (
                        <EditPrioridad
                          ordenId={orderDetail?._id}
                          prioridadOrden={orderDetail?.prioridad}
                          loadOrden={loadOrden}
                        />
                      )}
                    </>
                  )}
                </div>
                <h2 className="flex items-center border-b py-2">
                  <p className="font-medium mr-2">Área:</p>
                  {orderDetail?.area && (
                    <>
                      {orderDetail?.area}
                      {!orderDetail.finalizada && (
                        <EditArea
                          ordenId={orderDetail?._id}
                          areaOrden={orderDetail?.area}
                          loadOrden={loadOrden}
                        />
                      )}
                    </>
                  )}
                </h2>
                <h2 className="flex items-center border-b py-2">
                  <p className="font-medium mr-2">Tipo de Servicio:</p>
                  {orderDetail?.tipoServicio && (
                    <>
                      {orderDetail?.tipoServicio}
                      {!orderDetail.finalizada && (
                        <EditTipoServicio
                          ordenId={orderDetail?._id}
                          tipoServicioOrden={orderDetail?.tipoServicio}
                          loadOrden={loadOrden}
                        />
                      )}
                    </>
                  )}
                </h2>
                <h2 className="flex items-center border-b py-2">
                  <p className="font-medium mr-2">Servicio:</p>
                  {orderDetail?.trabajo && (
                    <>
                      {orderDetail?.trabajo}
                      {!orderDetail.finalizada && (
                        <EditTrabajo
                          ordenId={orderDetail?._id}
                          trabajoOrden={orderDetail?.trabajo}
                          loadOrden={loadOrden}
                        />
                      )}
                    </>
                  )}
                </h2>
                <h2 className="flex items-center border-b py-2">
                  <p className="font-medium mr-2">Fecha de Entrega:</p>
                  {orderDetail?.fecha && (
                    <>
                      <span className="ml-1">
                        {new Date(orderDetail?.fecha).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          timeZone: 'UTC',
                        })}
                      </span>
                      {!orderDetail.finalizada && (
                        <EditFecha
                          ordenId={orderDetail?._id}
                          loadOrden={loadOrden}
                          fechaEntrega={orderDetail?.fecha}
                        />
                      )}
                    </>
                  )}
                </h2>

                <h2 className="flex items-center py-2">
                  <p className="font-medium mr-2">Técnico Asignado:</p>
                  {orderDetail?.user?.nombres && (
                    <>
                      {`${orderDetail?.user?.nombres} ${orderDetail?.user?.apellidos}`}
                      {!orderDetail.finalizada && (
                        <EditTecnicoAsignado
                          ordenId={orderDetail?._id}
                          tecnicoOrden={orderDetail?.user?._id}
                          loadOrden={loadOrden}
                        />
                      )}
                    </>
                  )}
                </h2>
              </div>
            </div>
          </div>
          <div className="flex flex-col p-3">
            <div className="border rounded-lg shadow-lg bg-white p-3">
              <h1 className="border-b border-b-gray-400 pb-3 font-semibold">
                <span className="select-none">COSTOS</span>
              </h1>
              <div className="flex flex-col border-b border-b-gray-300">
                <h2 className="grid grid-cols-2 py-2 border-b">
                  <span className="font-medium">Monto Inicial:</span>{' '}
                  <span className="flex items-center">
                    {orderDetail?.monto && (
                      <>
                        <span>S/. {Number(orderDetail?.monto).toFixed(2)}</span>
                        <span>
                          {!orderDetail?.finalizada && (
                            <EditMonto
                              ordenId={orderDetail?._id}
                              loadOrden={loadOrden}
                              montoOrden={orderDetail?.monto}
                            />
                          )}
                        </span>
                      </>
                    )}
                  </span>
                </h2>
                <h2 className="grid grid-cols-2 py-2">
                  <span className="font-medium">Servicios Adicionales:</span>{' '}
                  <span>
                    S/. {Number(costoTotalServiciosAdicionalesValue).toFixed(2)}
                  </span>
                </h2>
              </div>
              <h2 className="grid grid-cols-2 py-2">
                <span className="font-medium">Total:</span>{' '}
                <span className="font-medium">
                  S/.{' '}
                  {Number(
                    Number(orderDetail?.monto) +
                      Number(costoTotalServiciosAdicionalesValue)
                  ).toFixed(2)}
                </span>
              </h2>
            </div>
          </div>
          <div className="col-span-2 flex flex-col p-3">
            <div className="border rounded-lg shadow-lg bg-white p-3">
              <div className="flex justify-between border-b border-b-gray-400 pb-3 items-center">
                <h2 className="font-semibold select-none">
                  SERVICIOS ADICIONALES
                </h2>
                {!orderDetail?.finalizada && (
                  <AddServicioAdicional
                    ordenId={orderDetail?._id}
                    serviciosAdicionales={serviciosAdicionales}
                    setServiciosAdicionales={setServiciosAdicionales}
                    loadOrden={loadOrden}
                  />
                )}
              </div>
              <div className="flex flex-col">
                {serviciosAdicionales?.length > 0 ? (
                  <table>
                    <thead>
                      <tr className="border-b border-b-gray-300">
                        <th className="py-3">Descripción</th>
                        <th className="text-start font-semibold">Costo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviciosAdicionales?.map((servicioAdicional, index) => {
                        return (
                          <tr key={index} className="">
                            <td className="py-3">
                              {servicioAdicional?.descripcion}
                            </td>
                            <td className="text-start">
                              S/. {Number(servicioAdicional?.costo).toFixed(2)}
                            </td>
                            <td>
                              {!orderDetail?.finalizada && (
                                <div className="flex justify-end">
                                  <EditServicioAdicional
                                    ordenId={orderDetail?._id}
                                    servicioAdicionalId={servicioAdicional?._id}
                                    descripcionServicio={
                                      servicioAdicional?.descripcion
                                    }
                                    costoServicio={servicioAdicional?.costo}
                                    loadServiciosAdicionales={
                                      loadServiciosAdicionales
                                    }
                                  />
                                  <Tooltip
                                    title="Eliminar"
                                    placement="left"
                                    disableInteractive
                                  >
                                    <span
                                      onClick={() =>
                                        handleDeleteServicioAdicional(
                                          servicioAdicional?._id
                                        )
                                      }
                                      className="border p-1 rounded-lg bg-gray-100 hover:bg-gray-300 cursor-pointer ml-2"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
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
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      <tr className="border-t border-t-gray-300 font-medium">
                        <td className="text-center">Costo Total: </td>
                        <td>
                          S/.{' '}
                          {Number(costoTotalServiciosAdicionalesValue)?.toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <h2 className="py-2 text-gray-600 select-none">
                    No hay Servicios Adicionales
                  </h2>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export { OrdenDetailPage };
