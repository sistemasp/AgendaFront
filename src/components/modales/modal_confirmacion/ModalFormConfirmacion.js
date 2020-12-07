import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Grid, IconButton, InputAdornment, OutlinedInput, InputLabel, FormControl } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
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
}));

const ModalFormConfirmacion = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    values,
    onClickCancel,
    onClickGuardar,
    handleMouseDownPassword,
    handleClickShowPassword,
    handleChangePassword,
    open,
    dataComplete,
  } = props;

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open} >
        <div style={modalStyle} className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl className={classes.margin, classes.textField} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">CONTRASEÑA DE SUPERVISOR</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={values.showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChangePassword}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={onClickGuardar}
                disabled={dataComplete}
                text='CONFIRMAR' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonCustom
                className={classes.button}
                color="secondary"
                variant="contained"
                onClick={onClickCancel}
                text='CANELAR' />
            </Grid>
          </Grid>
        </div>
    </Modal>

  );
}

export default ModalFormConfirmacion;