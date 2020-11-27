import React, { useState, Fragment } from "react";
import { MenuContainer } from "./menu";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuPatient = (props) => {

    const [pacienteAgendado, setPacienteAgendado] = useState({});
    const [consultaAgendada, setConsultaAgendada] = useState({});
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

    const handleAgendarFaciales = (event, rowData) => {
        setPacienteAgendado(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_FACIALES));
    }

    const handleAgendarLaser = (event, rowData) => {
        setPacienteAgendado(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_LASER));
    }

    const handleAgendarAparatologia = (event, rowData) => {
        setPacienteAgendado(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_APARATOLOGIA));
    }

    const handleAgendarDermapen = (event, rowData) => {
        setConsultaAgendada(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_DERMAPEN));
    }

    const handleClickAgendarConsulta = (event, rowData) => {
        setPacienteAgendado(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_CONSULTA));
    }

    const handleClickAgendarCirugia = (event, rowData) => {
        setConsultaAgendada(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_CIRUGIA));
    }

    const handleClickAgendarEstetica = (event, rowData) => {
        setConsultaAgendada(rowData);
        setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_ESTETICA));
    }

    const handleLogout = () => {
        history.push('/', { empleado: {}, sucursal: {} });
    }

    const handleClickCambioPassword = () => {
        setOpen(true);
    }

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
            <MenuContainer
                pacienteAgendado={pacienteAgendado}
                setPacienteAgendado={setPacienteAgendado}
                setConsultaAgendada={setConsultaAgendada}
                consultaAgendada={consultaAgendada}
                onChangeTab={handleChangeTab}
                onClickAgendarFaciales={handleAgendarFaciales}
                onClickAgendarConsulta={handleClickAgendarConsulta}
                onClickAgendarCirugia={handleClickAgendarCirugia}
                onClickAgendarEstetica={handleClickAgendarEstetica}
                //onClickAgendarLaser={handleAgendarLaser}
                onClickAgendarAparatologia={handleAgendarAparatologia}
                onClickAgendarDermapen={handleAgendarDermapen}
                empleado={empleado}
                sucursal={sucursal}
                open={open}
                onClickLogout={handleLogout}
                onClickCambioPassword={handleClickCambioPassword}
                onOpen={handleOpen}
                onClose={handleClose}
                value={value}
                setMessage={setMessage}
                setSeverity={setSeverity}
                setOpenAlert={setOpenAlert}
                history={history} />
            <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}

export default MenuPatient;