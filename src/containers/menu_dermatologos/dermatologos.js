import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import ModalPaciente from '../../components/modales/modal_paciente';
import ModHistorico from '../../components/modales/modal_historico';
import ModalImprimirPagoDermatologo from '../../components/modales/imprimir/pago_dermatologo';

export const DermatologosContainer = (props) => {

  const {
    titulo,
    columns,
    dermatologos,
    dermatologo,
    actions,
    options,
    openPagoDermatologo,
    openHistoric,
    handleOpen,
    handleClose,
    sucursal,
    empleado,
  } = props;

  return (
    <Fragment>
      {
        openPagoDermatologo ? 
        <ModalImprimirPagoDermatologo
          open={openPagoDermatologo}
          onClose={handleClose}
          dermatologo={dermatologo}
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
        data={dermatologos}
        actions={actions}
        options={options} />
    </Fragment>
  );
}
