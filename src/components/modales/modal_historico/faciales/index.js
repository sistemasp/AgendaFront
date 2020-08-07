import React, { useState, useEffect } from 'react';
import { findHistoricByPacienteAndService } from "../../../../services";
import Faciales from './Faciales';
import { toFormatterCurrency, addZero } from '../../../../utils/utils';

const TabFaciales = (props) => {

  const {
    open,
    onClose,
    paciente,
    sucursal,
    servicio,
  } = props;

  const [historial, setHistorial] = useState([]);

  const columns = [
    { title: 'Fecha', field: 'fecha_show' },
    { title: 'Hora', field: 'hora' },
    { title: 'Tipo Cita', field: 'tipo_cita.nombre' },
    { title: 'Estado', field: 'status.nombre' },
    { title: 'Sucursal', field: 'sucursal.nombre' },
    { title: 'Preparo', field: 'quien_prepara'},
    { title: 'Realiza', field: 'quien_realiza'},
    { title: 'Acidos', field: 'acidos_show'},
    { title: 'Precio', field: 'precio_moneda' },
  ];

  const options = {
		rowStyle: rowData => {
			return {
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? process.env.REACT_APP_PAGADO_COLOR : ''
			};
		},
		headerStyle: {
			backgroundColor: '#2BA6C6',
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		}
  }

  useEffect(() => {
    const loadHistorial = async () => {
      console.log('SERVICIO CONSULTA', servicio);
      if (servicio) {
        const response = await findHistoricByPacienteAndService(paciente._id, servicio._id);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
          response.data.forEach(item => {
            item.precio_moneda = toFormatterCurrency(item.precio);
            item.show_tratamientos = item.tratamientos.map(tratamiento => {
              return `${tratamiento.nombre}, `;
            });
            const date = new Date(item.fecha_hora);
            const dia = addZero(date.getDate());
            const mes = addZero(date.getMonth() + 1);
            const anio = date.getFullYear();
            const hora = Number(date.getHours() + 5);
            const minutos = date.getMinutes();
            item.fecha_show = `${dia}/${mes}/${anio}`;
            item.hora = `${addZero(hora)}:${addZero(minutos)}`;
          });
          setHistorial(response.data);
        }
      }
    }

    loadHistorial();
  }, [paciente, servicio]);

  return (
    <Faciales
      open={open}
      onClickCancel={onClose}
      historial={historial}
      columns={columns}
      options={options}
      sucursal={sucursal}
      titulo={''} />
  );
}

export default TabFaciales;