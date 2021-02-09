import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import MenuHistoricos from '../../../components/modales/modal_historico';
import { baseUrl } from '../../../services';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF'
  }
}));

export const PacientesCosmetologasContainer = (props) => {

  const classes = useStyles();

  const {
    titulo,
    columns,
    paciente,
    actions,
    options,
    openHistoric,
    handleClose,
  } = props;

  const pacientes = query =>
    new Promise((resolve, reject) => {
      const url = `${baseUrl}/paciente/remote?per_page=${query.pageSize}&page=${query.page + 1}&search=${query.search}`
      fetch(url)
        .then(response => response.json())
        .then(result => {
          resolve({
            data: result.data,
            page: result.page - 1,
            totalCount: result.total,
          })
        })
    });

  return (
    <Fragment>
      {
        openHistoric ?
          <MenuHistoricos
            open={openHistoric}
            onClose={handleClose}
            paciente={paciente} /> : ''
      }

      <TableComponent
        titulo={titulo}
        columns={columns}
        data={pacientes}
        actions={actions}
        options={options} />
    </Fragment>
  );
}
