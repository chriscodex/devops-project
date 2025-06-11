import { Modal, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOrden } from '../../../../context/OrdenContext';
import Swal from 'sweetalert2';

function EditAreaModal(props) {
  const { loadAreas, areaItem, areaId } = props;
  const { updateArea } = useOrden();
  const [openModal, setOpenModal] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [inputValueError, setInputValueError] = useState('');

  useEffect(() => {
    setInputValue(areaItem);
  }, [areaItem]);

  const handleInputValue = (event) => {
    setInputValue(event.target.value);
  };

  const handleOpenModal = async () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setInputValue(areaItem);
    setInputValueError('');
    setOpenModal(false);
  };

  const handleSaveButton = async () => {
    try {
      if (inputValue.length === 0) {
        setInputValueError('Ingrese una prioridad');
        return;
      }
      await updateArea(areaId, { area: inputValue });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Área actualizada correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300,
      });
      setOpenModal(false);
      loadAreas();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Tooltip title="Editar" placement="left" disableInteractive>
        <button
          onClick={handleOpenModal}
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
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </Tooltip>
      <Modal open={openModal} onClose={handleCloseModal}>
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
                className="w-7 h-7"
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
            <div className="flex items-center">
              <p>Área: </p>
              <div className="flex h-[45px] ml-3">
                <div className="flex w-full border border-gray-400 rounded-[5px]">
                  <input
                    type="text"
                    value={inputValue}
                    autoComplete="off"
                    onChange={handleInputValue}
                    onClick={() => setInputValueError('')}
                    className="w-[150px] h-full rounded-[5px] pl-[10px] focus:outline-blue-500"
                  />
                </div>
              </div>
            </div>
            {inputValueError && (
              <p className="text-red-500 font-medium">{inputValueError}</p>
            )}
          </div>
          <div className="col-span-2 p-4 flex justify-end border-t border-t-gray-400">
            {
              <button
                className="bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-white px-2 py-2 rounded-md shadow-md flex mr-4"
                onClick={handleCloseModal}
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

export { EditAreaModal };
