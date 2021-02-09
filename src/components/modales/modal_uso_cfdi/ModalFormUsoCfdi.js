import React from 'react';
import Modal from '@material-ui/core/Modal';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { ButtonCustom } from '../../basic/ButtonCustom';
import myStyles from '../../../css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const ModalFormUsoCfdi = (props) => {
  const classes = myStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    open,
    onClose,
    usoCfdis,
    values,
    onChangeUsoCfdi,
    onGenerarFactura,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <h1>Generar factura</h1>
          <Grid item xs={12}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="simple-select-outlined-use">Uso CFDI</InputLabel>
              <Select
                labelId="simple-select-outlined-use"
                id="simple-select-outlined-use"
                value={values.uso_cfdi}
                onChange={onChangeUsoCfdi}
                label="Uso CFDI" >
                {usoCfdis.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.clave} - {item.descripcion}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <ButtonCustom
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={(e) => onGenerarFactura(e, values)}
                text='Facturar' />
            </Grid>
            <Grid item xs={6}>
              <ButtonCustom
                className={classes.button}
                color="secondary"
                variant="contained"
                onClick={onClose}
                text='Cancelar' />
            </Grid>
          </Grid>
        </div>
      </Modal>
    </div >
  );
}

export default ModalFormUsoCfdi;