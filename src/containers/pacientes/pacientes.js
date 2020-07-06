import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import ModalPaciente from '../../components/modales/modal_paciente';
import ModHistorico from '../../components/modales/modal_historico';
import { ButtonCustom } from '../../components/basic/ButtonCustom';

const useStyles = makeStyles(theme => ({
	button: {
		color: '#FFFFFF'
	}
}));

export const PacientesContainer = (props) => {

  const classes = useStyles();

  const {
    titulo,
    columns,
    pacientes,
    paciente,
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
        <ModalPaciente
          open={open}
          onClose={handleClose}
          paciente={paciente}
          onClickGuardar={onClickGuardar}
          onClickGuardarAgendar={onClickGuardarAgendar} /> : ''
      }
      {
        openHistoric ? 
        <ModHistorico
          open={openHistoric}
          onClose={handleClose}
          paciente={paciente} /> : ''
      }

      <ButtonCustom 
        className={classes.button}
        color="primary"
        variant="contained"
        onClick={handleOpen}
        text='Nuevo Paciente' />
        
      <TableComponent
        titulo={titulo}
        columns={columns}
        data={pacientes}
        actions={actions}
        options={options} />
    </Fragment>
  );
}
