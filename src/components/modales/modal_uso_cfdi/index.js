import React, { useState, useEffect, Fragment } from 'react';
import ModalFormUsoCfdi from './ModalFormUsoCfdi';
import { showAllUsoCfdis, createFactura, updatePago } from '../../../services';
import { Formik } from 'formik';
import { Snackbar, Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}));

const ModalUsoCfdi = (props) => {

  const classes = useStyles();

  const [usoCfdis, setUsoCfdis] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    open,
    onClose,
    factura,
    pago,
  } = props;


  const handleGenerarFactura = async(event, rowData) => {
    const response = await createFactura(rowData);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
      pago.factura = true;
      await updatePago(pago._id, pago);
    }
    onClose();
  }

  useEffect(() => {
    const loadUsoCfdi = async () => {
      const response = await showAllUsoCfdis();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setUsoCfdis(response.data);
      }
      setIsLoading(false);
    }

    loadUsoCfdi();
    setIsLoading(false);
  }, []);

  const handleChangeUsoCfdi = (event) => {
    factura.uso_cfdi = event.target.value;
  }
  console.log(factura);

  return (
    <Fragment>
      {
        !isLoading ?
          <Formik
            enableReinitialize
            initialValues={factura} >
            {
              props => <ModalFormUsoCfdi
                open={open}
                onClose={onClose}
                usoCfdis={usoCfdis}
                //factura={factura}
                onChangeUsoCfdi={(event) => handleChangeUsoCfdi(event)}
                onGenerarFactura={handleGenerarFactura}
                {...props} />
            }
          </Formik> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalUsoCfdi;