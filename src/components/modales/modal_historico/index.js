import React, { useState, Fragment, useEffect } from "react";
import { MenuHistoricoContainer } from "./menu";
import { getAllServices } from "../../../services";

const MenuHistoricos = (props) => {

    const [value, setValue] = useState(0);
    const [servicios, setServicios] = useState([]);
    const {
        sucursal,
        empleado,
        paciente,
        open,
        onClose,
    } = props;

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const loadServicios = async () => {
            const response = await getAllServices();
            if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
                setServicios(response.data);
            }
        }
        loadServicios();
    }, []);

    return (
        <Fragment>
            <MenuHistoricoContainer
                onChangeTab={handleChangeTab}
                empleado={empleado}
                sucursal={sucursal}
                open={open}
                value={value}
                paciente={paciente}
                onClickCancel={onClose}
                servicios={servicios} />
        </Fragment>
    );
}

export default MenuHistoricos;