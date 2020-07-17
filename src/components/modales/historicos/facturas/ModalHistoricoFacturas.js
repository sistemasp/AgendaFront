import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Grid } from '@material-ui/core';

import TableComponent from '../../../table/TableComponent';

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
    width: '95%',
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

const ModalHistoricoFacturas = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    historial,
    open,
    onClickCancel,
    titulo,
    columns,
    options
  } = props; 
  
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <TableComponent
            titulo={titulo}
            columns={columns}
            data={historial}
            options={options} />
          <Grid item xs={12} sm={12}>
            <Button
              className={classes.button}
              color="secondary"
              variant="contained"
              onClick={onClickCancel} >
                SALIR
            </Button>
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

  export default ModalHistoricoFacturas;