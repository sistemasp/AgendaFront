import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Multiselect } from 'multiselect-react-dropdown';
import { CheckCustom } from '../basic/CheckCustom';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
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
    errors,
    handleSubmit,
    onChangeFecha,
    onChangeHora,
    onChangeTipoCita,
    onChangeStatus,
    onChangePromovendedor,
    isValid,
    onClickCancel,
    onClickActualizarCita,
    open,
    horarios,
    promovendedores,
    doctores,
    tipoCitas,
    statements,
    onChangePrecio,
    onChangeMotivos,
    onChangeObservaciones,
    onChangeMedico,
    onChangePagado,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h3>{values.paciente_nombre} ({values.telefono})</h3>
              </Grid>
              <Grid item xs={12}>
                {
                  /* values.medico*/ false ?
                    <h3 className={classes.label}>Medico : {values.medico.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-hora">Medico</InputLabel>
                      <Select
                        labelId="simple-select-outlined-medico"
                        id="simple-select-outlined-medico"
                        value={values.medico}
                        error={Boolean(errors.medico)}
                        onChange={onChangeMedico}
                        label="Medico" >
                        {doctores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>
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
                    label="Fecha"
                    value={values.fecha_show}
                    onChange={onChangeFecha}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    invalidDateMessage='Selecciona una fecha' />
                </MuiPickersUtilsProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">Hora</InputLabel>
                  <Select
                    labelId="simple-select-outlined-hora"
                    id="simple-select-outlined-hora"
                    value={values.hora}
                    error={Boolean(errors.hora)}
                    onChange={onChangeHora}
                    label="Hora" >
                    {horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                {
                  /* values.tipo_cita */ false ?
                    <h3 className={classes.label}>Tipo cita: {values.tipo_cita.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-tipo-cita">Tipo cita</InputLabel>
                      <Select
                        labelId="simple-select-outlined-tipo-cita"
                        id="simple-select-outlined-tipo-cita"
                        value={values.tipo_cita}
                        error={Boolean(errors.tipo_cita)}
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
                    <h3 className={classes.label}>Promovendedor: {values.promovendedor.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-promovendedor">Promovendedor</InputLabel>
                      <Select
                        labelId="simple-select-outlined-promovendedor"
                        id="simple-select-outlined-promovendedor"
                        value={values.promovendedor}
                        error={Boolean(errors.promovendedor)}
                        onChange={onChangePromovendedor}
                        label="Promovendedor" >
                        {promovendedores.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>

              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-statements">Estado</InputLabel>
                  <Select
                    labelId="simple-select-outlined-statements"
                    id="simple-select-outlined-statements"
                    value={values.status}
                    error={Boolean(errors.statements)}
                    onChange={onChangeStatus}
                    label="Estado" >
                    {statements.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              {
                values.status === canceloStatusId || values.status === noAsistioStatusId || values.status === reagendoStatusId ?
                  <Grid item xs={12}>
                    <TextField
                      className={classes.textField}
                      name="motivos"
                      //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                      error={Boolean(errors.motivos)}
                      label="Motivos"
                      value={values.motivos}
                      onChange={onChangeMotivos}
                      variant="outlined" />
                  </Grid> : ''
              }

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="precio"
                  //helperText={touched.precio ? errors.precio : ""}
                  error={Boolean(errors.precio)}
                  label="Precio"
                  value={values.precio}
                  type='Number'
                  onChange={onChangePrecio}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="observaciones"
                  //helperText={touched.observaciones ? errors.observaciones : ""}
                  error={Boolean(errors.observaciones)}
                  label="Observaciones"
                  value={values.observaciones}
                  onChange={onChangeObservaciones}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                <CheckCustom
                  checked={values.pagado}
                  onChange={onChangePagado}
                  name="checkedG"
                  label="Pagado"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickActualizarCita(e, values)}
                  disabled={!isValid} >
                  Guardar
                </Button>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Button
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClickCancel} >
                  Cancelar
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