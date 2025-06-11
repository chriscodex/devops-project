import { Modal, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useOrden } from '../../../../context/OrdenContext';
import Swal from 'sweetalert2';

function EditEquipo(props) {
  const {
    ordenId,
    loadOrden,
    marcaOrden,
    categoriaOrden,
    productoNameOrden,
    serieOrden,
    accesoriosOrden,
    observacionesOrden,
  } = props;
  const {
    updateOrden,
    createMarca,
    getAllMarcas,
    marcas,
    createCategoriaEquipo,
    getAllCategoriasEquipo,
    categoriasEquipo,
  } = useOrden();
  const [openEditEquipo, setOpenEditEquipo] = useState(false);

  const [openAddMarca, setOpenAddMarca] = useState(false);
  const inputMarcaRef = useRef();
  const [inputValueMarca, setInputValueMarca] = useState('');
  const handleInputMarca = (event) => {
    const inputValue = event.target.value;
    setInputValueMarca(inputValue);
  };
  const [marcaSelect, setMarcaSelect] = useState(marcaOrden);
  const handleSelectMarca = (event) => {
    const nuevoValor = event.target.value;
    setMarcaSelect(nuevoValor);
  };
  const handleAddMarca = () => {
    setOpenAddMarca(true);
    setOpenAddCategoria(false);
  };
  const handleSaveMarca = async () => {
    try {
      const newMarca = {
        nombre: inputValueMarca,
      };
      await createMarca(newMarca);
      await getAllMarcas();
      setInputValueMarca('');
      setOpenAddMarca(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [openAddCategoria, setOpenAddCategoria] = useState(false);
  const inputCategoriaRef = useRef();
  const [inputValueCategoria, setInputValueCategoria] = useState('');

  const handleAddCategoria = () => {
    setOpenAddCategoria(true);
    setOpenAddMarca(false);
  };
  const handleSaveCategoria = async () => {
    try {
      const newCategoria = {
        nombre: inputValueCategoria,
      };

      await createCategoriaEquipo(newCategoria);
      await getAllCategoriasEquipo();
      setInputValueCategoria('');
      setOpenAddCategoria(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleInputCategoria = (event) => {
    const inputValue = event.target.value;
    setInputValueCategoria(inputValue);
  };

  const [categoriaSelect, setCategoriaSelect] = useState(categoriaOrden);
  const handleSelectCategoria = (event) => {
    const nuevoValor = event.target.value;
    setCategoriaSelect(nuevoValor);
  };

  const [productNameInput, setProductNameInput] = useState(productoNameOrden);
  const [productNameError, setProductNameError] = useState('');
  const handleChangeProductNameInput = (event) => {
    const inputValue = event.target.value;
    setProductNameInput(inputValue);
  };

  const [serieInput, setSerieInput] = useState(serieOrden);
  const [serieError, setSerieError] = useState('');

  const handleClickInputs = () => {
    setSerieError('');
    setProductNameError('');
    setOpenAddCategoria(false);
    setOpenAddMarca(false);
  };

  const handleChangeNroSerieInput = (event) => {
    const inputValue = event.target.value;
    setSerieInput(inputValue);
  };

  const [accesorios, setAccesorios] = useState(
    accesoriosOrden === 'Ninguno' ? '' : accesoriosOrden
  );
  const handleChangeAccesoriosInput = (event) => {
    const inputValue = event.target.value;
    setAccesorios(inputValue);
  };

  const [observaciones, setObservaciones] = useState(
    observacionesOrden === 'Ninguno' ? '' : observacionesOrden
  );
  const handleChangeObservacionesInput = (event) => {
    const inputValue = event.target.value;
    setObservaciones(inputValue);
  };

  const handleOpenEditEquipo = async () => {
    setOpenEditEquipo(true);
  };

  const handleCloseEditEquipo = () => {
    setOpenEditEquipo(false);
  };

  const handleCancelButton = () => {
    setMarcaSelect(marcaOrden);
    setCategoriaSelect(categoriaOrden);
    setSerieInput(serieOrden);
    setProductNameInput(productoNameOrden);
    accesorios === 'Ninguno'
      ? setAccesorios('')
      : setAccesorios(accesoriosOrden);
    observaciones === 'Ninguno'
      ? setObservaciones('')
      : setObservaciones(observacionesOrden);
    setOpenEditEquipo(false);
  };

  const handleSaveButton = async () => {
    try {
      if (productNameInput.length === 0) {
        setProductNameError('Ingrese el nombre del producto');
        return;
      } else {
        setProductNameError('');
      }
      if (serieInput.length === 0) {
        setSerieError('Ingrese un número de serie');
        return;
      } else {
        setSerieError('');
      }
      await updateOrden(ordenId, {
        equipo: {
          marca: marcaSelect,
          categoria: categoriaSelect,
          serie: serieInput,
          producto: productNameInput,
          accesorios: accesorios ? accesorios : 'Ninguno',
          observaciones: observaciones ? observaciones : 'Ninguno',
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Equipo actualizado correctamente',
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1300,
      });
      setOpenEditEquipo(false);
      loadOrden();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setMarcaSelect(marcaOrden);
    setCategoriaSelect(categoriaOrden);
    setSerieInput(serieOrden);
    setProductNameInput(productoNameOrden);
    accesoriosOrden === 'Ninguno'
      ? setAccesorios('')
      : setAccesorios(accesoriosOrden);
    observacionesOrden === 'Ninguno'
      ? setObservaciones('')
      : setObservaciones(observacionesOrden);
  }, [
    marcaOrden,
    categoriaOrden,
    serieOrden,
    accesoriosOrden,
    observacionesOrden,
    productoNameOrden,
  ]);

  useEffect(() => {
    if (openAddMarca) {
      inputMarcaRef.current.focus();
    }
  }, [openAddMarca]);

  useEffect(() => {
    if (openAddCategoria) {
      inputCategoriaRef.current.focus();
    }
  }, [openAddCategoria]);

  return (
    <>
      <Tooltip title="Editar" placement="bottom" disableInteractive>
        <button onClick={handleOpenEditEquipo} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 opacity-80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
        </button>
      </Tooltip>
      <Modal open={openEditEquipo} onClose={handleCloseEditEquipo}>
        <div className="w-1/2 h-auto bg-[#efeff4] rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 select-none">
          <div className="col-span-2 px-3 border-b border-b-gray-400 flex text-blue-600">
            <h1 className="text-2xl my-3 font-bold">Editar Equipo</h1>
            <span className="flex items-center ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                />
              </svg>
            </span>
          </div>
          <div className="p-4">
            <p>
              Marca <span className="text-red-500">*</span>
            </p>
            <div className="w-full h-[45px] grid grid-cols-4 gap-1">
              {openAddMarca ? (
                <>
                  <input
                    ref={inputMarcaRef}
                    type="text"
                    className="col-span-3 w-full h-full rounded-[5px] pl-[10px] border"
                    onChange={handleInputMarca}
                  />
                  <div className="justify-center items-center rounded-lg grid grid-cols-2">
                    <div
                      className="bg-myViolet rounded-l-lg flex justify-center items-center h-full"
                      onClick={handleSaveMarca}
                    >
                      <svg
                        fill="#fff"
                        className="w-7 h-7"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                      >
                        <g id="Floppy-disk">
                          <path d="M35.2673988,6.0411h-7.9999981v10h7.9999981V6.0411z M33.3697014,14.1434002h-4.2046013V7.9387999h4.2046013V14.1434002z" />
                          <path
                            d="M41,47.0410995H21c-0.5527992,0-1,0.4472008-1,1c0,0.5527,0.4472008,1,1,1h20c0.5527,0,1-0.4473,1-1
		C42,47.4883003,41.5527,47.0410995,41,47.0410995z"
                          />
                          <path
                            d="M41,39.0410995H21c-0.5527992,0-1,0.4472008-1,1c0,0.5527,0.4472008,1,1,1h20c0.5527,0,1-0.4473,1-1
		C42,39.4883003,41.5527,39.0410995,41,39.0410995z"
                          />
                          <path d="M12,56.0410995h38v-26H12V56.0410995z M14,32.0410995h34v22H14V32.0410995z" />
                          <path
                            d="M49.3811989,0.0411L49.3610992,0H7C4.7908001,0,3,1.7909,3,4v56c0,2.2092018,1.7908001,4,4,4h50
		c2.2090988,0,4-1.7907982,4-4V11.6962996L49.3811989,0.0411z M39.9604988,2.0804999v17.9211006H14.0394001V2.0804999H39.9604988z
		 M59,60c0,1.1027985-0.8972015,2-2,2H7c-1.1027999,0-2-0.8972015-2-2V4c0-1.1027999,0.8972001-2,2-2h5v20.0410995h30V2h6.5099983
		L59,12.5228996V60z"
                          />
                        </g>
                      </svg>
                    </div>
                    <div
                      className="bg-red-500 rounded-r-lg flex justify-center items-center h-full"
                      onClick={() => setOpenAddMarca(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-7 h-7 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <select
                    name="marcaEditEquipo"
                    id="marcaEditEquipo"
                    className="col-span-3 border border-gray-400 rounded-[5px]"
                    value={marcaSelect}
                    onChange={handleSelectMarca}
                  >
                    {marcas?.map((marca) => (
                      <option key={marca?._id} value={marca?.nombre}>
                        {marca?.nombre}
                      </option>
                    ))}
                  </select>
                  <div
                    className="w-10 bg-green-500 rounded-lg flex justify-center items-center h-full"
                    onClick={handleAddMarca}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-8 h-8 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="p-4 select-none">
            <p>
              Categoría <span className="text-red-500">*</span>
            </p>
            <div className="w-full h-[45px] grid grid-cols-4 gap-1">
              {openAddCategoria ? (
                <>
                  <input
                    ref={inputCategoriaRef}
                    type="text"
                    className="col-span-3 w-full h-full rounded-[5px] pl-[10px] border"
                    onChange={handleInputCategoria}
                  />
                  <div className="justify-center items-center bg-sky-400 rounded-lg grid grid-cols-2">
                    <div
                      className="bg-myViolet rounded-l-lg flex justify-center items-center h-full"
                      onClick={handleSaveCategoria}
                    >
                      <svg
                        fill="#fff"
                        className="w-7 h-7"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 64"
                      >
                        <g id="Floppy-disk">
                          <path d="M35.2673988,6.0411h-7.9999981v10h7.9999981V6.0411z M33.3697014,14.1434002h-4.2046013V7.9387999h4.2046013V14.1434002z" />
                          <path
                            d="M41,47.0410995H21c-0.5527992,0-1,0.4472008-1,1c0,0.5527,0.4472008,1,1,1h20c0.5527,0,1-0.4473,1-1
		C42,47.4883003,41.5527,47.0410995,41,47.0410995z"
                          />
                          <path
                            d="M41,39.0410995H21c-0.5527992,0-1,0.4472008-1,1c0,0.5527,0.4472008,1,1,1h20c0.5527,0,1-0.4473,1-1
		C42,39.4883003,41.5527,39.0410995,41,39.0410995z"
                          />
                          <path d="M12,56.0410995h38v-26H12V56.0410995z M14,32.0410995h34v22H14V32.0410995z" />
                          <path
                            d="M49.3811989,0.0411L49.3610992,0H7C4.7908001,0,3,1.7909,3,4v56c0,2.2092018,1.7908001,4,4,4h50
		c2.2090988,0,4-1.7907982,4-4V11.6962996L49.3811989,0.0411z M39.9604988,2.0804999v17.9211006H14.0394001V2.0804999H39.9604988z
		 M59,60c0,1.1027985-0.8972015,2-2,2H7c-1.1027999,0-2-0.8972015-2-2V4c0-1.1027999,0.8972001-2,2-2h5v20.0410995h30V2h6.5099983
		L59,12.5228996V60z"
                          />
                        </g>
                      </svg>
                    </div>
                    <div
                      className="bg-red-500 rounded-r-lg flex justify-center items-center h-full"
                      onClick={() => setOpenAddCategoria(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-7 h-7 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <select
                    name="categoria"
                    id=""
                    value={categoriaSelect}
                    onChange={handleSelectCategoria}
                    className="col-span-3 border border-gray-400 rounded-[5px]"
                  >
                    {categoriasEquipo?.map((categoria) => (
                      <option key={categoria?._id} value={categoria?.nombre}>
                        {categoria?.nombre}
                      </option>
                    ))}
                  </select>
                  <div
                    className="w-10 bg-green-500 rounded-lg flex justify-center items-center h-full"
                    onClick={handleAddCategoria}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-8 h-8 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-span-2 p-4">
            <p>
              Producto<span className="text-red-500">*</span>
            </p>
            <div className="flex w-full h-[45px]">
              <input
                type="text"
                autoComplete="off"
                value={productNameInput}
                className="w-full h-full rounded-[5px] pl-[10px] border border-gray-400 focus:outline-blue-500 "
                onClick={handleClickInputs}
                onChange={handleChangeProductNameInput}
              />
            </div>
            {productNameError ? (
              <p className="text-red-500">{productNameError}</p>
            ) : (
              <></>
            )}
          </div>
          <div className="col-span-2 p-4">
            <p>
              N° de Serie <span className="text-red-500">*</span>
            </p>
            <div className="flex w-full h-[45px]">
              <input
                type="text"
                placeholder="Ingrese el N° de Serie"
                autoComplete="off"
                value={serieInput}
                className="w-full h-full rounded-[5px] pl-[10px] border border-gray-400 focus:outline-blue-500 "
                onClick={handleClickInputs}
                onChange={handleChangeNroSerieInput}
              />
            </div>
            {serieError ? <p className="text-red-500">{serieError}</p> : <></>}
          </div>
          <div className="col-span-2 p-4">
            <p>Accesorios</p>
            <div className="flex w-full h-[45px]">
              <input
                type="text"
                placeholder="Ingrese los accesorios del equipo"
                autoComplete="off"
                value={accesorios}
                className="w-full h-full rounded-[5px] pl-[10px] border border-gray-400 focus:outline-blue-500 "
                onClick={handleClickInputs}
                onChange={handleChangeAccesoriosInput}
              />
            </div>
          </div>
          <div className="col-span-2 p-4">
            <p>Observaciones:</p>
            <textarea
              rows="4"
              cols="50"
              className="w-full h-[80%] border border-gray-400 rounded-[5px] focus:outline-blue-500 p-[5px] resize-none"
              value={observaciones}
              onClick={handleClickInputs}
              onChange={handleChangeObservacionesInput}
            ></textarea>
          </div>
          <div className="col-span-2 p-4 flex justify-end border-t border-t-gray-400">
            <button
              className="bg-white border border-gray-400 hover:bg-gray-200 focus:ring-4 focus:ring-blue-300 text-white px-2 py-2 rounded-md shadow-md flex mr-4"
              onClick={handleCancelButton}
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

export { EditEquipo };
