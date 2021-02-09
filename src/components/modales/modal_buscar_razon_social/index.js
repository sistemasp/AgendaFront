import React, { useState, useEffect, Fragment } from 'react';
import ModalFormBuscarRazonSocial from './ModalFormBuscarRazonSocial';
import { showAllRazonSocials } from '../../../services/razones_sociales';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
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
    servicio,
  } = props;

  const columns = [
    { title: 'NOMBRE COMPLETO', field: 'nombre_completo' },
    { title: 'RFC', field: 'rfc' },
    { title: 'EMAIL', field: 'email' },
    { title: 'DOMICILIO', field: 'domicilio_completo' },
    { title: 'CÓDIGO POSTAL', field: 'codigo_postal' },
    { title: 'COLONIA', field: 'colonia' },
    { title: 'TELÉFONO', field: 'telefono' },
  ];

  const options = {
    headerStyle: {
      backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
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
      paciente: servicio.paciente._id,
      razon_social: rowData._id,
      sucursal: servicio.sucursal,
      tipo_servicio: servicio.servicio._id,
      servicio: servicio._id,
    }
    setFactura(factura);
    setOpenModalUsoCfdi(true);
  }

  const actions = [
    {
      icon: CheckIcon,
      tooltip: 'SELECCIONAR',
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
            titulo='RAZON SOCIAL'
            actions={actions}
            options={options}
            factura={factura}
            servicio={servicio}
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