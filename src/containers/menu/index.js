import React, { useState } from "react";
import { MenuContainer } from "./menu";

const MenuMain = (props) => {

    const [pacienteAgendado, setPacienteAgendado] = useState({});
    const [value, setValue] = useState(0);

    const { 
        empleado,
        sucursal,
    } = props.location.state;

    const {
        history,
    } = props;

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

    return (
        <MenuContainer 
            pacienteAgendado={pacienteAgendado}
            setPacienteAgendado={setPacienteAgendado}
            onChangeTab={handleChangeTab}
            onClickAgendar={handleAgendar}
            empleado={empleado}
            sucursal={sucursal}
            onClickLogout={handleLogout}
            value={value}/>
    );
}

export default MenuMain;