import React, { Fragment } from 'react';
import TableComponent from '../../components/table/TableComponent';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import ModalConsultorioAgregarPaciente from '../../components/modales/modal_consultorio_agregar_paciente';
import ModalCabinaAgregarPaciente from '../../components/modales/modal_cabina_agregar_paciente';
import ModalCirugiaAgregarPaciente from '../../components/modales/modal_cirugia_agregar_paciente';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF'
  },
  formControl: {
    width: '100%',
    margin: '5px',
  },
}));

export const ListaEsperaContainer = (props) => {

  const classes = useStyles();

  const {
    tituloConsultorios,
    tituloCabinas,
    tituloEsperaConsultas,
    tituloEsperaTratamientos,
    columnsConsultorios,
    columnsCabinas,
    columnsEspera,
    consultorios,
    cabinas,
    listaEsperaConsultas,
    listaEsperaTratamientos,
    listaEsperaCirugias,
    optionsEspera,
    optionsConsultorio,
    actionsEsperaConsultorio,
    actionsEsperaCabina,
    actionsConsultorio,
    actionsCabina,
    openModalConsultorioAsignar,
    openModalCabinaAsignar,
    openModalSalaCirugiaAsignar,
    tipo_servicio,
    servicio,
    handleClose,
    setOpenAlert,
    setMessage,
    loadAll,
    sucursal,
    cambio,
    paciente,
    tituloSalaCirugia,
    columnsSalaCirugias,
    salaCirugias,
    actionsSalaCirugia,
    tituloEsperaSalaCirugia,
    listaEsperaSalaCirugia,
    actionsEsperaSalaCirugia,
    componentsConsultorio,
  } = props;

  return (
    <Fragment>
      {
        openModalConsultorioAsignar ?
          <ModalConsultorioAgregarPaciente
            open={openModalConsultorioAsignar}
            onClose={handleClose}
            tipo_servicio={tipo_servicio}
            servicio={servicio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadAll={loadAll}
            sucursal={sucursal}
            cambio={cambio}
            paciente={paciente} /> : ''
      }

      {
        openModalCabinaAsignar ?
          <ModalCabinaAgregarPaciente
            open={openModalCabinaAsignar}
            onClose={handleClose}
            tipo_servicio={tipo_servicio}
            servicio={servicio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadAll={loadAll}
            sucursal={sucursal}
            cambio={cambio}
            paciente={paciente} />
          : ''
      }

      {
        openModalSalaCirugiaAsignar ?
          <ModalCirugiaAgregarPaciente
            open={openModalSalaCirugiaAsignar}
            onClose={handleClose}
            tipo_servicio={tipo_servicio}
            servicio={servicio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadAll={loadAll}
            sucursal={sucursal}
            cambio={cambio}
            paciente={paciente} />
          : ''
      }

      <h1>LISTA DE ESPERA</h1>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TableComponent
            titulo={tituloConsultorios}
            columns={columnsConsultorios}
            data={consultorios}
            actions={actionsConsultorio}
            options={optionsConsultorio} />

          <br />

          <TableComponent
            titulo={tituloEsperaConsultas}
            columns={columnsEspera}
            data={listaEsperaConsultas}
            actions={actionsEsperaConsultorio}
            options={optionsEspera} />

        </Grid>
        <Grid item xs={12} sm={4}>
          <TableComponent
            titulo={tituloCabinas}
            columns={columnsCabinas}
            data={cabinas}
            actions={actionsCabina}
            options={optionsConsultorio} />

          <br />

          <TableComponent
            titulo={tituloEsperaTratamientos}
            columns={columnsEspera}
            data={listaEsperaTratamientos}
            actions={actionsEsperaCabina}
            options={optionsEspera} />

        </Grid>
        <Grid item xs={12} sm={4}>
          <TableComponent
            titulo={tituloSalaCirugia}
            columns={columnsSalaCirugias}
            data={salaCirugias}
            actions={actionsSalaCirugia}
            options={optionsConsultorio} />

          <br />

          <TableComponent
            titulo={tituloEsperaSalaCirugia}
            columns={columnsEspera}
            data={listaEsperaCirugias}
            actions={actionsEsperaSalaCirugia}
            options={optionsEspera} />

        </Grid>
      </Grid>

    </Fragment>
  );
}
