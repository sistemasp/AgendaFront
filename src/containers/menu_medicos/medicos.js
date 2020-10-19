import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import ModalPaciente from '../../components/modales/modal_paciente';
import ModHistorico from '../../components/modales/modal_historico';
import ModalImprimirPagoMedico from '../../components/modales/imprimir/pago_medico';

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
    medico,
    actions,
    options,
    openPagoMedico,
    openHistoric,
    handleOpen,
    handleClose,
    sucursal,
    empleado,
  } = props;

  return (
    <Fragment>
      {
        openPagoMedico ? 
        <ModalImprimirPagoMedico
          open={openPagoMedico}
          onClose={handleClose}
          medico={medico}
          sucursal={sucursal}
          empleado={empleado} /> : ''
      }
      {
        openHistoric ? 
        <ModHistorico
          open={openHistoric}
          onClose={handleClose} /> : ''
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
