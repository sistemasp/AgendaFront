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
import { Paper, TextField, Checkbox } from '@material-ui/core';
import TableComponent from '../../../components/table/TableComponent';
import ModalConsulta from '../../../components/modales/modal_consulta';
import { green } from '@material-ui/core/colors';
import ModalPagos from '../../../components/modales/modal_pagos';
import ModalImprimirConsulta from '../../../components/modales/imprimir/consulta';
import { toFormatterCurrency } from '../../../utils/utils';
import ModalCirugia from '../../../components/modales/modal_cirugia';
import ModalEstetica from '../../../components/modales/modal_estetica';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalProximaConsulta from '../../../components/modales/modal_proxima_consulta';
import ModalTraspaso from '../../../components/modales/traspaso';

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
    productos,
    horarios,
    frecuencias,
    onChangeServicio,
    onChangeTratamientos,
    onChangeProductos,
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
    frecuenciaReconsultaId,
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
    setSeverity,
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
    openModalTraspaso,
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
            setSeverity={setSeverity}
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
        openModalTraspaso ?
          <ModalTraspaso
            open={openModalTraspaso}
            onClose={onClickCancel}
            servicio={consulta}
            empleado={empleado}
            sucursal={sucursal._id}
            setMessage={setMessage}
            setOpenAlert={setOpenAlert}
            tipoServicioId={tipoServicioId}
            loadConsultas={loadConsultas}/>
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
            servicio="CONSULTA"
            datos={datosImpresion} />
          : ''
      }
      <Paper>
        <h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'SELECCIONA UN PACIENTE'}</h1>

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
                      label="FECHA"
                      value={values.fecha_hora}
                      onChange={onChangeFecha}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                      invalidDateMessage='SELECCIONA UNA FECHA' />
                  </Grid>
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">HORA</InputLabel>
                  <Select
                    labelId="simple-select-outlined-hora"
                    id="simple-select-outlined-hora"
                    value={values.hora}
                    onChange={onChangeHora}
                    disabled={values.fecha_show === ''}
                    label="HORA" >
                    {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Fragment> : ''}
          <Grid item xs={12} sm={2}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-frecuencia">FRECUENCIA</InputLabel>
              <Select
                labelId="simple-select-outlined-frecuencia"
                id="simple-select-outlined-frecuencia"
                value={values.frecuencia}
                onChange={onChangeFrecuencia}
                label="FRECUENCIA" >
                {frecuencias.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          {
            values.frecuencia === frecuenciaReconsultaId
              ? <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">PRODUCTO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-producto"
                    id="simple-select-outlined-producto"
                    value={values.producto}
                    onChange={onChangeProductos}
                    label="PRODUCTO" >
                    {productos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              : ''
          }
          {
            values.frecuencia === frecuenciaPrimeraVezId
              ? <Grid item xs={12} sm={2}>
                <h2> {values.dermatologo.nombre} </h2>
              </Grid>
              : <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">DERMATÓLOGO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-dermatologo"
                    id="simple-select-outlined-dermatologo"
                    value={values.dermatologo}
                    onChange={onChangeDermatologos}
                    label="DERMATÓLOGO" >
                    {dermatologos.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
          }
          {
            values.frecuencia === frecuenciaReconsultaId
              ? <Grid item xs={12} sm={2}>
                <h2> {values.promovendedor.nombre} </h2>
              </Grid>
              : <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-promovendedor">PROMOVENDEDOR</InputLabel>
                  <Select
                    labelId="simple-select-outlined-promovendedor"
                    id="simple-select-outlined-promovendedor"
                    value={values.promovendedor}
                    onChange={onChangePromovendedor}
                    label="PROMOVENDEDOR" >
                    {promovendedores.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

          }
          {sucursal._id === process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID ?
            <Fragment>
              <Grid item xs={12} sm={2}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-tipo-cita">MEDIO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-tipo-cita"
                    id="simple-select-outlined-tipo-cita"
                    value={values.medio}
                    onChange={onChangeMedio}
                    label="MEDIO" >
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
              label="OBSERVACIONES"
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
              text='GUARDAR' />
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
              label="FILTRADO CONSULTAS"
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
