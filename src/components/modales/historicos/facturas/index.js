import React, { useState, useEffect } from 'react';
import ModalHistoricoFacturas from './ModalHistoricoFacturas';
import { addZero, toFormatterCurrency } from '../../../../utils/utils';
import { findFacturaByRazonSocialId } from '../../../../services';
import RazonSocial from '../../../../containers/razon_social';

const ModHistoricoFacturas = (props) => {

  const {
    open,
    onClose,
    razonSocial,
  } = props;

  const [historial, setHistorial] = useState([]);

  const columns = [
    { title: 'Fecha', field: 'fecha_show' },
    { title: 'Hora', field: 'hora' },
    { title: 'Paciente', field: 'paciente_nombre' },
    { title: 'Metodo pago', field: 'metodo_pago.nombre' },
    { title: 'Cantidad', field: 'cantidad_moneda' },
    { title: 'Uso CFDI', field: 'uso_cfdi_nombre' },
    { title: 'Sucursal', field: 'sucursal.nombre' },
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
        const response = await findFacturaByRazonSocialId(razonSocial._id);
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
          response.data.forEach( item => {
            item.cantidad_moneda = toFormatterCurrency(item.cantidad);
            item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
            item.uso_cfdi_nombre = `${item.uso_cfdi.clave}: ${item.uso_cfdi.descripcion}`;
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
  }, [razonSocial]);

  return (
    <ModalHistoricoFacturas
        open={open}
        onClickCancel={onClose}
        historial={historial}
        columns={columns}
        options={options}
        titulo={`Historial: ${razonSocial.nombre_completo}`}/>
  );
}

export default ModHistoricoFacturas;