import { Modal, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOrden } from '../../../../context/OrdenContext';
import Swal from 'sweetalert2';

function EditMonto(props) {
  const { ordenId, montoOrden, loadOrden } = props;
  const { updateOrden } = useOrden();
  const [openEditMonto, setOpenEditMonto] = useState(false);

  const [montoInput, setMontoInput] = useState(montoOrden);
  const [montoInputError, setMontoInputError] = useState('');

  const handleInputMonto = (event) => {
    const inputValue = event.target.value;
    setMontoInput(inputValue);
  };

  useEffect(() => {
    setMontoInput(montoOrden);
  }, [montoOrden]);

  const handleOpenEditMonto = async () => {
    setOpenEditMonto(true);
  };

  const handleCloseEditMonto = () => {
    setMontoInput(montoOrden);
    setMontoInputError('');
    setOpenEditMonto(false);
  };

  const handleCancelButton = () => {
    setMontoInput(montoOrden);
    setMontoInputError('');
    setOpenEditMonto(false);
  };

  const handleSaveButton = async () => {
    try {
      if (montoInput.length === 0) {
        setMontoInputError('Ingresa un monto');
        return;
      }
      await updateOrden(ordenId, { monto: montoInput });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Monto actualizado correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300
      })
      loadOrden();
      setOpenEditMonto(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Tooltip title="Editar" placement="right" disableInteractive>
        <button onClick={handleOpenEditMonto} className="cursor-pointer">
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
      <Modal open={openEditMonto} onClose={handleCloseEditMonto}>
        <div className="w-1/3 h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-1 select-none">
          <div className="w-full col-span-2 px-3 border-b border-b-gray-400 flex text-blue-600 justify-center">
            <h1 className="text-2xl my-3 font-bold">Editar Área</h1>
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
          <div className="w-full px-4 py-4 flex flex-col items-center justify-center bg-white">
            <div>
              <p>Monto:</p>
              <div className="flex h-[45px] mt-1">
                <div className="flex w-full h-[45px] border border-gray-400 rounded-[5px]">
                  <span className="bg-[#E5E7EB] flex justify-center items-center w-[45px] rounded-l-[5px] select-none">
                    S/
                  </span>
                  <input
                    type="text"
                    placeholder="Cantidad"
                    value={montoInput}
                    autoComplete="off"
                    onChange={handleInputMonto}
                    onClick={() => setMontoInputError('')}
                    className="w-[150px] h-full rounded-r-[5px] pl-[10px] focus:outline-blue-500"
                  />
                </div>
              </div>
              {montoInputError && (
                <p className="text-red-500 font-medium">{montoInputError}</p>
              )}
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

export { EditMonto };
