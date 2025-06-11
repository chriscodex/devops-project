import { Modal, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOrden } from '../../../../context/OrdenContext';
import Swal from 'sweetalert2';

function EditPrioridad(props) {
  const { ordenId, prioridadOrden, loadOrden } = props;
  const { prioridades, getPrioridades, updateOrden } = useOrden();
  const [openEditPrioridad, setOpenEditPrioridad] = useState(false);

  const asyncPetitions = async () => {
    await getPrioridades();
  };

  useEffect(() => {
    asyncPetitions();
  }, []);

  const [prioridadSelect, setPrioridadSelect] = useState(prioridadOrden);

  useEffect(() => {
    setPrioridadSelect(prioridadOrden);
  }, [prioridadOrden]);

  const handleSelectPrioridad = (event) => {
    const nuevoValor = event.target.value;
    setPrioridadSelect(nuevoValor);
  };

  const handleOpenEditPrioridad = async () => {
    setOpenEditPrioridad(true);
  };

  const handleCloseEditPrioridad = () => {
    setPrioridadSelect(prioridadOrden);
    setOpenEditPrioridad(false);
  };

  const handleCancelButton = () => {
    setPrioridadSelect(prioridadOrden);
    setOpenEditPrioridad(false);
  };

  const handleSaveButton = async () => {
    try {
      await updateOrden(ordenId, { prioridad: prioridadSelect });
      setOpenEditPrioridad(false);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Prioridad actualizada correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300
      })
      loadOrden();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Tooltip title="Editar" placement="right" disableInteractive>
        <button onClick={handleOpenEditPrioridad} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 ml-2 opacity-50"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </button>
      </Tooltip>
      <Modal open={openEditPrioridad} onClose={handleCloseEditPrioridad}>
        <div className="w-1/3 h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-1 select-none">
          <div className="w-full col-span-2 px-3 border-b border-b-gray-400 flex text-blue-600 justify-center">
            <h1 className="text-2xl my-3 font-bold">Editar Prioridad</h1>
            <span className="flex items-center ml-2">
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
            </span>
          </div>
          <div className="w-full px-4 py-4 flex items-center justify-center bg-white">
            <p>Prioridad</p>
            <div className="flex h-[45px] ml-2">
              <select
                name="prioridad"
                id=""
                value={prioridadSelect}
                onChange={handleSelectPrioridad}
                className="border border-gray-400 rounded-[5px] w-[150px]"
              >
                {prioridades?.map((prioridad) => (
                  <option key={prioridad?._id} value={prioridad?.prioridad}>
                    {prioridad?.prioridad}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-2 p-4 flex justify-end border-t border-t-gray-400">
            {
              <button
                className="bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-white px-2 py-2 rounded-md shadow-md flex mr-4"
                onClick={handleCancelButton}
              >
                <p className="text-black">Cancelar</p>
              </button>
            }
            <button
              className="bg-blue-700 border border-gray-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white px-2 py-2 rounded-md shadow-md flex"
              onClick={handleSaveButton}
            >
              <p className="text-white">Guardar</p>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export { EditPrioridad };
