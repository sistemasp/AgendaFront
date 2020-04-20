import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { Button } from '@material-ui/core';
import ModalPaciente from '../../components/modal_paciente';
import ModHistorico from '../../components/modal_historico';

export const PacientesContainer = (props) => {

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
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen} >
        Nuevo Paciente
      </Button>
      <TableComponent
        titulo={titulo}
        columns={columns}
        data={pacientes}
        actions={actions}
        options={options} />
    </Fragment>
  );
}
