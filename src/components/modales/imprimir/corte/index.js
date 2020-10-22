import React, { useState, useEffect, Fragment } from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../../utils/utils';
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
    dataEgresos,
    corte,
  } = props;

  const [show, setShow] = useState(true);
  const [tipoIngresos, setTipoIngresos] = useState([]);
  const [tipoEgresos, setTipoEgresos] = useState([]);
  const [metodoPagos, setMetodoPagos] = useState([]);

  const handleClickImprimir = (e) => {

    setShow(false);
    setTimeout(() => {
      window.print();
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
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
  }, []);

  return (
    <Fragment>
      <ModalFormImprimirCorte
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={onClose}
        corte={corte}
        onClickImprimir={handleClickImprimir}
        show={show}
        tipoIngresos={tipoIngresos}
        tipoEgresos={tipoEgresos}
        metodoPagos={metodoPagos}
        dataIngresos={dataIngresos}
        dataEgresos={dataEgresos} />
    </Fragment>

  );
}

export default ModalImprimirCorte;