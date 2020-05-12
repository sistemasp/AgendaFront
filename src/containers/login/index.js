import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { showAllOffices } from "../../services";
import withStyles from "@material-ui/core/styles/withStyles";
import { loginEmployee } from "../../services";
import { LoginContainer } from "./login";
import Paper from "@material-ui/core/Paper";
import { withRouter } from 'react-router-dom';
import * as Yup from "yup";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

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
    sucursal: {},
    password: '',
    showPassword: false
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

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
      if (response.data ) {
        history.push('/menu', { empleado: response.data, sucursal: data.sucursal });
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
        <Paper elevation={1} className={classes.paper}>
          <h1>Iniciar sesión</h1>
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
        </Paper>
        <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    </Fragment>
  );
}

export default withRouter(withStyles(styles)(LoginForm));
