import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import ModalFormImprimirCirugia from './ModalFormImprimirCirugia';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirCirugia = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    datos,
    servicio,
  } = props;

  const [show, setShow] = useState(true);

  const handleClickImprimir = (e) => {

    setShow(false);
    setTimeout(() => { 
      window.print(); 
    }, 0);
    setTimeout(() => { setShow(true); }, 15);
  }

  return (
    <Fragment>
      <ModalFormImprimirCirugia
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={onClose}
        datos={datos}
        servicio={servicio}
        onClickImprimir={handleClickImprimir}
        show={show} />
    </Fragment>

  );
}

export default ModalImprimirCirugia;