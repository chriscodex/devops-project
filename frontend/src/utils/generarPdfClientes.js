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

export const generarReporteClientes = async (lista, parametros) => {
  const {
    tipoCliente,
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
  doc.text('REPORTE DE CLIENTES', 90, 25);

  let rowsHeader = [];

  if (creacionFechaInicio) {
    rowsHeader.push([
      {
        content: `Fecha de Creación: Desde ${formatDate(
          creacionFechaInicio
        )} hasta ${formatDate(creacionFechaFinal)}`,
        colSpan: 4,
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
  } else {
    rowsHeader.push([
      {
        content: `Fecha de Creación: Todas las fechas`,
        colSpan: 4,
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
        content: `Fecha de Entrega: Desde ${formatDate(
          entregaFechaInicio
        )} hasta ${formatDate(entregaFechaFinal)}`,
        colSpan: 4,
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
  } else {
    rowsHeader.push([
      {
        content: `Fecha de Entrega: Todos las fechas`,
        colSpan: 4,
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
  if (tipoCliente) {
    rowsHeader.push([
      {
        content: `Tipo de Cliente: ${
          tipoCliente === 'persona' ? 'Persona' : 'Empresa'
        }`,
        colSpan: 4,
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
        content: `Tipos de Cliente: Todos`,
        colSpan: 4,
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
      colSpan: 4,
    },
  ]);
  rowsHeader.push([
    {
      content: `Tipo`,
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
      content: `${
        tipoCliente === 'persona'
          ? 'DNI'
          : tipoCliente === 'empresa'
          ? 'RUC'
          : 'DNI / RUC'
      }`,
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
      content: `${
        tipoCliente === 'persona'
          ? 'Apellidos y Nombres'
          : tipoCliente === 'empresa'
          ? 'Razón Social'
          : 'Apellidos y Nombres / Razón Social'
      }`,
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
      content: `Celular`,
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
  lista?.forEach((item) => {
    rowsHeader.push([
      {
        content: item?.tipo === 'persona' ? 'Persona' : 'Empresa',
        colSpan: 1,
        styles: {
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
        content: `${item?.tipo === 'persona' ? item?.dni : item?.ruc}`,
        colSpan: 1,
        styles: {
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
        content: `${
          item?.tipo === 'persona'
            ? item?.personaResponsable
            : item?.razonSocial
        }`,
        colSpan: 1,
        styles: {
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
        content: `${item?.celular}`,
        colSpan: 1,
        styles: {
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
