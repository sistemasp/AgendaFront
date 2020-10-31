import React, { useState, useEffect, Fragment } from 'react';
import { findHistoricByPacienteAndService } from "../../../../services";
import Laser from './Laser';
import { toFormatterCurrency, addZero } from '../../../../utils/utils';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const TabLaser = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    paciente,
    sucursal,
    servicio,
  } = props;

  const [historial, setHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { title: 'Fecha', field: 'fecha_show' },
    { title: 'Hora', field: 'hora' },
    { title: 'Sesion', field: 'status.nombre' },
    { title: 'Area', field: 'status.nombre' },
    { title: 'Intencidad', field: 'status.nombre' },
    { title: 'Programacion', field: 'status.nombre' },
    { title: 'Tipo Cita', field: 'tipo_cita.nombre' },
    { title: 'Estado', field: 'status.nombre' },
    { title: 'Sucursal', field: 'sucursal.nombre' },
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
      backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
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
      } setIsLoading(false);
    }

    loadHistorial();
  }, [paciente, servicio]);

  return (
    <Fragment>
      {
        !isLoading ?
          <Laser
            open={open}
            onClickCancel={onClose}
            historial={historial}
            columns={columns}
            options={options}
            sucursal={sucursal}
            titulo={''} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>
  );
}

export default TabLaser;