import React, { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import ModalFormImprimirDermapen from './ModalFormImprimirDermapen';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ModalImprimirDermapen = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    datos,
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
      <ModalFormImprimirDermapen
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={onClose}
        datos={datos}
        onClickImprimir={handleClickImprimir}
        show={show} />
    </Fragment>

  );
}

export default ModalImprimirDermapen;