import { Modal, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useOrden } from '../../../context/OrdenContext';
import Swal from 'sweetalert2';

function EditServicioAdicional({
  ordenId,
  servicioAdicionalId,
  descripcionServicio,
  costoServicio,
  loadServiciosAdicionales,
}) {
  const {
    updateServicioAdicional,
    getTotalServiciosAdicionalesByOrdenId,
    updateOrden,
  } = useOrden();

  useEffect(() => {
    setDescriptionInput(descripcionServicio);
    setCosto(costoServicio);
  }, [descripcionServicio, costoServicio]);

  const handleEditarServicioAdicional = async () => {
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

      await updateServicioAdicional(servicioAdicionalId, newServicioAdicional);

      await loadServiciosAdicionales();

      const responseTotal = await getTotalServiciosAdicionalesByOrdenId(
        ordenId
      );
      await updateOrden(ordenId, { montoAdicional: responseTotal.costoTotal });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Servicio adicional actualizado correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300,
      });
      setOpenEditServicioAdicional(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelarButton = () => {
    setOpenEditServicioAdicional(false);
    setDescriptionInput('');
    setCosto('');
    setCostoError('');
    setDescriptionError('');
  };

  // Open Add Equipo
  const [openEditServicioAdicional, setOpenEditServicioAdicional] =
    useState(false);
  const handleOpenServicioAdicional = () => {
    setOpenEditServicioAdicional(true);
  };
  const handleCloseServicioAdicional = () => {
    setOpenEditServicioAdicional(false);
  };

  // Description
  const [descriptionInput, setDescriptionInput] = useState('');

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
      <Tooltip title="Editar" placement="left" disableInteractive>
        <button
          onClick={handleOpenServicioAdicional}
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
      <Modal
        open={openEditServicioAdicional}
        onClose={handleCloseServicioAdicional}
        className="w-full h-full relative"
      >
        <div className="w-1/3 h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-1 select-none">
          <div className="col-span-2 px-3 border-b border-b-gray-400 flex text-blue-600 justify-center">
            <h1 className="text-2xl my-3 font-bold">Editar</h1>
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
              onClick={handleEditarServicioAdicional}
            >
              <p className="text-white">Guardar</p>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export { EditServicioAdicional };
