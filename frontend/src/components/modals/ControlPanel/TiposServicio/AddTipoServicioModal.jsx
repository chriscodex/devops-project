import { Modal } from '@mui/material';
import { useState } from 'react';
import { useOrden } from '../../../../context/OrdenContext';
import Swal from 'sweetalert2';

function AddTipoServicioModal(props) {
  const { loadItems } = props;
  const { createTipoServicio } = useOrden();
  const [openModal, setOpenModal] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [inputValueError, setInputValueError] = useState('');

  const handleInputValue = (event) => {
    setInputValue(event.target.value);
  };

  const handleOpenModal = async () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setInputValue('');
    setInputValueError('');
    setOpenModal(false);
  };

  const handleSaveButton = async () => {
    try {
      if (inputValue.length === 0) {
        setInputValueError('Ingrese un tipo de servicio');
        return;
      }
      await createTipoServicio({ tipoServicio: inputValue });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Tipo de servicio creado correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300,
      });
      setInputValue('');
      setOpenModal(false);
      loadItems();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
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
        <p className="text-white ml-[10px]">Agregar</p>
      </button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="w-1/3 h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-1 select-none">
          <div className="w-full col-span-2 px-3 border-b border-b-gray-400 flex text-blue-600 justify-center">
            <h1 className="text-2xl my-3 font-bold">Agregar Tipo de Servicio</h1>
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </span>
          </div>
          <div className="w-full px-4 py-4 flex flex-col items-center justify-center bg-white">
            <div className="flex items-center">
              <p>Tipo de Servicio: </p>
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
            <button
              className="bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-white px-2 py-2 rounded-md shadow-md flex mr-4"
              onClick={handleCloseModal}
            >
              <p className="text-black">Cancelar</p>
            </button>
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

export { AddTipoServicioModal };
