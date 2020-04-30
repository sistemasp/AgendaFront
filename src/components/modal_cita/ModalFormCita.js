import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Multiselect } from 'multiselect-react-dropdown';

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

const ModalFormCita = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
		values,
		errors,
		handleSubmit,
    onChangeServicio,
    onChangeTratamientos,
    onChangeFecha,
    onChangeHora,
    onChangeTipoCita,
    onChangeAsistio,
    isValid,
    onClickCancel,
    onClickActualizarCita,
    open,
    servicios,
    tratamientos,
    horarios,
    valuesTipoCita,
    valuesStatus,
    onChangeSesion,
    onChangePrecio,
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
                <h3>{values.paciente_nombre}</h3>
              </Grid>
              <Grid item xs={12}>
                <h4>{values.telefono}</h4>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-servicio">Servicio</InputLabel>
                  <Select
                    labelId="simple-select-outlined-servicio"
                    id="simple-select-outlined-servicio"
                    value={values.servicio}
                    error={Boolean(errors.servicio)}
                    onChange={onChangeServicio}
                    label="Servicio" >
                        {servicios.sort().map((item, index) => <MenuItem key={index} value={item.nombre}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Multiselect 
                  options={tratamientos} // Options to display in the dropdown
                  displayValue="nombre" // Property name to display in the dropdown options
                  onSelect={(e) => onChangeTratamientos(e)} // Function will trigger on select event
                  onRemove={(e) => onChangeTratamientos(e)} // Function will trigger on remove event
                  placeholder="Selecciona tratamientos"
                  selectedValues={values.tratamientos} // Preselected value to persist in dropdown
                  /> 
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
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-tipo-cita">Tipo cita</InputLabel>
                  <Select
                    labelId="simple-select-outlined-tipo-cita"
                    id="simple-select-outlined-tipo-cita"
                    value={values.tipo_cita}
                    error={Boolean(errors.tipo_cita)}
                    onChange={onChangeTipoCita}
                    label="Tipo cita" >
                        {valuesTipoCita.sort().map((item, index) => <MenuItem key={index} value={item.nombre}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-asistiio">Estado</InputLabel>
                  <Select
                    labelId="simple-select-outlined-asistiio"
                    id="simple-select-outlined-asistiio"
                    value={values.asistio}
                    error={Boolean(errors.asistio)}
                    onChange={onChangeAsistio}
                    label="Tipo cita" >
                        {valuesStatus.sort().map((item, index) => <MenuItem key={index} value={item.nombre}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              
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
                  name="numero_sesion"
                  //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                  error={Boolean(errors.numero_sesion)}
                  label="Numero sesion"
                  value={values.numero_sesion}
                  type='Number'
                  onChange={onChangeSesion}
                  variant="outlined" />
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

  export default ModalFormCita;