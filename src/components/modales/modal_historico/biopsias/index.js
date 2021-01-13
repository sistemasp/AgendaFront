import React, { useState, useEffect, Fragment } from 'react';
import Biopsias from './Biopsias';
import { toFormatterCurrency, addZero } from '../../../../utils/utils';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { findBiopsiasHistoricByPaciente } from '../../../../services/biopsias';

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
    { title: 'FECHA', field: 'fecha_show' },
    { title: 'HORA', field: 'hora' },
    { title: 'DERMATÓLOGO', field: 'dermatologo.nombre' },
    { title: 'PATÓLOGO', field: 'patoloo.nombre' },
    { title: 'SUCURSAL', field: 'sucursal.nombre' },
    { title: 'FECHA ENTREGA', field: 'precio_moneda' },
    { title: 'QUIEN ENTREGA', field: 'precio_moneda' },
    { title: 'FECHA RESULTADO', field: 'precio_moneda' },
    { title: 'QUIEN RECIBE', field: 'precio_moneda' },
    { title: 'DIAGNÓSTICO', field: 'precio_moneda' },
    { title: 'A QUIEN SE ENTREGA', field: 'precio_moneda' },
    { title: 'FECHA ENTREGA', field: 'precio_moneda' },
    { title: 'QUIEN ENTREGA', field: 'precio_moneda' },
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