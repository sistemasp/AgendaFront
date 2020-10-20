import React, { Fragment } from 'react';

import TableComponent from '../../components/table/TableComponent';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { ButtonCustom } from '../../components/basic/ButtonCustom';
import ModalConsultorio from '../../components/modales/modal_consultorio';
import ModalNuevoIngreso from '../../components/modales/modal_nuevo_ingreso';
import ModalNuevoEgreso from '../../components/modales/modal_nuevo_egreso';
import { toFormatterCurrency } from '../../utils/utils';

const useStyles = makeStyles(theme => ({
  button: {
    color: '#FFFFFF',
    width: '100%',
    fontSize: '32px',
  },
  label_positivo: {
    color: '#42C58F',
    fontSize: '45px',
  },
  label_negativo: {
    color: '#E13838',
    fontSize: '45px',
  },
}));

export const CorteContainer = (props) => {

  const classes = useStyles();

  const {
    tituloIngreso,
    tituloEgreso,
    columnsIngreso,
    columnsEgreso,
    dataIngresos,
    dataEgresos,
    options,
    openModal,
    handleOpen,
    handleClose,
    handleClickGuardar,
    turno,
    onCambioTurno,
    onObtenerInformacion,
    openModalNuevoIngreso,
    openModalNuevoEgreso,
    handleOpenNuevoIngreso,
    handleOpenNuevoEgreso,
    sucursal,
    empleado,
    setOpenAlert,
    setMessage,
    setSeverity,
    detailPanelIngreso,
    detailPanelEgreso,
  } = props;

  let totalIngresos = 0;
  let totalEgresos = 0;
  let totalEfectivo = 0;

  dataIngresos.forEach(data => {
    if (data.metodo_pago === 'EFECTIVO') {
      totalEfectivo = data.total;
    }
    totalIngresos += Number(data.total);
  });

  dataEgresos.forEach(data => {
    totalEgresos += Number(data.total);
  });

  return (
    <Fragment>
      {
        openModalNuevoIngreso ?
          <ModalNuevoIngreso
            open={openModalNuevoIngreso}
            onClose={handleClose}
            handleClickGuardar={handleClickGuardar}
            sucursal={sucursal}
            empleado={empleado}
            onObtenerInformacion={onObtenerInformacion}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setSeverity={setSeverity} /> : ''
      }

      {
        openModalNuevoEgreso ?
          <ModalNuevoEgreso
            open={openModalNuevoEgreso}
            onClose={handleClose}
            handleClickGuardar={handleClickGuardar}
            sucursal={sucursal}
            empleado={empleado}
            onObtenerInformacion={onObtenerInformacion}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setSeverity={setSeverity} /> : ''
      }

      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.label}>
          <h2 className={classes.labelItemCenter}>CORTE DEL TURNO: {turno === 'm' ? 'MATUTINO' : 'VESPERTINO'}</h2>
        </Grid>
        <Grid item xs={4} className={classes.label}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={onCambioTurno}
            text='Cambio turno' />
        </Grid>
        <Grid item xs={4} className={classes.label}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={onObtenerInformacion}
            text='Traer información' />
        </Grid>
        <Grid item xs={4} className={classes.label}>
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpen}
            text='Generar corte' />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TableComponent
            titulo={tituloIngreso}
            columns={columnsIngreso}
            data={dataIngresos}
            options={options}
            detailPanel={detailPanelIngreso} />
        </Grid>
        <Grid container xs={4} className={classes.label}>
          <Grid item xs={12} sm={12}>
            <ButtonCustom
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleOpenNuevoIngreso}
              text='Agregar Ingreso' />
          </Grid>
          <Grid item sm={12}>
            <h1>TOTAL INGRESOS</h1>
          </Grid>
          <Grid item sm={12}>
            <h1>{toFormatterCurrency(totalIngresos)}</h1>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TableComponent
            titulo={tituloEgreso}
            columns={columnsEgreso}
            data={dataEgresos}
            options={options}
            detailPanel={detailPanelEgreso} />
        </Grid>
        <Grid container xs={4} className={classes.label}>
          <Grid item xs={12} sm={12}>
            <ButtonCustom
              className={classes.button}
              color="primary"
              variant="contained"
              onClick={handleOpenNuevoEgreso}
              text='Agregar Egreso' />
          </Grid>
          <Grid item sm={12}>
            <h1>TOTAL EGRESOS</h1>
          </Grid>
          <Grid item sm={12}>
            <h1>{toFormatterCurrency(totalEgresos)}</h1>
          </Grid>
        </Grid>
        <Grid item sm={8}>
          <h1 className={totalEfectivo > totalEgresos ? classes.label_positivo : classes.label_negativo } >EFECTIVO EN CAJA: {toFormatterCurrency(Number(totalEfectivo) - Number(totalEgresos))}</h1>
        </Grid>
        <Grid item sm={4}>
          <h1 className={totalIngresos > totalEgresos ? classes.label_positivo : classes.label_negativo }>BALANCE: {toFormatterCurrency(Number(totalIngresos) - Number(totalEgresos))}</h1>
        </Grid>
      </Grid>

    </Fragment>
  );
}