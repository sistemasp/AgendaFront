import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { TextField, Button, Grid } from '@material-ui/core';
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
}));

const ModalFormSalaCirugia = (props) => {
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
    open,
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
                <h2>Sala de cirugia</h2>
                </Grid>
              <Grid item xs={12}>
                <TextField
                className={classes.textField}
                name="nombre"
                helperText={touched.nombre ? errors.nombre : ""}
                error={Boolean(errors.nombre)}
                label="NOMBRE"
                value={values.nombre}
                onChange={handleChange}
                variant="outlined" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ButtonCustom
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  onClick={(e) => onClickGuardar(e, values)}
                  disabled={!isValid} 
                  text='GUARDAR' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  className={classes.button}
                  color="secondary"
                  variant="contained"
                  onClick={onClickCancel} >
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

  export default ModalFormSalaCirugia;