import React, { useState, useEffect } from 'react';
import ModalHistoricoFacturas from './ModalHistoricoFacturas';
import { addZero, toFormatterCurrency } from '../../../../utils/utils';
import { findFacturaByRazonSocialId } from '../../../../services/facturas';

const ModHistoricoFacturas = (props) => {

  const {
    open,
    onClose,
    razonSocial,
  } = props;

  const [historial, setHistorial] = useState([]);

  const columns = [
    { title: 'FECHA', field: 'fecha_show' },
    { title: 'HORA', field: 'hora' },
    { title: 'PACIENTE', field: 'paciente_nombre' },
    { title: 'FORMA PAGO', field: 'forma_pago.nombre' },
    { title: 'CANTIDAD', field: 'cantidad_moneda' },
    { title: 'USO CFDI', field: 'uso_cfdi_nombre' },
    { title: 'SUCURSAL', field: 'sucursal.nombre' },
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
            const mes = addZero(date.getMonth());
            const anio = date.getFullYear();
            const hora = Number(date.getHours());
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
        titulo={`HISTORIAL: ${razonSocial.nombre_completo}`}/>
  );
}

export default ModHistoricoFacturas;