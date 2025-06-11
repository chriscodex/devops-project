import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { getServiciosAdicionalesByOrdenIdRequest } from '../api/ordenes';

const getServiciosAdicionalesByOrdenId = async (ordenId) => {
  try {
    const res = await getServiciosAdicionalesByOrdenIdRequest(ordenId);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const generarPdf = async (ordenData) => {
  try {
    const serviciosAdicionalesLista = await getServiciosAdicionalesByOrdenId(
      ordenData?._id
    );

    const sumaAdicionales = serviciosAdicionalesLista?.reduce(
      (acumulador, objeto) => {
        return acumulador + parseFloat(objeto.costo);
      },
      0
    );

    const doc = new jsPDF();

    // Header Empresa
    doc.addImage('/perfil/netcomputerBanner.jpg', 5, 5, 70, 12);

    doc.setFontSize(8);
    doc.text(`Soporte@netcomputer.com.pe`, 5, 20);
    doc.text(`Celular: 956600949`, 50, 20);

    const rowsOrden = [
      [
        {
          content: `FICHA DE LA EMPRESA`,
          styles: {
            fontStyle: 'bold',
            fontSize: 8,
            
          },
        },
      ],
      [
        {
          content: `FECHA DE IMPRESIÓN ${new Date().toLocaleDateString()}`,
          styles: {
            fontSize: 8,
            rowHeight: 5,
          },
        },
      ],
      [
        {
          content: `ORDEN N° ${ordenData?._id?.slice(-6)}`,
          styles: {
            fontStyle: 'bold',
            fontSize: 12,
          },
        },
      ],
    ];
    doc.autoTable({
      theme: 'plain',
      startY: 7,
      margin: {
        left: 155,
      },
      tableWidth: 'wrap',
      body: rowsOrden,
      styles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        cellPadding: 0,
      },
    });

    const columnsClient = [
      {
        content: `Datos del Cliente`,
        styles: {
          fontStyle: 'bold',
          fillColor: [209, 213, 219],
        },
      },
      {
        content: `Datos del Equipo`,
        styles: {
          fontStyle: 'bold',
          fillColor: [209, 213, 219],
          lineWidth: {
            left: 0.1,
          },
          lineColor: [0, 0, 0],
        },
      },
    ];
    let rowsClient = [];
    if (ordenData?.cliente?.tipo === 'persona') {
      rowsClient = [
        [
          `Apellidos y Nombres: ${ordenData?.cliente?.personaResponsable}`,
          {
            content: `Marca: ${ordenData?.equipo?.marca}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          `DNI: ${ordenData?.cliente?.dni}`,
          {
            content: `Categoría: ${ordenData?.equipo?.categoria}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          `Celular: ${ordenData?.cliente?.celular}`,
          {
            content: `Accesorios: ${ordenData?.equipo?.accesorios}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];
    }
    if (ordenData?.cliente?.tipo === 'empresa') {
      rowsClient = [
        [
          `RUC: ${ordenData?.cliente?.ruc}`,
          {
            content: `Marca: ${ordenData?.equipo?.marca}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          `Razon Social: ${ordenData?.cliente?.razonSocial}`,
          {
            content: `Categoría: ${ordenData?.equipo?.categoria}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          `Persona Responsable: ${ordenData?.cliente?.personaResponsable}`,
          {
            content: `Accesorios: ${ordenData?.equipo?.accesorios}`,
            styles: {
              lineWidth: {
                left: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];
    }
    const rowTecnico = [
      [
        {
          content: `Tecnico:`,
          styles: {
            fontStyle: 'bold',
            fillColor: [209, 213, 219],
            lineWidth: {
              top: 0.1,
              right: 0.1,
            },
            lineColor: [0, 0, 0],
            cellWidth: 110,
          },
        },
        {
          content: `${ordenData?.user?.nombres} ${ordenData?.user?.apellidos}`,
          styles: {
            fontStyle: 'normal',
            lineWidth: {
              top: 0.1,
            },
            lineColor: [0, 0, 0],
          },
        },
      ],
    ];
    rowsClient.push(...rowTecnico);
    if (serviciosAdicionalesLista.length === 0) {
      const newData = [
        [
          {
            content: `Servicio: ${ordenData?.tipoServicio}`,
            colSpan: 2,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: `${ordenData?.trabajo}`,
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              lineWidth: {
                bottom: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: `Costo Total:`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `S/. ${Number(ordenData?.monto).toFixed(2)}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];
      rowsClient.push(...newData);
    } else {
      const newData = [
        [
          {
            content: `Servicio: ${ordenData?.tipoServicio}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `S/. ${Number(ordenData?.monto).toFixed(2)}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: `${ordenData?.trabajo}`,
            colSpan: 2,
            styles: {
              fontStyle: 'normal',
              lineWidth: {
                bottom: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: `Servicios Adicionales`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `S/. ${Number(sumaAdicionales).toFixed(2)}`,
            styles: {
              fontStyle: 'bold',
              fillColor: [209, 213, 219],
              lineWidth: {
                top: 0.1,
              },
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];
      serviciosAdicionalesLista?.forEach((servicio) => {
        newData?.push([
          `${servicio?.descripcion}`,
          `S/. ${Number(servicio?.costo).toFixed(2)}`,
        ]);
      });
      rowsClient.push(...newData);
      rowsClient?.push([
        {
          content: `Costo Total:`,
          styles: {
            fontStyle: 'bold',
            fillColor: [209, 213, 219],
            lineWidth: {
              top: 0.1,
              bottom: 0.1,
            },
            lineColor: [0, 0, 0],
          },
        },
        {
          content: `S/. ${Number(
            Number(ordenData?.monto) + Number(sumaAdicionales)
          ).toFixed(2)}`,
          styles: {
            fontStyle: 'bold',
            fillColor: [209, 213, 219],
            lineWidth: {
              top: 0.1,
              bottom: 0.1,
            },
            lineColor: [0, 0, 0],
          },
        },
      ]);
    }

    doc.autoTable({
      startY: 23,
      margin: 5,
      head: [columnsClient],
      body: rowsClient,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellBorder: 'none',
        tableLineWidth: 1,
        tableLineColor: [0, 0, 0],
      },
      tableLineWidth: 0.1,
      tableLineColor: [0, 0, 0],
    });

    const centerY = doc.internal.pageSize.height / 2;

    // Firma
    doc.autoTable({
      startY: centerY - 8,
      margin: {
        left: 120,
      },
      body: [[`Firma de entregado, ${ordenData?.cliente?.personaResponsable}`]],
      theme: 'plain',
      columnStyles: {
        0: {
          lineWidth: {
            top: 0.1,
          },
          lineColor: [0, 0, 0],
          halign: 'center', // Alineación horizontal
          valign: 'middle',
        },
      },
      styles: {
        fontSize: 8,
        cellBorder: 'none',
      },
      tableWidth: 'wrap',
    });

    doc.setLineDash([2, 2]); // [longitud del segmento, longitud del espacio]

    // Dibujar una línea horizontal que atraviese el centro del documento
    const lineWidth = doc.internal.pageSize.width - 15; // Ancho del documento con un margen de 10 unidades a cada lado

    doc.line(5, centerY, 10 + lineWidth, centerY);

    // Restablecer el estilo de la línea a sólido para las líneas subsiguientes
    doc.setLineDash([]);

    // Header Empresa
    doc.addImage('/perfil/netcomputerBanner.jpg', 5, centerY + 5, 70, 12);
    (rowsOrden[0] = [
      {
        content: `FICHA DEL CLIENTE`,
        styles: {
          fontStyle: 'bold',
          fontSize: 8,
        },
      },
    ]),
      doc.autoTable({
        theme: 'plain',
        startY: centerY + 5,
        margin: {
          left: 150,
        },
        tableWidth: 'wrap',
        body: rowsOrden,
        styles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          cellPadding: 0,
        },
      });

    doc.autoTable({
      startY: centerY + 23,
      margin: 5,
      head: [columnsClient],
      body: rowsClient,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellBorder: 'none',
        tableLineWidth: 1,
        tableLineColor: [0, 0, 0],
      },
      tableLineWidth: 0.1,
      tableLineColor: [0, 0, 0],
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
  } catch (error) {
    console.log(error);
  }
};
