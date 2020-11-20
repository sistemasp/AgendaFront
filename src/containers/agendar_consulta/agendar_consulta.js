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
import { Paper, Button, TextField, Checkbox, FormControlLabel, TablePagination } from '@material-ui/core';
import TableComponent from '../../components/table/TableComponent';
import ModalConsulta from '../../components/modales/modal_consulta';
import { green } from '@material-ui/core/colors';
import ModalPagos from '../../components/modales/modal_pagos';
import ModalImprimirConsulta from '../../components/modales/imprimir/consulta';
import { toFormatterCurrency } from '../../utils/utils';
import ModalCirugia from '../../components/modales/modal_cirugia';
import ModalEstetica from '../../components/modales/modal_estetica';
import { ButtonCustom } from '../../components/basic/ButtonCustom';
import ModalProximaConsulta from '../../components/modales/modal_proxima_consulta';

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
    color: '#FFFFFF',
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

export const AgendarConsultaContainer = (props) => {

  const classes = useStyles();

  const {
    values,
    servicios,
    tratamientos,
    horarios,
    frecuencias,
    onChangeServicio,
    onChangeTratamientos,
    onChangeFecha,
    onChangeHora,
    onChangeFilterDate,
    filterDate,
    paciente,
    onClickAgendar,
    empleado,
    dermatologos,
    tipoCitas,
    medios,
    promovendedores,
    onChangeDermatologos,
    onChangePromovendedor,
    onChangeObservaciones,
    onChangeFrecuencia,
    dataComplete,
    frecuenciaPrimeraVezId,
    fercuenciaReconsultaId,
    // TABLE DATES PROPERTIES
    titulo,
    columns,
    citas,
    actions,
    options,
    components,
    // MODALS PROPERTIES
    openModal,
    consulta,
    onClickActualizarCita,
    onClickCancel,
    onChangeTipoCita,
    onChangeMedio,
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
    openModalCirugias,
    onCloseCirugia,
    cirugia,
    estetica,
    tipoServicioId,
    openModalEstetica,
    onCloseEstetica,
    onGuardarModalPagos,
    openModalProxima,
  } = props;

  return (
    <Fragment>
      {
        openModal ?
          <ModalConsulta
            open={openModal}
            consulta={consulta}
            onClickActualizarCita={onClickActualizarCita}
            onClose={onClickCancel}
            onChangeServicio={onChangeServicio}
            onChangeTratamientos={onChangeTratamientos}
            onChangeFecha={onChangeFecha}
            onChangeHora={onChangeHora}
            onChangeTipoCita={onChangeTipoCita}
            onChangeMedio={onChangeMedio}
            onChangeAsistio={onChangeAsistio}
            servicios={servicios}
            tratamientos={tratamientos}
            horarios={horarios}
            empleado={empleado}
            sucursal={sucursal._id}
            loadConsultas={loadConsultas}
            setOpenAlert={setOpenAlert}
            setMessage={setMessage}
            setFilterDate={setFilterDate}
          /> : ''
      }
      {
        openModalProxima ?
          <ModalProximaConsulta
            open={openModalProxima}
            consulta={consulta}
            onClickActualizarCita={onClickActualizarCita}
            onClose={onClickCancel}
            onChangeServicio={onChangeServicio}
            onChangeTratamientos={onChangeTratamientos}
            onChangeFecha={onChangeFecha}
            onChangeHora={onChangeHora}
            onChangeTipoCita={onChangeTipoCita}
            onChangeMedio={onChangeMedio}
            onChangeAsistio={onChangeAsistio}
            servicios={servicios}
            tratamientos={tratamientos}
            horarios={horarios}
            empleado={empleado}
            sucursal={sucursal._id}
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
            servicio={consulta}
            empleado={empleado}
            sucursal={sucursal._id}
            setMessage={setMessage}
            setOpenAlert={setOpenAlert}
            tipoServicioId={tipoServicioId}
						onGuardarModalPagos={onGuardarModalPagos} />
          : ''
      }
      {
        openModalCirugias ?
          <ModalCirugia
            open={openModalCirugias}
            onClose={onCloseCirugia}
            consulta={consulta}
            cirugia={cirugia}
            empleado={empleado}
            sucursal={sucursal._id}
            setMessage={setMessage}
            loadConsultas={loadConsultas}
            setOpenAlert={setOpenAlert} />
          : ''
      }
{
        openModalEstetica ?
          <ModalEstetica
            open={openModalEstetica}
            onClose={onCloseEstetica}
            consulta={consulta}
            estetica={estetica}
            empleado={empleado}
            sucursal={sucursal._id}
            setMessage={setMessage}
            loadConsultas={loadConsultas}
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
          {sucursal._id === process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID ?
            <Fragment>
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
                    onChange={onChangeHora}
                    disabled={values.fecha_show === ''}
                    label="Hora" >
                    {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Fragment> : ''}
          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-frecuencia">Frecuencia</InputLabel>
              <Select
                labelId="simple-select-outlined-frecuencia"
                id="simple-select-outlined-frecuencia"
                value={values.frecuencia}
                onChange={onChangeFrecuencia}
                label="frecuencia" >
                {frecuencias.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          {
            values.frecuencia === frecuenciaPrimeraVezId
              ? <Grid item xs={12} sm={2}>
                <h2> {values.dermatologo.nombre} </h2>
              </Grid>
              : <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">Dermatologo</InputLabel>
                  <Select
                    labelId="simple-select-outlined-dermatologo"
                    id="simple-select-outlined-dermatologo"
                    value={values.dermatologo}
                    onChange={onChangeDermatologos}
                    label="Dermatologo" >
                    {dermatologos.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
          }
          {
            values.frecuencia === fercuenciaReconsultaId
              ? <Grid item xs={12} sm={2}>
                <h2> {values.promovendedor.nombre} </h2>
              </Grid>
              : <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-promovendedor">Promovendedor</InputLabel>
                  <Select
                    labelId="simple-select-outlined-promovendedor"
                    id="simple-select-outlined-promovendedor"
                    value={values.promovendedor}
                    onChange={onChangePromovendedor}
                    label="Promovendedor" >
                    {promovendedores.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

          }
          {sucursal._id === process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID ?
            <Fragment>
              <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-tipo-cita">Medio</InputLabel>
                  <Select
                    labelId="simple-select-outlined-tipo-cita"
                    id="simple-select-outlined-tipo-cita"
                    value={values.medio}
                    onChange={onChangeMedio}
                    label="Medio" >
                    {medios.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Fragment>
            : ''}
          <Grid item xs={12} sm={2}>
            <TextField
              className={classes.button}
              name="observaciones"
              //helperText={touched.observaciones ? errors.observaciones : ""}
              label="Observaciones"
              value={values.observaciones}
              onChange={onChangeObservaciones}
              variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={2}>
            <h1>{toFormatterCurrency(values.precio)}</h1>
          </Grid>
          <Grid item xs={12} sm={2}>
            <ButtonCustom
							className={classes.button}
							color="primary"
							variant="contained"
							disabled={dataComplete}
							onClick={() => onClickAgendar(values)}
							text='AGENDAR' />
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
        options={options}
        components={components} />

    </Fragment>
  );
}
