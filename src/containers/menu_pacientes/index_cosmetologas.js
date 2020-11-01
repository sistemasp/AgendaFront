import React, { useState, Fragment } from "react";
import { MenuContainer } from "./menu";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { MenuCosmetologaContainer } from "./menu_cosmetologas";

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuPatientForCosmetologas = (props) => {

    const [pacienteAgendado, setPacienteAgendado] = useState({});
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const {
        sucursal,
        empleado,
        history,
    } = props;

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Fragment>
            <MenuCosmetologaContainer 
                pacienteAgendado={pacienteAgendado}
                setPacienteAgendado={setPacienteAgendado}
                onChangeTab={handleChangeTab}
                empleado={empleado}
                sucursal={sucursal}
                open={open}
                onOpen={handleOpen}
                onClose={handleClose}
                value={value}
                setMessage={setMessage}
                setSeverity={setSeverity}
                setOpenAlert={setOpenAlert}
                history={history}/>
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Fragment>        
    );
}

export default MenuPatientForCosmetologas;