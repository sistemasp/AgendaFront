import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from '../../basic/ButtonCustom';

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
    color: '#FFFFFF',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
}));

const ModalFormPaciente = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    handleSubmit,
    onChange,
    onChangeSexo,
    dataComplete,
    onClickCancel,
    onClickGuardar,
    open,
    sexos,
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
                  label="NOMBRES"
                  value={values.nombres}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="apellidos"
                  label="APELLIDOS"
                  value={values.apellidos}
                  onChange={onChange}
                  variant="outlined" />
              </Grid>
              {/*
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
              */}
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="telefono"
                  label="TELEFONO"
                  value={values.telefono}
                  onChange={onChange}
                  inputProps={{
                    maxLength: "10",
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="fecha_nacimiento"
                  label="FECHA DE NACIMIENTO"
                  value={values.fecha_nacimiento}
                  onChange={onChange}
                  inputProps={{
                    maxLength: "10",
                    placeholder: "dd/mm/aaaa"
                  }}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-hora">SEXO</InputLabel>
                  <Select
                    labelId="simple-select-outlined-dermatologo"
                    id="simple-select-outlined-dermatologo"
                    value={values.sexo}
                    onChange={onChangeSexo}
                    name="sexo"
                    label="SEXO" >
                    {sexos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  disabled={dataComplete}
                  onClick={(e) => onClickGuardar(e, values)}
                  text='GUARDAR' />
              </Grid>

              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClickCancel}
                  text='CANCELAR' />
              </Grid>
            </Grid>

          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormPaciente;