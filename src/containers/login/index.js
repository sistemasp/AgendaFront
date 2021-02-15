import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { showAllOffices } from "../../services";
import withStyles from "@material-ui/core/styles/withStyles";
import { loginEmployee } from "../../services";
import { LoginContainer } from "./login";
import { withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Snackbar, Grid } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import bannerMePiel from './../../bannerMePiel.PNG';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(5)}px ${theme.spacing(5)}px ${theme.spacing(5)}px`
  },
  container: {
    maxWidth: "200px"
  },
  title: {
    color: "#2BA6C6"
  }
});

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const validationSchema = Yup.object({
    employee_number: Yup.string("Ingresa tu numero de empleado")
        .required("El numero de empleado es requerido"),
});

const LoginForm = (props) => {

  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState({
    employee_number: '',
    password: '',
    showPassword: false
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

	const rolPromovendedorId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const rolCosmetologaId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
	const rolDermatologoId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
	const rolPatologoId = process.env.REACT_APP_PATOLOGO_ROL_ID;
	const rolGerenteId = process.env.REACT_APP_GERENTE_ROL_ID;
	const rolEncargadoSucursalId = process.env.REACT_APP_ENCARGADO_SUCURSAL_ROL_ID;
	const rolEncargadoCosmetologasId = process.env.REACT_APP_ENCARGADO_COSMETOLOGAS_ROL_ID;
	const rolRecepcionistaId = process.env.REACT_APP_RECEPCIONISTA_ROL_ID;
  const rolEnfermeraId = process.env.REACT_APP_ENFERMERA_ROL_ID;
	const rolAdministacionId = process.env.REACT_APP_ADMINISTRACION_ROL_ID;
	const rolDiosSupremoId = process.env.REACT_APP_DIOS_SUPREMO_ROL_ID;
	const rolSistemas = process.env.REACT_APP_SISTEMAS_ROL_ID;

  useEffect(() => {
    const loadSucursales = async() => {
        const response = await showAllOffices();
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
          setSucursales(response.data);
        }
    }
    setIsLoading(true);
    loadSucursales();
    setIsLoading(false);
  }, []);

  const { 
    history,
   } = props;

  const handleChangeSucursal = e => {
    setIsLoading(true);
    setValues({ ...values, sucursal: e.target.value });
    setIsLoading(false);
  };

  const handleChangeNumber = e => {
    setValues({ ...values, employee_number: e.target.value });
  }

  const handleChangePassword = e => {
    setValues({ ...values, password: e.target.value });
  }

  const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

  const submit = async(data) => {
    const response = await loginEmployee(data.employee_number, data.password);
    if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK && response.data !== '' ) {
      const empleado = response.data;
      if (empleado.rol._id === rolGerenteId
        || empleado.rol._id ===rolEncargadoSucursalId
        || empleado.rol._id ===rolRecepcionistaId
        || empleado.rol._id ===rolDiosSupremoId
        || empleado.rol._id ===rolSistemas ) {
        history.push('/recepcion', { empleado: empleado, sucursal: data.sucursal });
      } else if (empleado.rol._id === rolDermatologoId) {
        history.push('/dermatologos', { dermatologo: empleado, sucursal: data.sucursal });
      }
    } else {
      setOpenAlert(true);
      setSeverity('warning');
      setMessage('NUMERO DE EMPLEADO O CONSTRASEÑA INCORRECTOS');
    }
  };

  const classes = props;

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <Fragment>
      <img src={bannerMePiel} alt='banner' />
      <h1>INICIAR SESIÓN</h1>
          <Grid container className={classes.root} justify="center" spacing={3}>
            <Grid item xs={3}>
              <Formik
                enableReinitialize
                initialValues={values}
                validationSchema={validationSchema}
                onSubmit={submit}>
                {props => <LoginContainer 
                  sucursales={sucursales}
                  isLoading={isLoading}
                  handleChangeNumber={(e) => handleChangeNumber(e)}
                  handleChangePassword={(e) => handleChangePassword(e)}
                  onChangeSucursal={(e) => handleChangeSucursal(e)}
                  handleClickShowPassword={handleClickShowPassword}
                  handleMouseDownPassword={(e) => handleMouseDownPassword(e)}
                  {...props} />}
              </Formik>
            </Grid>
          </Grid>
        <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    </Fragment>
  );
}

export default withRouter(withStyles(styles)(LoginForm));
