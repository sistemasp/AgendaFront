import React, { Fragment } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withFormik, Field, ErrorMessage, Form } from 'formik';

const LoginContainer = (props) => {

    const {
        isSubmitting,
    } = props;

    return (
        <Fragment>
            <Form >
                <div className="row">
                    <Field name="usuario">
                        {
                            (bundle) => 
                            <TextField
                                id="usuario"
                                name="usuario"
                                label="Usuario"
                                variant="outlined" />
                        }
                    </Field>
                    
                    <ErrorMessage name="usuario">
                        {message => <div className="row">{message}</div>}
                    </ErrorMessage>
                </div>
                
                <div className="row">
                    <Field name="contrasenia">
                        {
                            (bundle) => 
                            <TextField 
                                id="contrasenia"
                                name="contrasenia"
                                label="Contraseña"
                                variant="outlined"
                                type="password" />
                        }
                    </Field>
                    
                    <ErrorMessage name="contrasenia">
                        {message => <div className="row">{message}</div>}
                    </ErrorMessage>
                </div>
                
                <div className="row">
                    <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}>
                        Entrar
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
}

export default withFormik({
    mapPropsToValues(props) {
        return {
            usuario: 'AAAA',
            contrasenia: '3',
        }
    }, 

    validate(values) {
        const errors = {};

        if (!values.usuario) {
            errors.usuario = 'Usuario es requerido';
        } 

        if (!values.contrasenia) {
            errors.contrasenia = "La contraseña es requerida";
        } else if (values.contrasenia.length < 5) {
            errors.contrasenia = "La contraseña debe tener al menos 5 caracteres";
        }

        return errors;
    },

    handleSubmit(values, formikBag) {
        formikBag.setSubmitting(false);
    },
})(LoginContainer);