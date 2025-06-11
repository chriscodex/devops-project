import { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { Sidebar } from '../../components/common/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EditTecnico } from '../../components/modals/TecnicosModal/EditTecnico';
import Swal from 'sweetalert2';

function ListaTecnicosPage() {
  const { getUsers, deleteUser } = useAuth();

  const navigate = useNavigate();

  const [lista, setLista] = useState([]);

  const loadLista = async () => {
    try {
      const res = await getUsers();
      setLista(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadLista();
  }, []);

  const handleAlertaEdit = () => {
    Swal.fire({
      icon: 'success',
      title: 'Datos actualizados correctamente',
    });
  };

  const handleAlertaDelete = () => {
    Swal.fire({
      icon: 'success',
      title: 'Tecnico eliminado correctamente',
    });
  };

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: '¿Seguro que desea eliminar al técnico?',
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
            await deleteUser(id);
            const res = await getUsers();
            handleAlertaDelete();
            setLista(res);
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
    <div className="w-full h-auto bg-[#efeff4] overflow-hidden">
      <Sidebar />
      <div className="absolute left-[310px] h-auto w-[calc(100%-310px)] flex flex-col">
        <div className="flex flex-col items-center w-full h-full font-normal">
          <h1 className="text-[2rem] mt-[20px] text-center bg-white px-[20px] p-[6px] rounded-[10px] shadow-md mb-2 font-bold text-blue-800 select-none">
            Técnicos
          </h1>
          <div className="w-auto h-full mb-3 self-start ml-6">
            <button
              onClick={() => navigate('/registrar')}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md shadow-md flex"
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
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                />
              </svg>
              <p className="text-white ml-[10px]">Registrar Técnico</p>
            </button>
          </div>
          <div className="w-[calc(100%-50px)] h-auto bg-white rounded-[10px] shadow-md flex flex-col">
            {/* Heading */}
            <div className="font-bold text-gray-500 flex justify-between items-center py-1 pl-[10px]">
              <div className="flex w-[300px]">
                <h2 className="mr-[10px] select-none">LISTA DE TÉCNICOS</h2>
              </div>
            </div>

            {/* Lista */}
            <div className="w-full h-auto rounded-b-[10px] border-t-[1px] border-t-gray-400">
              <table className="w-full table-auto">
                <thead className="w-full select-none">
                  <tr>
                    <th className="border-r px-2">N°</th>
                    <th className="border-r px-2">Apellidos y Nombres</th>
                    <th className="border-r px-2">DNI</th>
                    <th className="border-r px-2">Celular</th>
                    <th className="px-2"> </th>
                  </tr>
                </thead>
                <tbody className="">
                  {lista?.map((item, index) => {
                    return (
                      <tr key={index} className="h-10 border">
                        <td className="text-center px-2">{index + 1}</td>
                        <td className="text-center px-2">
                          {`${item?.apellidos} ${item?.nombres}`}
                        </td>
                        <td className={`text-center`}>{item?.username}</td>
                        <td className="text-center">{item?.celular}</td>
                        <td className="text-center px-2">
                          <div className="flex justify-center items-center gap-2">
                            <EditTecnico
                              tecnicoId={item?._id}
                              tecnicoUsername={item?.username}
                              tecnicoApellidos={item?.apellidos}
                              tecnicoNombres={item?.nombres}
                              tecnicoCelular={item?.celular}
                              tecnicoEmail={item?.email}
                              tecnicoDireccion={item?.direccion}
                              loadLista={loadLista}
                              handleAlertaEdit={handleAlertaEdit}
                              handleAlertaDelete={handleAlertaDelete}
                            />

                            <Tooltip
                              title="Eliminar"
                              placement="right"
                              disableInteractive
                            >
                              <span
                                onClick={() => handleDeleteUser(item?._id)}
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

export { ListaTecnicosPage };
