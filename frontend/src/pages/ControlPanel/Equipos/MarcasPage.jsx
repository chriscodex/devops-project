import { useEffect, useState } from 'react';
import { Sidebar } from '../../../components/common/Sidebar';
import { useOrden } from '../../../context/OrdenContext';
import { CircularProgress, Tooltip } from '@mui/material';
import Swal from 'sweetalert2';
import { AddMarcaModal } from '../../../components/modals/ControlPanel/Marcas/AddMarca';
import { EditMarcaModal } from '../../../components/modals/ControlPanel/Marcas/EditMarca';

function MarcasControl() {
  const { setEquipo, setCliente, getAllMarcas, deleteMarca } =
    useOrden();

  const [nuevaLista, setNuevaLista] = useState([]);

  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await getAllMarcas();
      setLoading(false);
      setNuevaLista(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadItems();
    setEquipo({});
    setCliente({});
  }, []);

  const handleDeleteItem = async (id) => {
    Swal.fire({
      title: '¿Seguro que desea eliminar esta marca?',
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
            await deleteMarca(id);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Marca eliminada correctamente',
              showConfirmButton: false,
              timerProgressBar: true,
              timer: 1300,
            });
            loadItems();
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

  return (
    <div className="w-full h-screen bg-[#efeff4] overflow-hidden">
      <Sidebar />
      <div className="absolute left-[310px] h-auto w-[calc(100%-310px)] flex flex-col">
        <div className="flex flex-col items-center w-full h-full font-normal">
          <h1 className="text-[2rem] mt-[20px] text-center bg-white px-[20px] p-[6px] rounded-[10px] shadow-md mb-2 font-bold text-blue-800 select-none">
            Marcas
          </h1>
          <div className="px-[20px] w-full grid lg:grid-cols-2 md:grid-cols-1 mb-3">
            <div className="ml-1">
              <AddMarcaModal loadItems={loadItems} />
            </div>
          </div>
          <div className="w-[calc(100%-50px)] h-auto bg-white rounded-[10px] shadow-md flex flex-col">
            {/* Heading */}
            <div className="font-bold text-gray-500 flex justify-between items-center py-1 pl-[10px]">
              <div className="flex w-[300px] items-center">
                <h2 className="mr-[10px] select-none">
                  LISTA DE MARCAS
                </h2>
                {loading ? (
                  <div className="flex justify-center items-center bg-white">
                    <CircularProgress size={20} />
                  </div>
                ) : (
                  <Tooltip
                    title="Actualizar"
                    placement="top"
                    disableInteractive
                  >
                    <span onClick={loadItems} className="cursor-pointer">
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
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Lista */}
            <div className="w-full h-auto rounded-b-[10px] border-t-[1px] border-t-gray-400">
              <table className="w-full table-auto">
                <thead className="w-full select-none">
                  <tr>
                    <th className="border-r px-2">N°</th>
                    <th className="border-r px-2">Marcas</th>
                    <th className="border-r px-4"></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="">
                  {nuevaLista?.map((item, index) => {
                    return (
                      <tr key={item?._id} className="h-10 border">
                        <td className="text-center px-2">{index + 1}</td>
                        <td className="text-center px-2">
                          {item?.nombre}
                        </td>
                        <td className="text-center px-2">
                          <div className="flex items-center justify-center gap-2">
                            <EditMarcaModal
                              loadItems={loadItems}
                              itemId={item?._id}
                              itemName={item?.nombre}
                            />
                            <Tooltip
                              title="Eliminar"
                              placement="right"
                              disableInteractive
                            >
                              <span
                                className="border p-1 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-300"
                                onClick={() => handleDeleteItem(item._id)}
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
        </div>
      </div>
    </div>
  );
}

export { MarcasControl };
