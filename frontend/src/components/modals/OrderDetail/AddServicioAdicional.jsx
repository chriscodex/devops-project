import { Modal } from '@mui/material';
import { useState } from 'react';
import { useOrden } from '../../../context/OrdenContext';
import Swal from 'sweetalert2';

function AddServicioAdicional({ ordenId, setServiciosAdicionales, loadOrden }) {
  const { createServicioAdicional, getServiciosAdicionalesByOrdenId, getTotalServiciosAdicionalesByOrdenId, updateOrden } =
    useOrden();

  // Agregar equipo
  const handleAgregarServicioAdicional = async () => {
    try {
      if (descriptionInput.length === 0) {
        setDescriptionError('Ingrese un descripción');
        return;
      }
      if (costo.length === 0) {
        setCostoError('Ingrese un costo');
        return;
      }
      const newServicioAdicional = {
        descripcion: descriptionInput,
        costo: costo,
      };
      await createServicioAdicional(
        ordenId,
        newServicioAdicional
      );
      const response = await getServiciosAdicionalesByOrdenId(ordenId);
      setServiciosAdicionales(response);
      setDescriptionInput('');
      setCosto('');

      const responseTotal = await getTotalServiciosAdicionalesByOrdenId(ordenId);
      await updateOrden(ordenId, { montoAdicional: responseTotal.costoTotal });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Servicio adicional agregado correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1000,
      });
      setOpenAddServicioAdicional(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelarButton = () => {
    setOpenAddServicioAdicional(false);
    setDescriptionInput('');
    setCosto('');
    setCostoError('');
    setDescriptionError('');
  };

  // Open Add Equipo
  const [openAddServicioAdicional, setOpenAddServicioAdicional] =
    useState(false);
  const handleOpenAddEquipo = () => {
    setOpenAddServicioAdicional(true);
  };
  const handleCloseAddEquipo = () => {
    setOpenAddServicioAdicional(false);
  };

  // Description
  const [descriptionInput, setDescriptionInput] = useState('');
  // Object.keys(equipo).length === 0 ? '' : equipo.serie

  const handleClickInputs = () => {
    setDescriptionError('');
  };
  const handleChangeDescriptionInput = (event) => {
    const inputValue = event.target.value;
    setDescriptionInput(inputValue);
  };

  // Costo
  const [costo, setCosto] = useState('');
  // Object.keys(equipo).length === 0 ? '' : equipo.accesorios

  const handleChangeCostoInput = (event) => {
    const newInputValue = event.target.value;

    if (!/^\d*\.?\d*$/.test(newInputValue)) {
      setCosto(newInputValue.replace(/[^\d.]/g, ''));
    } else {
      setCosto(newInputValue);
    }
  };

  // error validations
  const [descriptionError, setDescriptionError] = useState('');
  const [costoError, setCostoError] = useState('');

  return (
    <>
      <button
        onClick={handleOpenAddEquipo}
        className="bg-blue-600 hover:bg-blue-800 text-white rounded-md flex items-center justify-center py-1 px-2"
      >
        <p className="mr-1">Agregar</p>
        {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        }
      </button>
      <Modal
        open={openAddServicioAdicional}
        onClose={handleCloseAddEquipo}
        className="w-full h-full relative"
      >
        <div className="w-1/3 h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-1 select-none">
          <div className="col-span-2 px-3 border-b border-b-gray-400 flex text-blue-600 justify-center">
            <h1 className="text-2xl my-3 font-bold">
              Agregar Servicio Adicional
            </h1>
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
                  d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.867 19.125h.008v.008h-.008v-.008z"
                />
              </svg>
            </span>
          </div>
          <div className="col-span-2 px-4 pt-4">
            <p>
              Descripción <span className="text-red-500">*</span>
            </p>
            <div className="flex w-full h-[45px]">
              <input
                type="text"
                autoComplete="off"
                value={descriptionInput}
                className="w-full h-full rounded-[5px] pl-[10px] border border-gray-400 focus:outline-blue-500 "
                onClick={handleClickInputs}
                onChange={handleChangeDescriptionInput}
              />
            </div>
            {descriptionError ? (
              <p className="text-red-500">{descriptionError}</p>
            ) : null}
          </div>
          <div className="col-span-2 p-4">
            <p>
              Costo <span className="text-red-500">*</span>
            </p>
            <div className="flex w-full h-[45px]">
              <input
                type="text"
                placeholder=""
                autoComplete="off"
                value={costo}
                className="w-full h-full rounded-[5px] pl-[10px] border border-gray-400 focus:outline-blue-500 "
                onClick={handleClickInputs}
                onChange={handleChangeCostoInput}
              />
            </div>
            {costoError ? <p className="text-red-500">{costoError}</p> : null}
          </div>
          <div className="col-span-2 p-4 flex justify-end border-t border-t-gray-400">
            {
              <button
                className="bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-white px-2 py-2 rounded-md shadow-md flex mr-4"
                onClick={handleCancelarButton}
              >
                <p className="text-black">Cancelar</p>
              </button>
            }
            <button
              className="bg-blue-700 border border-gray-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-white px-2 py-2 rounded-md shadow-md flex"
              onClick={handleAgregarServicioAdicional}
            >
              <p className="text-white">Guardar</p>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export { AddServicioAdicional };
