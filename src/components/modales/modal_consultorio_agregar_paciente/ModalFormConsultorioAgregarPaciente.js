import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from "../../basic/ButtonCustom";

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
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    position: 'absolute',
    width: 550,
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
  label: {
    marginTop: '0px',
    marginBottom: '0px',
  }
}));

const ModalFormConsultorioAgregarPaciente = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    errors,
    handleSubmit,
    onChangeConsultorio,
    isValid,
    onClickCancel,
    onClickGuardar,
    open,
    consultorios,
    cambio,
    paciente,
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
                <h2 className={classes.label}>{cambio ? 'CAMBIAR DE ' : ' ASIGNAR A '}CONSULTORIO</h2>
              </Grid>
              <Grid item xs={12}>
                <h2 className={classes.label}>{`${paciente.nombres}`}</h2>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="simple-select-outlined-asignar">CONSULTORIO DISPONIBLE</InputLabel>
                  <Select
                    labelId="simple-select-outlined-asignar"
                    id="simple-select-outlined-asignar"
                    value={values.consultorio}
                    error={Boolean(errors.consultorio)}
                    onChange={onChangeConsultorio}
                    label="CONSULTORIO DISPONIBLE" >
                    {consultorios.sort().map((item, index) => <MenuItem key={index} value={item}>{`${item.nombre} - ${item.dermatologo.nombre}`} </MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickGuardar(e, values)}
                  disabled={!isValid}
                  text={cambio ? 'CAMBIO' : 'PASAR'} />
              </Grid>
              {!cambio
                ? <Grid item xs={12} sm={6}>
                  <Button
                    className={classes.button}
                    color="secondary"
                    variant="contained"
                    onClick={onClickCancel} >
                    CANCELAR
                </Button>
                </Grid>
                : ''
              }
            </Grid>

          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormConsultorioAgregarPaciente;