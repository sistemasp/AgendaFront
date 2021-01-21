import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { ReportesDetalleGeneralContainer } from "./reportes_detalle_general";
import { findConsultsByRangeDateAndSucursal } from "../../../../services/consultas";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { toFormatterCurrency, addZero, getPagoDermatologoByServicio } from "../../../../utils/utils";
import { findFacialByRangeDateAndSucursal, findFacialByRangeDateAndSucursalAndService } from "../../../../services/faciales";
import { findAparatologiaByRangeDateAndSucursal, findAparatologiaByRangeDateAndSucursalAndService } from "../../../../services/aparatolgia";
import { findEsteticasByRangeDateAndSucursal } from "../../../../services/esteticas";
import { findCirugiasByRangeDateAndSucursal } from "../../../../services/cirugias";
import { findDermapenByRangeDateAndSucursal } from "../../../../services/dermapens";
import { showAllBanco, showAllMetodoPago, showAllTipoTarjeta } from "../../../../services";
import { findRazonSocialById } from "../../../../services/razones_sociales";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ReportesDetallesGeneral = (props) => {

	const classes = useStyles();

	const {
		sucursal,
	} = props;

	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
	const servicioFacialId = process.env.REACT_APP_FACIAL_SERVICIO_ID;
	const formaPagoTarjetaId = process.env.REACT_APP_FORMA_PAGO_TARJETA;

	const [isLoading, setIsLoading] = useState(true);
	const [consultas, setConsultas] = useState([]);
	const [faciales, setFaciales] = useState([]);
	const [cirugias, setCirugias] = useState([]);
	const [dermapens, setDermapens] = useState([]);
	const [aparatologias, setAparatologias] = useState([]);
	const [esteticas, setEsteticas] = useState([]);
	const [datos, setDatos] = useState([]);

	const [bancos, setBancos] = useState([]);
	const [metodosPago, setMetodosPago] = useState([]);
	const [tiposTarjeta, setTiposTarjeta] = useState([]);

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
		{ title: 'FECHA', field: 'fecha_show' },
		{ title: 'SUCURSAL', field: 'sucursal.nombre' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'HORA ATENDIDO', field: 'hora_atencion' },
		{ title: 'HORA SALIDA', field: 'hora_salida' },
		{ title: 'RECEPCIONISTA', field: 'quien_agenda.nombre' },
		{ title: 'FOLIO', field: 'consecutivo' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'FRECUENCIA', field: 'frecuencia.nombre' },
		{ title: 'TIPO', field: 'tipo_cita.nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'CANTIDAD SERVICIOS', field: 'cantidad_servicios' },
		{ title: 'SERVICIO', field: 'servicio.nombre' },
		{ title: 'PRODUCTO', field: 'producto.nombre' },
		{ title: 'ZONA', field: 'area' },
		{ title: 'IMPORTE 1', field: 'importe_1' },
		{ title: '% DESCUENTO', field: 'descuento_porcentaje' },
		{ title: '$ DESCUENTO', field: 'descuento_cantidad' },
		{ title: 'IMPORTE 2', field: 'importe_2' },
		{ title: '% IMPUESTO', field: 'impuesto_porcentaje' },
		{ title: '$ IMPUESTO', field: 'impuesto_cantidad' },
		{ title: 'TOTAL', field: 'total_moneda' },
		{ title: 'TOTAL DOCTOR', field: 'total_doctor' },
		{ title: 'TOTAL CLÍNICA', field: 'total_clinica' },
		{ title: 'METODO DE PAGO', field: 'metodo_pago_nombre' },
		{ title: 'FACTURA', field: 'requiere_factura' },
		{ title: 'TARJETA', field: 'tipo_tarjeta' },
		{ title: 'BANCO', field: 'banco_nombre' },
		{ title: 'DÍGITOS', field: 'digitos' },
		{ title: 'RAZÓN SOCIAL', field: 'razon_social_nombre' },
		{ title: 'RFC', field: 'rfc' },
		{ title: 'NO. DE FACTURA', field: 'no_factura' },
		{ title: 'FECHA FACTURACIÓN', field: 'fecha_facturacion' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },

	];

	const options = {
		/*rowStyle: rowData => {
			return { 
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? '#10CC88' : ''
			};
		},*/
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: true,
		exportDelimiter: ';'
	}

	const procesarDatos = async () => {
		const datosCompletos = [...consultas, ...faciales, ...dermapens, ...cirugias, ...esteticas, ...aparatologias];
		datosCompletos.forEach(async (item) => {
			const fecha = new Date(item.fecha_hora);

			item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
			item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
			item.precio_moneda = toFormatterCurrency(item.precio);
			item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
			item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
			item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			item.cantidad_servicios = 1;
			item.observaciones = item.observaciones ? item.observaciones : "*";
			if (item.factura) {
				const fechaFactura = new Date(item.factura.fecha_hora);
				item.requiere_factura = "SI";
				item.fecha_facturacion = `${addZero(fechaFactura.getDate())}/${addZero(fechaFactura.getMonth() + 1)}/${fechaFactura.getFullYear()}`;
				item.razon_social_nombre = item.factura.razon_social.nombre_completo;
				item.rfc = item.factura.razon_social.rfc;
				item.no_factura = item.factura.no_factura;
			} else {
				item.requiere_factura = "NO";
				item.razon_social_nombre = "NO APLICA";
				item.rfc = "NO APLICA";
				item.no_factura = "NO APLICA";
				item.fecha_facturacion = "NO APLICA";
			}

			if (item.pagos.length > 0) {
				let total = 0;
				let importe1 = 0;

				item.pagos.forEach(async (pago) => {

					const metodoPago = metodosPago.find(metodoPago => {
						return metodoPago._id === pago.forma_pago;
					});
					if (pago.forma_pago === formaPagoTarjetaId) {
						const banco = bancos.find(banco => {
							return banco._id === pago.banco;
						});
						const tipoTarjeta = tiposTarjeta.find(tipoTarjeta => {
							return tipoTarjeta._id === pago.tipo_tarjeta;
						});
						item.tipo_tarjeta = banco ? banco.nombre : 'ERROR';
						item.banco_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
						item.digitos = pago.digitos;
					} else {
						item.tipo_tarjeta = 'NO APLICA';
						item.banco_nombre = 'NO APLICA';
						item.digitos = 'NO APLICA';
					}
					item.metodo_pago_nombre = metodoPago ? metodoPago.nombre : 'ERROR';
					item.descuento_porcentaje = `${pago.porcentaje_descuento_clinica}%`;
					item.descuento_cantidad = toFormatterCurrency(pago.descuento_clinica);
					importe1 += Number(pago.total);
					total += Number(pago.total - pago.descuento_clinica);
				});

				const impuestoPorcentaje = 0;

				item.impuesto_porcentaje = `${impuestoPorcentaje}%`;
				item.importe_1 = toFormatterCurrency(importe1);
				item.total_moneda = toFormatterCurrency(total);
				item.importe_2 = Number(total) / (1 + Number());
				item.impuesto_cantidad = toFormatterCurrency(item.importe_2 * impuestoPorcentaje / 100);
				item.importe_2 = toFormatterCurrency(item.importe_2);
				item.total_doctor = toFormatterCurrency(item.pago_dermatologo);
				item.total_clinica = toFormatterCurrency(Number(total - item.pago_dermatologo));
			} else {
				item.importe_1 = "NO APLICA";
				item.descuento_porcentaje = "NO APLICA";
				item.descuento_cantidad = "NO APLICA";
				item.importe_2 = "NO APLICA";
				item.impuesto_porcentaje = "NO APLICA";
				item.impuesto_cantidad = "NO APLICA";
				item.total_moneda = "NO APLICA";
				item.total_doctor = "NO APLICA";
				item.total_clinica = "NO APLICA";
				item.metodo_pago_nombre = "NO APLICA";
				item.requiere_factura = "NO APLICA";
				item.tipo_tarjeta = "NO APLICA";
				item.banco_nombre = "NO APLICA";
				item.digitos = "NO APLICA";
				item.razon_social_nombre = "NO APLICA";
				item.rfc = "NO APLICA";
				item.no_factura = "NO APLICA";
				item.fecha_facturacion = "NO APLICA";

			}

			if (item.tratamientos) {
				// REMOVER ITEM DE DATOSCOMPLETOS

				/*item.show_tratamientos = item.tratamientos.map(tratamiento => {
					const show_areas = tratamiento.areasSeleccionadas.map(area => {
						return `${area.nombre}`;
					});
					return `►${tratamiento.nombre}(${show_areas})`;
				});*/

				item.tratamientos.forEach(tratamiento => {
					if (item.servicio._id === servicioAparatologiaId || item.servicio._id === servicioFacialId) {
						item.producto = { nombre: tratamiento.nombre };
					}
					tratamiento.areasSeleccionadas.forEach(area => {
						item.area = area.nombre;
					});
				});
			} else {
				item.area = "NO APLICA";
			}

		});
		datosCompletos.sort((a, b) => {
			if (a.consecutivo > b.consecutivo) return 1;
			if (a.consecutivo < b.consecutivo) return -1;
			return 0;
		});
		setDatos(datosCompletos);
		setIsLoading(false);
	}

	const loadConsultas = async (startDate, endDate) => {
		const response = await findConsultsByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setConsultas(response.data);
			procesarDatos();
		}
	}

	const loadFaciales = async (startDate, endDate) => {
		const response = await findFacialByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setFaciales(response.data);
			await loadConsultas(startDate, endDate);
		}
	}

	const loadAparatologias = async (startDate, endDate) => {
		const response = await findAparatologiaByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setAparatologias(response.data);
			await loadFaciales(startDate, endDate);
		}
	}

	const loadEsteticas = async (startDate, endDate) => {
		const response = await findEsteticasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setEsteticas(response.data);
			await loadAparatologias(startDate, endDate);
		}
	}

	const loadCirugias = async (startDate, endDate) => {
		const response = await findCirugiasByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setCirugias(response.data);
			await loadEsteticas(startDate, endDate);
		}
	}

	const loadDermapens = async (startDate, endDate) => {
		const response = await findDermapenByRangeDateAndSucursal(startDate.getDate(), startDate.getMonth(), startDate.getFullYear(),
			endDate.getDate(), endDate.getMonth(), endDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setDermapens(response.data);
			await loadCirugias(startDate, endDate);
		}
	}

	const handleChangeStartDate = async (date) => {
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

	const handleChangeEndDate = async (date) => {
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

	const loadMetodosPago = async () => {
		const response = await showAllMetodoPago();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setMetodosPago(response.data);
		}
	}

	const loadTipoTarjeta = async () => {
		const response = await showAllTipoTarjeta();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setTiposTarjeta(response.data);
		}
	}

	const loadBancos = async () => {
		const response = await showAllBanco();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setBancos(response.data);
		}
	}

	const loadInfo = async (startDate, endDate) => {
		setIsLoading(true);
		await loadMetodosPago();
		await loadTipoTarjeta();
		await loadBancos();
		await loadDermapens(startDate, endDate);
	}

	const handleReportes = async () => {
		await loadInfo(startDate.fecha_show, endDate.fecha_show);
	}

	const actions = [
	];

	useEffect(() => {
		loadInfo(startDate.fecha_show, endDate.fecha_show);
	}, [startDate, endDate]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ReportesDetalleGeneralContainer
						onChangeStartDate={(e) => handleChangeStartDate(e)}
						onChangeEndDate={(e) => handleChangeEndDate(e)}
						startDate={startDate.fecha_show}
						endDate={endDate.fecha_show}
						titulo={`REPORTES DETALLES GENERAL(${startDate.fecha} - ${endDate.fecha})`}
						columns={columns}
						options={options}
						datos={datos}
						actions={actions}
						onClickReportes={handleReportes}
						{...props} />
					: <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
		</Fragment>
	);
}

export default ReportesDetallesGeneral;