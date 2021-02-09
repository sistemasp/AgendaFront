import React, { useEffect, useState, Fragment } from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import { showAllAparatologiasBySucursalPendiente, showAllFacialBySucursalAsistio } from "../../../../services/aparatolgia";
import { AparatologiaContainer } from "./aparatologia";

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Aparatologia = (props) => {

    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);

    const { sucursal } = props;

	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;

    const parseToEvents = (aparatologias) => {
        return aparatologias.map( aparatologia => {
            const startDate = new Date(aparatologia.fecha_hora);
            const endDate = new Date(aparatologia.fecha_hora);
            const minutos = Number(endDate.getMinutes()) + Number(aparatologia.tiempo);
            endDate.setMinutes(minutos);
            const tratamientos = aparatologia.tratamientos.map(tratamiento => {
                return `${tratamiento.nombre}, `;
            });
            return {
                id: aparatologia._id,
                title: tratamientos,
                start: startDate,
                end: endDate,
                servicio: aparatologia.servicio
            }
        });
    }
    
    useEffect(() => {
        const loadCitas = async() => {
            const response = await showAllAparatologiasBySucursalPendiente(sucursal, pendienteStatusId);
            
            if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
                setEvents(parseToEvents(response.data));
            }
        }
        setIsLoading(true);
        loadCitas();
        setIsLoading(false);
    }, [sucursal]);

    return (
        <Fragment>
            {
                isLoading 
                ? <Backdrop className={classes.backdrop} open={isLoading} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                : <AparatologiaContainer 
                    events={events} />
            }
        </Fragment>
    );
}

export default Aparatologia;