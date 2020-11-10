import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

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
  button: {
    width: '100%',
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  },
}));

const ModalFormRazonSocial = (props) => {
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
    estados,
    municipios,
    ciudades,
    colonias,
    open,
    onChangeEstado,
    onChangeMunicipio,
    onChangeColonia,
    onClickBuscar,
    onChangeCP,
    onChangeDomicilio,
onChangeEmail,
onChangeNombre,
onChangeNumero,
onChangeRfc,
onChangeTelefono,
onChangeCiudad,
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
                  name="rfc"
                  helperText={touched.rfc ? errors.rfc : ""}
                  error={Boolean(errors.rfc)}
                  label="RFC"
                  value={values.rfc}
                  onChange={onChangeRfc}
                  inputProps={{
                    maxLength: "13"
                  }}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="nombre_completo"
                  helperText={touched.nombre_completo ? errors.nombre_completo : ""}
                  error={Boolean(errors.nombre_completo)}
                  label="Nombre  completo"
                  value={values.nombre_completo}
                  onChange={onChangeNombre}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="domicilio"
                  helperText={touched.domicilio ? errors.domicilio : ""}
                  error={Boolean(errors.domicilio)}
                  label="Domicilio"
                  value={values.domicilio}
                  onChange={onChangeDomicilio}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="numero"
                  helperText={touched.numero ? errors.numero : ""}
                  error={Boolean(errors.numero)}
                  label="Numero"
                  value={values.numero}
                  onChange={onChangeNumero}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6} >
                <TextField
                  className={classes.textField}
                  name="codigo_postal"
                  helperText={touched.codigo_postal ? errors.codigo_postal : ""}
                  error={Boolean(errors.codigo_postal)}
                  label="Codigo postal"
                  value={values.codigo_postal}
                  onChange={onChangeCP}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickBuscar(e)}
                  disabled={!isValid} >
                  Buscar
                </Button>
              </Grid>

              {
                values.codigo_postal ?
                  <Fragment>
                    <Grid item xs={12}>
                      <h3 className={classes.label}>Estado : {values.estado}</h3>
                    </Grid>
                    <Grid item xs={12}>
                      <h3 className={classes.label}>Municipio : {values.municipio}</h3>
                    </Grid>
                    <Grid item xs={12}>
                      <h3 className={classes.label}>Ciudad : {values.ciudad}</h3>
                    </Grid>
                  </Fragment> :
                  <Fragment>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-estados">Estados</InputLabel>
                        <Select
                          labelId="simple-select-outlined-estados"
                          id="simple-select-outlined-estados"
                          value={values.estado}
                          error={Boolean(errors.estados)}
                          isSearchable={true}
                          onChange={onChangeEstado}
                          label="Estados" >
                          {estados.sort().map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="simple-select-outlined-municipio">Municipio</InputLabel>
                        <Select
                          labelId="simple-select-outlined-municipio"
                          id="simple-select-outlined-municipio"
                          value={values.municipio}
                          error={Boolean(errors.municipio)}
                          onChange={onChangeMunicipio}
                          label="Municipio" >
                          {municipios.sort().map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        className={classes.textField}
                        name="ciudad"
                        helperText={touched.ciudad ? errors.ciudad : ""}
                        error={Boolean(errors.codigo_postal)}
                        label="Ciudad"
                        value={values.ciudad}
                        onChange={onChangeCiudad}
                        variant="outlined" />
                    </Grid>
                  </Fragment>

              }


              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-colonia">Colonia</InputLabel>
                  <Select
                    labelId="simple-select-outlined-colonia"
                    id="simple-select-outlined-colonia"
                    value={values.colonia}
                    error={Boolean(errors.colonia)}
                    onChange={onChangeColonia}
                    label="Promovendedor" >
                    {colonias.sort().map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="telefono"
                  helperText={touched.telefono ? errors.telefono : ""}
                  error={Boolean(errors.telefono)}
                  label="Telefono"
                  value={values.telefono}
                  onChange={onChangeTelefono}
                  inputProps={{
                    maxLength: "10",
                  }}
                  variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className={classes.textField}
                  name="email"
                  helperText={touched.email ? errors.email : ""}
                  error={Boolean(errors.email)}
                  label="Email"
                  value={values.email}
                  onChange={onChangeEmail}
                  variant="outlined" />
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
            </Grid>
          </form>
        </div>
      </Modal>
    </div >
  );
}

export default ModalFormRazonSocial;