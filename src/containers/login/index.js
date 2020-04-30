import React, { Fragment, useEffect, useState } from "react";
import { Formik } from "formik";
import { showAllOffices } from "../../services";
import withStyles from "@material-ui/core/styles/withStyles";
import { findEmployeeByEmployeeNumber } from "../../services";
import { LoginContainer } from "./login";
import Paper from "@material-ui/core/Paper";
import { withRouter } from 'react-router-dom';
import * as Yup from "yup";

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

const validationSchema = Yup.object({
    employee_number: Yup.string("Ingresa tu numero de empleado")
        .required("El numero de empleado es requerido"),
});

const LoginForm = (props) => {

  const [sucursales, setSucursales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState({ employee_number: '', sucursal: {} });

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

  const submit = async(data) => {
    const response = await findEmployeeByEmployeeNumber(data.employee_number);
    if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK && response.data !== '' ) {
      if (response.data ) {
        history.push('/menu', { empleado: response.data, sucursal: data.sucursal });
      }
    }
  };

  const classes = props;

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
              onChangeSucursal={(e) => handleChangeSucursal(e)}
              {...props} />}
          </Formik>
        </Paper>
    </Fragment>
  );
}

export default withRouter(withStyles(styles)(LoginForm));
