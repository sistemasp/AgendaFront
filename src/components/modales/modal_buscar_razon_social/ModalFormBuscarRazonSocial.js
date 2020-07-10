import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import TableComponent from '../../table/TableComponent';
import { ButtonCustom } from '../../basic/ButtonCustom';
import ModalUsoCfdi from '../modal_uso_cfdi';
import ModalRazonSocial from '../modal_razon_social';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: "95%",
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  },
}));

const ModalFormBuscarRazonSocial = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    open,
    onClose,
    titulo,
    columns,
    razonSociales,
    actions,
    options,
    factura,
    openModalUsoCfdi,
    onCloseUsoCfdi,
    pago,
    handleOpenNuevaRazonSocial,
    openNuevaRazonSocial,
    loadRazonSocial,
    handleCloseNuevaRazonSocial,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          {
            openModalUsoCfdi ?
              <ModalUsoCfdi
                open={openModalUsoCfdi}
                onClose={onCloseUsoCfdi}
                factura={factura}
                pago={pago}
                closeRazonSocial={onClose}
              /> : ''
          }
          {
            openNuevaRazonSocial ?
              <ModalRazonSocial
                open={openNuevaRazonSocial}
                onClose={handleCloseNuevaRazonSocial}
                razonSocial={{}}
                loadRazonSocial={loadRazonSocial} /> : ''
          }
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpenNuevaRazonSocial}
            text='Nuevo razon social' />

          <TableComponent
            titulo={titulo}
            columns={columns}
            data={razonSociales}
            actions={actions}
            options={options} />

          <ButtonCustom
            className={classes.button}
            color="secondary"
            variant="contained"
            onClick={onClose}
            text='Cancelar' />
        </div>
      </Modal>
    </div >
  );
}

export default ModalFormBuscarRazonSocial;