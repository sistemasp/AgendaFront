import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { CheckCustom } from '../../basic/CheckCustom';
import ModalPagos from '../modal_pagos';
import ModalConfirmacion from '../modal_confirmacion';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    overflow: 'scroll',
    height: '90%',
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  button: {
    width: '100%',
    color: '#FFFFFF',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  }
}));

const canceloStatusId = process.env.REACT_APP_CANCELO_STATUS_ID;
const noAsistioStatusId = process.env.REACT_APP_NO_ASISTIO_STATUS_ID;
const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;

const ModalFormConsulta = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    handleSubmit,
    onChangeFecha,
    onChangeHora,
    onChangeTipoCita,
    onChangeStatus,
    onChangePromovendedor,
    onClose,
    onClickActualizarCita,
    open,
    empleado,
    consulta,
    horarios,
    promovendedores,
    doctores,
    tipoCitas,
    statements,
    onChangePrecio,
    onChangeMotivos,
    onChangeObservaciones,
    onChangeDermatologo,
    onCloseModalConfirmacion,
    onConfirmModalConfirmacion,
    openModalConfirmacion,
    setOpenAlert,
    setMessage,
    setSeverity,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            {
              openModalConfirmacion ?
                <ModalConfirmacion
                  open={openModalConfirmacion}
                  onClose={onCloseModalConfirmacion}
                  onConfirm={onConfirmModalConfirmacion}
                  empleado={empleado}
                  servicio={consulta}
                  status={values.status}
                  setMessage={setMessage}
                  setSeverity={setSeverity}
                  setOpenAlert={setOpenAlert} />
                : ''
            }
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h2 className={classes.label}>{values.paciente_nombre} ({values.telefono})</h2>
              </Grid>
              <Grid item xs={12}>
                <h2 className={classes.label}>{values.fecha_actual} - {values.hora_actual} hrs</h2>
              </Grid>
              <Grid item xs={12}>
                <h3 className={classes.label}>FRECUENCIA: {values.frecuencia.nombre}</h3>
              </Grid>
              <Grid item xs={12}>
                {
                  /* values.dermatologo*/ false ?
                    <h3 className={classes.label}>DERMATÓLOGO : {values.dermatologo.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-hora">DERMATÓLOGO</InputLabel>
                      <Select
                        labelId="simple-select-outlined-dermatologo"
                        id="simple-select-outlined-dermatologo"
                        value={values.dermatologo}
                        onChange={onChangeDermatologo}
                        label="DERMATÓLOGO" >
                        {doctores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>

              <Grid item xs={12}>
                {
                  /* values.tipo_cita */ false ?
                    <h3 className={classes.label}>TIPO CITA: {values.tipo_cita.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-tipo-cita">TIPO CITA</InputLabel>
                      <Select
                        labelId="simple-select-outlined-tipo-cita"
                        id="simple-select-outlined-tipo-cita"
                        value={values.tipo_cita}
                        onChange={onChangeTipoCita}
                        label="Tipo cita" >
                        {tipoCitas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>

              <Grid item xs={12}>
                {
                  /* values.promovendedor */ false ?
                    <h3 className={classes.label}>PROMOVENDEDOR: {values.promovendedor.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-promovendedor">PROMOVENDEDOR</InputLabel>
                      <Select
                        labelId="simple-select-outlined-promovendedor"
                        id="simple-select-outlined-promovendedor"
                        value={values.promovendedor}
                        onChange={onChangePromovendedor}
                        label="PROMOVENDEDOR" >
                        {promovendedores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-statements">ESTADO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-statements"
                    id="simple-select-outlined-statements"
                    value={values.status}
                    onChange={onChangeStatus}
                    label="ESTADO" >
                    {statements.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              {
                values.status === reagendoStatusId ?
                  <Fragment>
                    <Grid item xs={12} sm={6}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          disablePast
                          autoOk
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="FECHA"
                          value={values.nueva_fecha_hora}
                          onChange={onChangeFecha}
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                          invalidDateMessage='Selecciona una fecha' />
                      </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-hora">HORA</InputLabel>
                        <Select
                          labelId="simple-select-outlined-hora"
                          id="simple-select-outlined-hora"
                          value={values.hora}
                          onChange={onChangeHora}
                          label="HORA" >
                          {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Fragment>
                  : ''
              }

              {
                values.status === canceloStatusId || values.status === noAsistioStatusId || values.status === reagendoStatusId ?
                  <Grid item xs={12}>
                    <TextField
                      className={classes.textField}
                      name="motivos"
                      label="MOTIVOS"
                      value={values.motivos}
                      onChange={onChangeMotivos}
                      variant="outlined" />
                  </Grid> : ''
              }

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="precio"
                  label="PRECIO"
                  value={values.precio}
                  type='Number'
                  onChange={onChangePrecio}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="observaciones"
                  label="OBSERVACIONES"
                  value={values.observaciones}
                  onChange={onChangeObservaciones}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickActualizarCita(e, values)} >
                  GUARDAR
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClose} >
                  CANCELAR
              </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormConsulta;