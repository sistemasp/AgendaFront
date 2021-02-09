import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Grid } from '@material-ui/core';
import bannerMePiel from './../../../../bannerMePiel.PNG';
import { addZero } from '../../../../utils/utils';
import { ButtonCustom } from '../../../basic/ButtonCustom';

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
    paddingLeft: 15
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
    color: '#FFFFFF',
  },
  label: {
    marginTop: '0px',
    marginBottom: '0px',
    textAlign: 'center',
  },
  label_left: {
    marginTop: '0px',
    marginBottom: '0px',
    marginLeft: '10px',
    textAlign: 'left',
  },
  label_right: {
    marginTop: '0px',
    marginBottom: '0px',
    marginRight: '10px',
    textAlign: 'right',
  },
  label_foot: {
    fontSize: '11px',
    marginTop: '0px',
    marginRight: '10px',
    marginBottom: '10px',
    textAlign: 'right',
    fontWeight: 'bold',
  }
}));

const ModalFormImprimirConsulta = (props) => {
  const classes = useStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    datos,
    onClose,
    onClickImprimir,
    open,
    servicio,
    show,
  } = props;

  const fecha = new Date();

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper}>
          <img src={bannerMePiel} alt='banner' width="360" height="85" />
          <Grid container>
            <Grid item xs={12} className={classes.label}>
              <h2 className={classes.label}>{datos.sucursal.nombre}</h2>
            </Grid>
            <Grid item xs={true} className={classes.label_left}>
              <h2 className={classes.label_left}>FOLIO: {datos.folio}</h2>
            </Grid>
            <Grid item xs={true} className={classes.label_right}>
              <h3 className={classes.label_right}>{`${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${addZero(fecha.getFullYear())}`}</h3>
            </Grid>
            <Grid item xs={12} className={classes.label_left}>
              <h4 className={classes.label_left}>PACIENTE: {datos.paciente_nombre}</h4>
            </Grid>
            <br />
            <Grid item xs={12} className={classes.label_left}>
              <h2 className={classes.label_left}>1 {`${servicio} ${datos.total_moneda}`}</h2>
            </Grid>
            <br />
            <Grid item xs={12}>
              <p className={classes.label_foot}>*ESTE TICKET NO REPRESENTA UN COMPROBANTE FISCAL.*</p>
            </Grid>
            {
              show ?
                <Fragment>
                  <Grid item xs={12}>
                    <ButtonCustom
                      className={classes.button}
                      color="primary"
                      variant="contained"
                      onClick={onClickImprimir}
                      text='IMPRIMIR' />
                  </Grid>

                  <Grid item xs={12}>
                    <ButtonCustom
                      className={classes.button}
                      color="secondary"
                      variant="contained"
                      onClick={onClose}
                      text='CERRAR' />
                  </Grid>
                </Fragment> : ''

            }
          </Grid>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFormImprimirConsulta;