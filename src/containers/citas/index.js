import React, { useEffect, useState, Fragment } from "react";
import { CitasContainer } from "./citas";
import { showAllDatesBySucursalAsistio } from "../../services";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Citas = (props) => {

    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);

    const { sucursal } = props;

    const parseToEvents = (citas) => {
        return citas.map( cita => {
            const splitDate = (cita.fecha).split('/');
            const splitHora = (cita.hora).split(':');
            const startDate = new Date(splitDate[2], (splitDate[1] - 1), splitDate[0], splitHora[0], splitHora[1], 0);
            const endDate = new Date(splitDate[2], (splitDate[1] - 1), splitDate[0], splitHora[0], splitHora[1], 0);
            const minutos = Number(endDate.getMinutes()) + Number(cita.tiempo);
            endDate.setMinutes(minutos);
            const tratamientos = cita.tratamientos.map(tratamiento => {
                return `${tratamiento.nombre}, `;
            });
            return {
                id: cita._id,
                title: tratamientos,
                start: startDate,
                end: endDate
            }
        });
    }
    
    useEffect(() => {
        const loadCitas = async() => {
            const response = await showAllDatesBySucursalAsistio(sucursal);
            
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
                : <CitasContainer 
                    events={events} />
            }
        </Fragment>
    );
}

export default Citas;