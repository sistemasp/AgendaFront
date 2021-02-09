import React, { Fragment } from 'react';
import TableComponent from '../../../components/table/TableComponent';
import { makeStyles, Grid } from '@material-ui/core';
import ModalConsultorio from '../../../components/modales/modal_consultorio';
import ModalConsultorioAgregarDermatologo from '../../../components/modales/modal_consultorio_agregar_dermatologo';
import ModalCabina from '../../../components/modales/modal_cabina';
import ModalSalaCirugia from '../../../components/modales/modal_sala_cirugia';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF'
  }
}));

export const ConsultorioContainer = (props) => {

  const classes = useStyles();

  const {
    tituloConsultorio,
    tituloCabina,
    columnsConsultorio,
    columnsCabina,
    consultorios,
    consultorio,
    cabinas,
    cabina,
    tituloSalaCirugia,
    columnsSalaCirugia,
    salaCirugias,
    salaCirugia,
    actionsSalaCirugia,
    actionsConsultorio,
    actionsCabina,
    options,
    openModalConsultorio,
    openModalCabina,
    openModalSalaCirugia,
    handleOpenConsultorio,
    handleOpenCabina,
    handleOpenSalaCirugia,
    handleClose,
    handleClickGuardarConsultorio,
    handleClickGuardarCabina,
    handleClickGuardarSalaCirugia,
    openModalAsignar,
    setOpenAlert,
    setMessage,
    loadConsultorios,
  } = props;

  return (
    <Fragment>
      {
        openModalConsultorio ?
          <ModalConsultorio
            open={openModalConsultorio}
            onClose={handleClose}
            consultorio={consultorio}
            handleClickGuardar={handleClickGuardarConsultorio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage} /> : ''
      }
      {
        openModalCabina ?
          <ModalCabina
            open={openModalCabina}
            onClose={handleClose}
            cabina={cabina}
            handleClickGuardar={handleClickGuardarCabina}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage} /> : ''
      }
      {
        openModalSalaCirugia ?
          <ModalSalaCirugia
            open={openModalSalaCirugia}
            onClose={handleClose}
            salaCirugia={salaCirugia}
            handleClickGuardar={handleClickGuardarSalaCirugia}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage} /> : ''
      }
      {
        openModalAsignar ?
          <ModalConsultorioAgregarDermatologo
            open={openModalAsignar}
            onClose={handleClose}
            consultorio={consultorio}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            loadConsultorios={loadConsultorios} /> : ''
      }

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpenConsultorio}
            text='Nuevo Consultorio' />

          <TableComponent
            titulo={tituloConsultorio}
            columns={columnsConsultorio}
            data={consultorios}
            actions={actionsConsultorio}
            options={options} />
        </Grid>

        <Grid item xs={12} sm={4}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpenCabina}
            text='Nueva Cabina' />

          <TableComponent
            titulo={tituloCabina}
            columns={columnsCabina}
            data={cabinas}
            actions={actionsCabina}
            options={options} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpenSalaCirugia}
            text='Nueva Sala de cirugia' />

          <TableComponent
            titulo={tituloSalaCirugia}
            columns={columnsSalaCirugia}
            data={salaCirugias}
            actions={actionsSalaCirugia}
            options={options} />
        </Grid>
      </Grid>

    </Fragment >
  );
}
