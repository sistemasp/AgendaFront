import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import ModalPaciente from '../../components/modal_paciente';
import ModHistorico from '../../components/modal_historico';
import { ButtonCustom } from '../../components/basic/ButtonCustom';
import ModalFormConsultorio from '../../components/modal_consultorio/ModalFormConsultorio';
import ModalConsultorio from '../../components/modal_consultorio';

const useStyles = makeStyles(theme => ({
	button: {
		color: '#FFFFFF'
	}
}));

export const ListaEsperaContainer = (props) => {

  const classes = useStyles();

  const {
    titulo,
    columns,
    consultorios,
    consultorio,
    actions,
    options,
    openModal,
    handleOpen,
    onClickGuardar,
    handleClickGuardar,
  } = props;

  return (
    <Fragment>
        
      <TableComponent
        titulo={titulo}
        columns={columns}
        data={consultorios}
        actions={actions}
        options={options} />
    </Fragment>
  );
}
