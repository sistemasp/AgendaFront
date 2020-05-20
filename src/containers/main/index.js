import React, { useState, Fragment } from "react";
import { MainContainer } from "./main";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuMain = (props) => {

    const [pacienteAgendado, setPacienteAgendado] = useState({});
    const [value, setValue] = useState(0);
    const [openModalPassword, setOpenModalPassword] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const { 
        empleado,
        sucursal,
    } = props.location.state;

    const {
        history,
    } = props;

    console.log("Props", props);

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const handleAgendar = (event, rowData) => {
        setPacienteAgendado(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR));
    }

    const handleLogout = () => {
        history.push('/', { empleado: {}, sucursal: {} });
    }

    const handleClickCambioPassword = () => {
        setOpenModalPassword(true);
    }

    const handleClose = () => {
        setOpenModalPassword(false);
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Fragment>
            <MainContainer 
                pacienteAgendado={pacienteAgendado}
                setPacienteAgendado={setPacienteAgendado}
                onChangeTab={handleChangeTab}
                onClickAgendar={handleAgendar}
                empleado={empleado}
                sucursal={sucursal}
                openModalPassword={openModalPassword}
                onClickLogout={handleLogout}
                onClickCambioPassword={handleClickCambioPassword}
                onClose={handleClose}
                value={value}
                setMessage={setMessage}
                setSeverity={setSeverity}
                setOpenAlert={setOpenAlert}/>
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Fragment>        
    );
}

export default MenuMain;