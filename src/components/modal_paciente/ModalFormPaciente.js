import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, Input, FormControl, InputLabel } from '@material-ui/core';

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
  button: {
    width: '100%',
  },
}));

const ModalFormPaciente = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
		values,
		errors,
		touched,
		handleSubmit,
		handleChange,
    isValid,
    onClickCancel,
    onClickGuardar,
    onClickGuardarAgendar,
    open
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                className={classes.textField}
                name="nombres"
                helperText={touched.nombres ? errors.nombres : ""}
                error={Boolean(errors.nombres)}
                label="Nombres"
                value={values.nombres}
                onChange={handleChange}
                variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                className={classes.textField}
                name="apellidos"
                helperText={touched.apellidos ? errors.apellidos : ""}
                error={Boolean(errors.apellidos)}
                label="Apellidos"
                value={values.apellidos}
                onChange={handleChange}
                variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                className={classes.textField}
                name="fecha_nacimiento"
                helperText={touched.fecha_nacimiento ? errors.fecha_nacimiento : ""}
                error={Boolean(errors.fecha_nacimiento)}
                label="Fecha de nacimiento"
                value={values.fecha_nacimiento}
                onChange={handleChange}
                variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                className={classes.textField}
                name="direccion"
                helperText={touched.direccion ? errors.direccion : ""}
                error={Boolean(errors.direccion)}
                label="Direccion"
                value={values.direccion}
                onChange={handleChange}
                variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                className={classes.textField}
                name="telefono"
                helperText={touched.telefono ? errors.telefono : ""}
                error={Boolean(errors.telefono)}
                label="Telefono"
                value={values.telefono}
                onChange={handleChange}
                inputProps={{
                  maxLength: "10",
                }}
                variant="outlined"
                 />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickGuardar(e, values)}
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
              <Grid item xs={12}>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickGuardarAgendar(e, values)}
                  disabled={!isValid} >
                    Guardar Y Agendar
                </Button>
              </Grid>
            </Grid>
            
          </form>
        </div>
      </Modal>
    </div>
  );
}

  export default ModalFormPaciente;