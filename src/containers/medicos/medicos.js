import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import ModalPaciente from '../../components/modal_paciente';
import ModHistorico from '../../components/modal_historico';
import { ButtonCustom } from '../../components/basic/ButtonCustom';

const useStyles = makeStyles(theme => ({
	button: {
		color: '#FFFFFF'
	}
}));

export const MedicosContainer = (props) => {

  const classes = useStyles();

  const {
    titulo,
    columns,
    medicos,
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

      <TableComponent
        titulo={titulo}
        columns={columns}
        data={medicos}
        actions={actions}
        options={options} />
    </Fragment>
  );
}
