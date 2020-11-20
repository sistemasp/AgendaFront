import React, { useState, useEffect, Fragment } from 'react';
import { findBiopsiasHistoricByPaciente } from "../../../../services";
import Biopsias from './Biopsias';
import { toFormatterCurrency, addZero } from '../../../../utils/utils';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const TabBiopsias = (props) => {

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
    { title: 'Consecutivo', field: 'consecutivo' },
    { title: 'Dermatologo', field: 'dermatologo.nombre' },
    { title: 'Patologo', field: 'patoloo.nombre' },
    { title: 'Sucursal', field: 'sucursal.nombre' },
    { title: 'Fecha entrega', field: 'precio_moneda' },
    { title: 'Quien entrega', field: 'precio_moneda' },
    { title: 'Fecha resultado', field: 'precio_moneda' },
    { title: 'Quien recibe', field: 'precio_moneda' },
    { title: 'Diagnostico', field: 'precio_moneda' },
    { title: 'A quien se entrega', field: 'precio_moneda' },
    { title: 'Fecha entrega', field: 'precio_moneda' },
    { title: 'Quien entrega', field: 'precio_moneda' },
  ];

  const options = {
    headerStyle: {
      backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    }
  }

  useEffect(() => {
    const loadHistorial = async () => {
      if (servicio) {
        const response = await findBiopsiasHistoricByPaciente(paciente._id);
        if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
          response.data.forEach(item => {
            item.precio_moneda = toFormatterCurrency(item.precio);
            const date = new Date(item.fecha_realizacion);
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
      setIsLoading(false);
    }

    loadHistorial();
  }, [paciente, servicio]);

  return (
    <Fragment>
      {
        !isLoading ?
          <Biopsias
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

export default TabBiopsias;