import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalRazonSocial from '../../../components/modales/modal_razon_social';
import ModHistoricoFacturas from '../../../components/modales/historicos/facturas';

const useStyles = makeStyles(theme => ({
	button: {
		color: '#FFFFFF'
	}
}));

export const RazonSocialContainer = (props) => {

  const classes = useStyles();

  const {
    titulo,
    columns,
    razonSociales,
    razonSocial,
    actions,
    options,
    open,
    openHistoric,
    handleOpen,
    handleClose,
    loadRazonSocial,
  } = props;

  return (
    <Fragment>
      {
        open ? 
        <ModalRazonSocial
          open={open}
          onClose={handleClose}
          razonSocial={razonSocial}
          loadRazonSocial={loadRazonSocial} /> : ''
      }
      {
        openHistoric ? 
        <ModHistoricoFacturas
          open={openHistoric}
          onClose={handleClose}
          razonSocial={razonSocial} /> : ''
      }

      <ButtonCustom 
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleOpen}
        text='Nuevo razon social' />
        
      <TableComponent
        titulo={titulo}
        columns={columns}
        data={razonSociales}
        actions={actions}
        options={options} />
    </Fragment>
  );
}
