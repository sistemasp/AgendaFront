import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import ModalPaciente from '../../components/modales/modal_paciente';
import ModHistorico from '../../components/modales/modal_historico';
import { ButtonCustom } from '../../components/basic/ButtonCustom';
import ModalRazonSocial from '../../components/modales/modal_razon_social';

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
    onClickGuardar,
    onClickGuardarAgendar
  } = props;

  return (
    <Fragment>
      {
        open ? 
        <ModalRazonSocial
          open={open}
          onClose={handleClose}
          razonSocial={razonSocial}
          onClickGuardar={onClickGuardar}
          onClickGuardarAgendar={onClickGuardarAgendar} /> : ''
      }
      {
        openHistoric ? 
        <ModHistorico
          open={openHistoric}
          onClose={handleClose}
          paciente={razonSocial} /> : ''
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
