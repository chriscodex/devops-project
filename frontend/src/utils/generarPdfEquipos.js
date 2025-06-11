import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function formatDate(fecha) {
  const date = new Date(fecha);
  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', {
    month: '2-digit',
  });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return [day, month, year].join('-');
}

export const generarReporteEquipos = async (lista, parametros) => {
  const {
    marca,
    categoriaEquipo,
    estado,
    creacionFechaInicio,
    creacionFechaFinal,
    entregaFechaInicio,
    entregaFechaFinal,
  } = parametros;
  const doc = new jsPDF();

  // Header Empresa
  doc.addImage('/perfil/netcomputerBanner.jpg', 5, 5, 70, 12);
  doc.setFontSize(12);
  doc.setFont('Times', 'Bold');
  doc.text('REPORTE DE EQUIPOS', 90, 25);

  let rowsHeader = [];

  if (creacionFechaInicio) {
    rowsHeader.push([
      {
        content: `Fecha de Creación`,
        colSpan: 7,
        styles: {
          fontStyle: 'bold',
          fontSize: 8,
          fillColor: [209, 213, 219],
          lineWidth: {
            top: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
    rowsHeader.push([
      {
        content: `Fecha de Inicio: ${formatDate(creacionFechaInicio)}`,
        colSpan: 4,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
      {
        content: `Fecha Final: ${formatDate(creacionFechaFinal)}`,
        colSpan: 4,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  } else {
    rowsHeader.push([
      {
        content: `Fecha de Creación: Todas las fechas`,
        colSpan: 7,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  }
  if (entregaFechaInicio) {
    rowsHeader.push([
      {
        content: `Fecha de Entrega`,
        colSpan: 7,
        styles: {
          fontStyle: 'bold',
          fontSize: 8,
          fillColor: [209, 213, 219],
          lineWidth: {
            top: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
    rowsHeader.push([
      {
        content: `Fecha de Inicio: ${formatDate(entregaFechaInicio)}`,
        colSpan: 4,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
      {
        content: `Fecha Final: ${formatDate(entregaFechaFinal)}`,
        colSpan: 4,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  } else {
    rowsHeader.push([
      {
        content: `Fecha de Entrega: Todos las fechas`,
        colSpan: 7,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  }
  if (marca) {
    rowsHeader.push([
      {
        content: `Marca: ${marca}`,
        colSpan: 7,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  } else {
    rowsHeader.push([
      {
        content: `Marcas: Todos`,
        colSpan: 7,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  }
  if (categoriaEquipo) {
    rowsHeader.push([
      {
        content: `Categoría: ${categoriaEquipo}`,
        colSpan: 7,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  } else {
    rowsHeader.push([
      {
        content: `Categorías: Todos`,
        colSpan: 7,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  }
  if (estado) {
    rowsHeader.push([
      {
        content: `Estado: ${
          estado === 'pendiente'
            ? 'Pendiente'
            : estado === 'en progreso'
            ? 'En Progreso'
            : estado === 'completada'
            ? 'Completada'
            : estado === 'finalizada'
            ? 'Finalizada'
            : ''
        }`,
        colSpan: 7,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  } else {
    rowsHeader.push([
      {
        content: `Estados: Todos`,
        colSpan: 7,
        styles: {
          fontStyle: 'normal',
          fontSize: 8,
          lineWidth: {
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  }

  // Table Body
  rowsHeader.push([
    {
      content: ``,
      colSpan: 7,
    },
  ]);
  rowsHeader.push([
    {
      content: `ID`,
      colSpan: 1,
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: {
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        },
        lineColor: [0, 0, 0],
      },
    },
    {
      content: `F. Creación`,
      colSpan: 1,
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: {
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        },
        lineColor: [0, 0, 0],
      },
    },
    {
      content: `Marca`,
      colSpan: 1,
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: {
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        },
        lineColor: [0, 0, 0],
      },
    },
    {
      content: `Categoría`,
      colSpan: 1,
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: {
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        },
        lineColor: [0, 0, 0],
      },
    },
    {
      content: `Producto`,
      colSpan: 1,
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: {
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        },
        lineColor: [0, 0, 0],
      },
    },
    {
      content: `Serie`,
      colSpan: 1,
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: {
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        },
        lineColor: [0, 0, 0],
      },
    },
    {
      content: `F. Entrega`,
      colSpan: 1,
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8,
        lineWidth: {
          top: 0.1,
          bottom: 0.1,
          left: 0.1,
          right: 0.1,
        },
        lineColor: [0, 0, 0],
      },
    },
  ]);
  console.log(lista);
  lista?.forEach((item) => {
    rowsHeader.push([
      {
        content: `${item?.identificador}`,
        colSpan: 1,
        styles: {
          fontSize: 6,
          lineWidth: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
      {
        content: `${formatDate(item?.createdAt)}`,
        colSpan: 1,
        styles: {
          fontSize: 6,
          lineWidth: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
      {
        content: item?.equipo?.marca,
        colSpan: 1,
        styles: {
          fontSize: 6,
          lineWidth: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
      {
        content: item?.equipo?.categoria,
        colSpan: 1,
        styles: {
          fontSize: 6,
          lineWidth: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
      {
        content: item?.equipo?.producto,
        colSpan: 1,
        styles: {
          fontSize: 6,
          lineWidth: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
      {
        content: item?.equipo?.serie,
        colSpan: 1,
        styles: {
          fontSize: 6,
          lineWidth: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
      {
        content: `${formatDate(item?.fecha)}`,
        colSpan: 1,
        styles: {
          fontSize: 6,
          lineWidth: {
            top: 0.1,
            bottom: 0.1,
            left: 0.1,
            right: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ]);
  });

  doc.autoTable({
    startY: 30,
    margin: 5,
    body: rowsHeader,
    theme: 'plain',
    styles: {
      fontSize: 8,
      cellBorder: 'none',
      tableLineWidth: 1,
      tableLineColor: [0, 0, 0],
    },
    // tableLineWidth: 0.1,
    // tableLineColor: [0, 0, 0],
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
