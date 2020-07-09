import React, { useState, useEffect, Fragment } from 'react';
import ModalFormBuscarRazonSocial from './ModalFormBuscarRazonSocial';
import { sepomexGetEstados, sepomexGetMunicipos, sepomexGetColonia, sepomexGetAllInfoByCP, createRazonSocial, updateRazonSocial, showAllRazonSocials } from '../../../services';
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

const ModalBuscarRazonSocial = (props) => {

  const classes = useStyles();

  const [razonSociales, setRazonSociales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [factura, setFactura] = useState();
  const [openModalUsoCfdi, setOpenModalUsoCfdi] = useState(false);
  const [openNuevaRazonSocial, setOpenNuevaRazonSocial] = useState(false);

  const {
    open,
    onClose,
    pago,
  } = props;

  const columns = [
    { title: 'Nombre completo', field: 'nombre_completo' },
    { title: 'RFC', field: 'rfc' },
    { title: 'Email', field: 'email' },
    { title: 'domicilio', field: 'domicilio_completo' },
    { title: 'Codigo postal', field: 'codigo_postal' },
    { title: 'Colonia', field: 'colonia' },
    { title: 'Telefono', field: 'telefono' },
  ];

  const options = {
    headerStyle: {
      backgroundColor: '#2BA6C6',
      color: '#FFF',
      fontWeight: 'bolder',
      fontSize: '18px'
    },
    exportAllData: true,
    exportButton: false,
    exportDelimiter: ';'
  }

  const hanldeSelectRazonSocial = (event, rowData) => {
    const factura = {
      paciente: pago.paciente._id,
      razon_social: rowData._id,
      pago: pago._id,
      metodo_pago: pago.metodo_pago._id,
      ultimos_4_digitos: pago.digitos,
      cantidad: pago.cantidad, // REVISAR SI ES CANTIDAD O TOTAL
    }
    setFactura(factura);
    setOpenModalUsoCfdi(true);
  }

  const actions = [
    {
      icon: CheckIcon,
      tooltip: 'Seleccionar',
      onClick: hanldeSelectRazonSocial
    }
  ];

  useEffect(() => {
    const loadRazonSocial = async () => {
      const response = await showAllRazonSocials();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        await response.data.forEach(item => {
          item.domicilio_completo = `${item.domicilio} #${item.numero}`;
        });
        setRazonSociales(response.data);
      }
      setIsLoading(false);
    }
    setIsLoading(true);
    loadRazonSocial();
  }, []);

  const loadRazonSocial = async () => {
    const response = await showAllRazonSocials();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      await response.data.forEach(item => {
        item.domicilio_completo = `${item.domicilio} #${item.numero}`;
      });
      setRazonSociales(response.data);
    }
    setIsLoading(false);
  }

  const handleCloseUsoCfdi = () => {
    setOpenModalUsoCfdi(false);
  }

  const handleOpenNuevaRazonSocial = () => {
    setOpenNuevaRazonSocial(true);
  }

  const handleCloseNuevaRazonSocial = () => {
    setOpenNuevaRazonSocial(false);
  }

  return (
    <Fragment>
      {
        !isLoading ?
          <ModalFormBuscarRazonSocial
            open={open}
            onClose={onClose}
            razonSociales={razonSociales}
            columns={columns}
            titulo='Razon social'
            actions={actions}
            options={options}
            factura={factura}
            openModalUsoCfdi={openModalUsoCfdi}
            onCloseUsoCfdi={handleCloseUsoCfdi}
            handleOpenNuevaRazonSocial={handleOpenNuevaRazonSocial}
            handleCloseNuevaRazonSocial={handleCloseNuevaRazonSocial}
            openNuevaRazonSocial={openNuevaRazonSocial}
            pago={pago}
            loadRazonSocial={loadRazonSocial} /> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalBuscarRazonSocial;