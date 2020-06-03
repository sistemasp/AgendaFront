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
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
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
    onChangeTratamientos,
    onChangeTiempo,
    onChangeTipoCita,
    onChangeStatus,
    onChangePromovendedor,
    onChangeCosmetologa,
    isValid,
    onClickCancel,
    onClickActualizarCita,
    open,
    servicios,
    tratamientos,
    promovendedores,
    cosmetologas,
    doctores,
    valuesTipoCita,
    valuesStatus,
    onChangeSesion,
    onChangePrecio,
    onChangeMotivos,
    onChangeObservaciones,
    onChangeDoctors,
  } = props;

  console.log('VALUES', values);
  console.log('SERVICIOS', servicios);

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
                <h2 className={classes.label}>{values.paciente_nombre} ({values.telefono})</h2>
              </Grid>
              <Grid item xs={12}>
                <h3 className={classes.label}>Servicio: {values.servicio.nombre}</h3>
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
              <Grid item xs={12}>
                {
                  values.medico ?
                    <h3 className={classes.label}>Medico : {values.medico.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-hora">Medico</InputLabel>
                      <Select
                        labelId="simple-select-outlined-medico"
                        id="simple-select-outlined-medico"
                        value={values.medico}
                        error={Boolean(errors.medico)}
                        onChange={onChangeDoctors}
                        label="Medico" >
                        {doctores.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>
              <Grid item xs={12} sm={6}>
                <h3 className={classes.label}>Fecha: {values.fecha}</h3>
              </Grid>
              <Grid item xs={12} sm={6}>
                <h3 className={classes.label}>Hora: {values.hora}</h3>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="tiempo"
                  //helperText={touched.tiempo ? errors.tiempo : ""}
                  error={Boolean(errors.tiempo)}
                  label="Tiempo (minutos)"
                  value={values.tiempo}
                  type='Number'
                  onChange={onChangeTiempo}
                  variant="outlined" />
              </Grid>

              <Grid item xs={12}>
                {
                  values.tipo_cita ?
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
                        {valuesTipoCita.sort().map((item, index) => <MenuItem key={index} value={item.nombre}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>
              <Grid item xs={12}>
                {
                  values.promovendedor ?
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
                {
                  values.cosmetologa ?
                    <h3 className={classes.label}>Cosmetologa: {values.cosmetologa.nombre}</h3> :
                    <FormControl variant="outlined" className={classes.formControl}>
                      <InputLabel id="simple-select-outlined-cosmetologa">Cosmetologa</InputLabel>
                      <Select
                        labelId="simple-select-outlined-cosmetologa"
                        id="simple-select-outlined-cosmetologa"
                        value={values.cosmetologa}
                        error={Boolean(errors.cosmetologa)}
                        onChange={onChangeCosmetologa}
                        label="Cosmetologa" >
                        {cosmetologas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                      </Select>
                    </FormControl>
                }
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-estado">Estado</InputLabel>
                  <Select
                    labelId="simple-select-outlined-estado"
                    id="simple-select-outlined-estado"
                    value={values.estado}
                    error={Boolean(errors.estado)}
                    onChange={onChangeStatus}
                    label="Estado" >
                    {valuesStatus.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>

              {
                values.status.nombre === 'CANCELO' || values.status.nombre === 'REAGENDO' || values.status.nombre === 'NO ASISTIO' ?
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
                  name="numero_sesion"
                  //helperText={touched.numero_sesion ? errors.numero_sesion : ""}
                  error={Boolean(errors.numero_sesion)}
                  label="Numero sesion"
                  value={values.numero_sesion}
                  type='Number'
                  onChange={onChangeSesion}
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