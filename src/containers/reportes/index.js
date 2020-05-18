import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesContainer } from "./reportes";
import { findDatesByRangeDateAndSucursal } from "../../services";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero } from "../../utils/utils";

const useStyles = makeStyles(theme => ({
    backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    },
}));

const Reportes = (props) => {

    const classes = useStyles();

    const {
        sucursal,
    } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [citas, setCitas] = useState([]);

    const date = new Date();
    const dia = addZero(date.getDate());
    const mes = addZero(date.getMonth() + 1);
    const anio = date.getFullYear();

    const [startDate, setStartDate] = useState({
        fecha_show: date,
        fecha: `${dia}/${mes}/${anio}`,
    });

    const [endDate, setEndDate] = useState({
      fecha_show: date,
      fecha: `${dia}/${mes}/${anio}`,
  });

    const columns = [
        { title: 'Fecha', field: 'fecha_show' },
        { title: 'Hora', field: 'hora' },
        { title: 'Paciente', field: 'paciente_nombre' },
        { title: 'Telefono', field: 'paciente.telefono' },
        { title: 'Servicio', field: 'servicio' },
        { title: 'Tratamientos', field: 'show_tratamientos' },
        { title: 'Numero Sesion', field: 'numero_sesion' },
        { title: 'Quien agenda', field: 'quien_agenda.nombre' },
        { title: 'Tipo Cita', field: 'tipo_cita' },
        { title: 'Quien confirma', field: 'quien_confirma.nombre' },
        { title: 'Promovendedor', field: 'promovendedor_nombre' },
        { title: 'Dermatologo', field: 'dermatologo_nombre' },
        { title: 'Cosmetologa', field: 'cosmetologa_nombre' },
        { title: 'Estado', field: 'asistio' },
        { title: 'Motivos', field: 'motivos' },
        { title: 'Precio', field: 'precio_moneda' },
        { title: 'Tiempo (minutos)', field: 'tiempo' },
        { title: 'Observaciones', field: 'observaciones'},
    ];

    const options = {
        rowStyle: rowData => {
            const {asistio} = rowData;
            if (asistio === 'NO ASISTIO') {
                return { color: '#B7B4A1' };
            } else if (asistio === 'CANCELO') {
                return { color: '#FF0000', fontWeight: 'bold' };
            } else if (asistio === 'REAGENDO') {
                return { color: '#FBD014' };
            }
        },
        headerStyle: {
            backgroundColor: '#2BA6C6',
            color: '#FFF',
            fontWeight: 'bolder',
            fontSize: '18px'
        },
        exportAllData: true,
        exportButton: true,
        exportDelimiter: ';'
    }

    useEffect(() => {

        const loadCitas = async() => {
            const response = await findDatesByRangeDateAndSucursal(date.getDate(), (date.getMonth() + 1), date.getFullYear(),
                date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal);
            
            if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
                await response.data.forEach( item => {
                    item.precio_moneda = toFormatterCurrency(item.precio);
                    item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
                    item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
                    item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
                    item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
                    item.show_tratamientos = item.tratamientos.map(tratamiento => {
                        return `${tratamiento.nombre}, `;
                    });

                    const splitDate = (item.fecha).split('/');
                    item.fecha_show = `${addZero(splitDate[0])}/${addZero(splitDate[1])}/${splitDate[2]}`;
                });
                setCitas(response.data);
            }
        }
        setIsLoading(true);
        loadCitas();
        setIsLoading(false);
    }, [sucursal]);

    const handleChangeStartDate = async(date) => {
        setIsLoading(true);
        const dia = addZero(date.getDate());
        const mes = addZero(date.getMonth() + 1);
        const anio = date.getFullYear();
        setStartDate({
            fecha_show: date,
            fecha: `${dia}/${mes}/${anio}`
        });
        setIsLoading(false);
    };

    const handleChangeEndDate = async(date) => {
        setIsLoading(true);
        const dia = addZero(date.getDate());
        const mes = addZero(date.getMonth() + 1);
        const anio = date.getFullYear();
        setEndDate({
            fecha_show: date,
            fecha: `${dia}/${mes}/${anio}`
        });
        
        setIsLoading(false);
    };

    const handleReportes = async() => {
        await loadCitas(startDate.fecha_show, endDate.fecha_show);
    }

    const loadCitas = async(startDate, endDate) => {
        const response = await findDatesByRangeDateAndSucursal(startDate.getDate(), (startDate.getMonth() + 1), startDate.getFullYear(),
            endDate.getDate(), (endDate.getMonth() + 1), endDate.getFullYear(), sucursal);
        if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
            response.data.forEach( item => {
                item.precio_moneda = toFormatterCurrency(item.precio);

                item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
                item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
                item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
                item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
                item.show_tratamientos = item.tratamientos.map(tratamiento => {
                    return `${tratamiento.nombre}, `;
                });
                
                const splitDate = (item.fecha).split('/');
                item.fecha_show = `${addZero(splitDate[0])}/${addZero(splitDate[1])}/${splitDate[2]}`;
            });
            setCitas(response.data);
        }
    }

    const actions = [
    ];

    return (
        <Fragment>
            { 
            !isLoading ? 
            <ReportesContainer                     
              onChangeStartDate={(e) => handleChangeStartDate(e)}
              onChangeEndDate={(e) => handleChangeEndDate(e)}
              startDate={startDate.fecha_show}
              endDate={endDate.fecha_show}
              titulo={ `REPORTES (${startDate.fecha} - ${endDate.fecha})`}
              columns={columns}
              options={options}
              citas={citas}
              actions={actions}
              loadCitas={loadCitas}
              onClickReportes={handleReportes}
              {...props} />
            : <Backdrop className={classes.backdrop} open={isLoading} >
                <CircularProgress color="inherit" />
            </Backdrop>
            }          
        </Fragment>
    );
}

export default Reportes;