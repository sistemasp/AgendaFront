import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Paper, Button, TextField, Checkbox, FormControlLabel } from '@material-ui/core';
import TableComponent from '../../components/table/TableComponent';
import ModalConsulta from '../../components/modales/modal_consulta';
import { green } from '@material-ui/core/colors';
import ModalPagos from '../../components/modales/modal_pagos';
import ModalImprimirConsulta from '../../components/modales/imprimir/consulta';

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    width: '100%',
  }
}));

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export const AgendarCirugiaContainer = (props) => {

  const classes = useStyles();

  const {
    values,
    errors,
    servicios,
    tratamientos,
    horarios,
    onChangeServicio,
    onChangeTratamientos,
    onChangeFecha,
    onChangeHora,
    onChangeFilterDate,
    filterDate,
    paciente,
    onClickAgendar,
    isValid,
    isSubmitting,
    onChangePrecio,
    empleado,
    medicos,
    tipoCitas,
    promovendedores,
    onChangeMedicos,
    onChangePromovendedor,
    onChangeObservaciones,
    onChangePagado,
    // TABLE DATES PROPERTIES
    titulo,
    columns,
    citas,
    actions,
    options,
    // MODALS PROPERTIES
    openModal,
    cita,
    onClickActualizarCita,
    onClickCancel,
    onChangeTipoCita,
    onChangeAsistio,
    loadConsultas,
    sucursal,
    setMessage,
    setOpenAlert,
    setFilterDate,
    OnCloseVerPagos,
    openModalPagos,
    openModalImprimirConsultas,
    datosImpresion,
    onCloseImprimirConsulta,
  } = props;

  return (
    <Fragment>
      {
        openModal ?
          <ModalConsulta
            open={openModal}
            cita={cita}
            onClickActualizarCita={onClickActualizarCita}
            onClose={onClickCancel}
            onChangeServicio={onChangeServicio}
            onChangeTratamientos={onChangeTratamientos}
            onChangeFecha={onChangeFecha}
            onChangeHora={onChangeHora}
            onChangeTipoCita={onChangeTipoCita}
            onChangeAsistio={onChangeAsistio}
            servicios={servicios}
            tratamientos={tratamientos}
            horarios={horarios}
            empleado={empleado}
            sucursal={sucursal}
            loadConsultas={loadConsultas}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setFilterDate={setFilterDate}
          /> : ''
      }
      {
        openModalPagos ?
          <ModalPagos
            open={openModalPagos}
            onClose={OnCloseVerPagos}
            cita={cita}
            empleado={empleado}
            sucursal={sucursal}
            setMessage={setMessage}
            setOpenAlert={setOpenAlert} />
          : ''
      }
      {
        openModalImprimirConsultas ?
          <ModalImprimirConsulta
            open={openModalImprimirConsultas}
            onClose={onCloseImprimirConsulta}
            datos={datosImpresion} />
          : ''
      }
      <Paper>
        <h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'Selecciona un paciente'}</h1>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid
                container
                justify="center"
                alignItems="center" >
                <KeyboardDatePicker
                  disableToolbar
                  //disablePast
                  autoOk
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Fecha"
                  value={values.fecha_hora}
                  onChange={onChangeFecha}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  invalidDateMessage='Selecciona una fecha' />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-hora">Hora</InputLabel>
              <Select
                labelId="simple-select-outlined-hora"
                id="simple-select-outlined-hora"
                value={values.hora}
                error={Boolean(errors.hora)}
                onChange={onChangeHora}
                disabled={values.fecha_show === ''}
                label="Hora" >
                {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-hora">Medico</InputLabel>
              <Select
                labelId="simple-select-outlined-medico"
                id="simple-select-outlined-medico"
                value={values.medico}
                error={Boolean(errors.medico)}
                onChange={onChangeMedicos}
                label="Medico" >
                {medicos.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-promovendedor">Promovendedor</InputLabel>
              <Select
                labelId="simple-select-outlined-promovendedor"
                id="simple-select-outlined-promovendedor"
                value={values.promovendedor}
                error={Boolean(errors.promovendedor)}
                onChange={onChangePromovendedor}
                label="Promovendedor" >
                {promovendedores.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-tipo-cita">Tipo Cita</InputLabel>
              <Select
                labelId="simple-select-outlined-tipo-cita"
                id="simple-select-outlined-tipo-cita"
                value={values.tipoCita}
                error={Boolean(errors.tipoCita)}
                onChange={onChangeTipoCita}
                label="Tipo Cita" >
                {tipoCitas.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              className={classes.button}
              name="precio"
              //helperText={touched.precio ? errors.precio : ""}
              error={Boolean(errors.precio)}
              label="Precio"
              value={values.precio}
              type='Number'
              onChange={onChangePrecio}
              variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              className={classes.button}
              name="observaciones"
              //helperText={touched.observaciones ? errors.observaciones : ""}
              error={Boolean(errors.observaciones)}
              label="Observaciones"
              value={values.observaciones}
              onChange={onChangeObservaciones}
              variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              disabled={!isValid || isSubmitting || !paciente.nombres || !values.fecha_hora || !values.precio
                || !values.medico || !values.promovendedor}
              onClick={() => onClickAgendar(values)} >
              Agendar
            </Button>
          </Grid>
        </Grid>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid
            container
            justify="center"
            alignItems="center" >
            <KeyboardDatePicker
              disableToolbar
              loadingIndicator
              autoOk
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline-filter"
              label="Filtrado Consultas"
              value={filterDate}
              onChange={onChangeFilterDate}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }} />
          </Grid>
        </MuiPickersUtilsProvider>
      </Paper>

      <TableComponent
        titulo={titulo}
        columns={columns}
        data={citas}
        actions={actions}
        options={options} />

    </Fragment>
  );
}
