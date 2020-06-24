import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import ModalPaciente from '../../components/modal_paciente';
import ModHistorico from '../../components/modal_historico';
import { ButtonCustom } from '../../components/basic/ButtonCustom';
import ModalFormConsultorio from '../../components/modal_consultorio/ModalFormConsultorio';
import ModalConsultorio from '../../components/modal_consultorio';
import ModalConsultorioAgregarPaciente from '../../components/modal_consultorio_agregar_paciente';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF'
  }
}));

export const ListaEsperaContainer = (props) => {

  const classes = useStyles();

  const {
    tituloConsultorios,
    tituloEspera,
    columnsConsultorios,
    columnsEspera,
    consultorios,
    listaEspera,
    consulta,
    optionsEspera,
    optionsConsultorio,
    actionsEspera,
    actionsConsultorio,
    openModalAsignar,
    handleClose,
    setOpenAlert,
    setMessage,
    loadListaEspera,
    loadConsultorios,
    sucursal,
  } = props;

  return (
    <Fragment>

      {
        openModalAsignar ?
          <ModalConsultorioAgregarPaciente
            open={openModalAsignar}
            onClose={handleClose}
            consulta={consulta}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadListaEspera={loadListaEspera}
            loadConsultorios={loadConsultorios}
            sucursal={sucursal} /> : ''
      }
      <TableComponent
        titulo={tituloConsultorios}
        columns={columnsConsultorios}
        data={consultorios}
        actions={actionsConsultorio}
        options={optionsConsultorio} />

      <TableComponent
        titulo={tituloEspera}
        columns={columnsEspera}
        data={listaEspera}
        actions={actionsEspera}
        options={optionsEspera} />
    </Fragment>
  );
}
