import React, { useState, useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import ModalFormImprimirCorte from './ModalFormImprimirCorte';
import {
  showAllTipoIngresos,
  showAllTipoEgresos,
  showAllMetodoPago,
} from '../../../../services';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirCorte = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    dataIngresos,
    dataPagosAnticipados,
    dataEgresos,
    corte,
    empleado,
  } = props;

  const [show, setShow] = useState(true);
  const [tipoIngresos, setTipoIngresos] = useState([]);
  const [tipoEgresos, setTipoEgresos] = useState([]);
  const [formaPagos, setMetodoPagos] = useState([]);

  const handleClickImprimir = (e) => {
    setTimeout(() => {
      window.print();
    }, 500);
    setTimeout(() => { onClose(); }, 550);
  }

  useEffect(() => {

    const loadTipoIngreso = async () => {
      const response = await showAllTipoIngresos();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoIngresos(response.data);
      }
    }

    const loadTipoEgreso = async () => {
      const response = await showAllTipoEgresos();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTipoEgresos(response.data);
      }
    }

    const loadMetodoPago = async () => {
      const response = await showAllMetodoPago();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setMetodoPagos(response.data);
      }
    }

    loadTipoIngreso();
    loadTipoEgreso();
    loadMetodoPago();
    handleClickImprimir();
  }, []);

  return (
    <Fragment>
      <ModalFormImprimirCorte
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={onClose}
        corte={corte}
        empleado={empleado}
        onClickImprimir={handleClickImprimir}
        show={show}
        tipoIngresos={tipoIngresos}
        tipoEgresos={tipoEgresos}
        formaPagos={formaPagos}
        dataIngresos={dataIngresos}
        dataPagosAnticipados={dataPagosAnticipados}
        dataEgresos={dataEgresos} />
    </Fragment>

  );
}

export default ModalImprimirCorte;