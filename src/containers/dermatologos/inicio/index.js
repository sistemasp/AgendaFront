import React, { Fragment, useEffect, useState } from "react";
import { findSurgeryBySucursalAndDermatologoId } from "../../../services/consultorios";
import { InicioContainer } from "./inicio";
import { Snackbar, Grid, Backdrop, CircularProgress } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const InicioDermatologos = (props) => {

  const [consultorio, setConsultorio] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const {
    dermatologo,
    sucursal,
  } = props;

  const classes = props;

  console.log("KAOZ", consultorio);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const findConsultorio = async () => {
    setIsLoading(true);
    const response = await findSurgeryBySucursalAndDermatologoId(sucursal._id, dermatologo._id);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setConsultorio(response.data);
    }
    setIsLoading(false);

  }

  useEffect(() => {
    findConsultorio();
  }, []);

  return (
    <Fragment>
      {
        !isLoading ?
          <Fragment>
            <Grid container className={classes.root} justify="center" spacing={3}>
              <Grid item xs={3}>
                <InicioContainer
                  dermatologo={dermatologo}
                  sucursal={sucursal}
                  consultorio={consultorio} />
              </Grid>
            </Grid>
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
              <Alert onClose={handleCloseAlert} severity={severity}>
                {message}
              </Alert>
            </Snackbar>
          </Fragment> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }

    </Fragment>
  );
}

export default InicioDermatologos;
