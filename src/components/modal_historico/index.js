import React, { useState, useEffect } from 'react';
import { findHistoricByPaciente } from "../../services";
import ModalHistorico from './ModalHistorico';
import { toFormatterCurrency, addZero } from '../../utils/utils';

const ModHistorico = (props) => {

  const {
    open,
    onClose,
    paciente,
  } = props;

  const [historial, setHistorial] = useState([]);

  const columns = [
    { title: 'Fecha', field: 'fecha_show' },
    { title: 'Hora', field: 'hora' },
    { title: 'Servicio', field: 'servicio.nombre' },
    { title: 'Tratamientos', field: 'show_tratamientos' },
    { title: 'Numero Sesion', field: 'numero_sesion' },
    { title: 'Tipo Cita', field: 'tipo_cita.nombre' },
    { title: 'Estado', field: 'status.nombre' },
    { title: 'Sucursal', field: 'sucursal.nombre'},
    { title: 'Precio', field: 'precio_moneda' },
  ];

  const options = {
    rowStyle: rowData => {
      const {asistio} = rowData;
      if (asistio === 'NO ASISTIO') {
          return { color: '#B7B4A1' };
      } else if (asistio === 'CANCELO') {
          return { color: '#FF0000', fontWeight: 'bold' };
      } else if (asistio === 'REAGENDO') {
          return { color: '#FBD014' };
      }
    },
    headerStyle: {
        backgroundColor: '#5DADE2',
        color: '#FFF',
        fontWeight: 'bolder',
        fontSize: '18px'
    }
  }


  useEffect(() => {
    const loadHistorial = async() => {
        const response = await findHistoricByPaciente(paciente._id);
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
          response.data.forEach( item => {
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
    
    loadHistorial();
  }, [paciente]);

  return (
    <ModalHistorico
        open={open}
        onClickCancel={onClose}
        historial={historial}
        columns={columns}
        options={options}
        titulo={`Historial: ${paciente.nombres} ${paciente.apellidos}`}/>
  );
}

export default ModHistorico;