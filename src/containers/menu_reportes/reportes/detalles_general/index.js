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
	const servicioConsultaId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const servicioCirugiaId = process.env.REACT_APP_CIRUGIA_SERVICIO_ID;
	const servicioEsteticaId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
	const servicioDermapenId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
	const formaPagoTarjetaId = process.env.REACT_APP_FORMA_PAGO_TARJETA;
	const iva = process.env.REACT_APP_IVA;

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

	const procesarConsulta = (consulta, datos) => {
		consulta.iva = false;
		consulta.pagos.forEach(pago => {
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
				pago.banco_nombre = banco ? banco.nombre : 'ERROR';
				pago.tipo_tarjeta_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
				pago.digitos = pago.digitos;
			} else {
				pago.banco_nombre = 'NO APLICA';
				pago.tipo_tarjeta_nombre = 'NO APLICA';
				pago.digitos = 'NO APLICA';
			}

			const impuestoPorcentaje = consulta.iva ? 16 : 0;
			const importe2 = pago.total / (1 + (impuestoPorcentaje / 100));
			const impuesto = importe2 * (impuestoPorcentaje / 100);
			const descuentoPorcentaje = 100 - (pago.total * 100 / consulta.precio);
			const descuentoCantidad = (consulta.precio * descuentoPorcentaje / 100);
			const pagoDermatologo = pago.total * consulta.pago_dermatologo / consulta.precio;
			const pagoClinica = pago.total - pagoDermatologo;
			const dato = {
				...consulta,
				metodo_pago_nombre: metodoPago.nombre,
				tipo_tarjeta: pago.tipo_tarjeta_nombre,
				banco_nombre: pago.banco_nombre,
				digitos: pago.digitos,
				importe_1: consulta.precio_moneda,
				area: "NO APLICA",
				descuento_porcentaje: `${descuentoPorcentaje}%`,
				descuento_cantidad: toFormatterCurrency(descuentoCantidad),
				impuesto_porcentaje: `${impuestoPorcentaje}%`,
				importe_2: toFormatterCurrency(importe2),
				impuesto_cantidad: toFormatterCurrency(impuesto),
				cantidad_servicios: 1 / consulta.pagos.length,
				total_moneda: toFormatterCurrency(pago.total),
				total_doctor: toFormatterCurrency(pagoDermatologo),
				total_clinica: toFormatterCurrency(pagoClinica),
			}
			datos.push(dato);
		});
	}

	const procesarFacial = (facial, datos) => {
		//console.log("KAOZ", facial);
		facial.tratamientos.forEach(tratamiento => {
			const producto = tratamiento;
			let totalPagos = 0;
			facial.pagos.forEach(pago => {
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
					pago.banco_nombre = banco ? banco.nombre : 'ERROR';
					pago.tipo_tarjeta_nombre = tipoTarjeta ? tipoTarjeta.nombre : 'ERROR';
					pago.digitos = pago.digitos;
				} else {
					pago.banco_nombre = 'NO APLICA';
					pago.tipo_tarjeta_nombre = 'NO APLICA';
					pago.digitos = 'NO APLICA';
				}
				producto.areasSeleccionadas.forEach(areaSeleccionada => {
					const impuestoPorcentaje = areaSeleccionada.iva ? 16 : 0;
					pago.cantidad = Number(pago.cantidad);
					areaSeleccionada.precio_real = Number(areaSeleccionada.precio_real);
					while (pago.cantidad !== 0 && areaSeleccionada.precio_real !== 0) {
						totalPagos++;
						let total = 0;
						if (pago.cantidad > areaSeleccionada.precio_real) {
							total = areaSeleccionada.precio_real;
							pago.cantidad -= areaSeleccionada.precio_real;
							areaSeleccionada.precio_real = 0;
						} else if (pago.cantidad < areaSeleccionada.precio_real) {
							total = pago.cantidad;
							areaSeleccionada.precio_real -= pago.cantidad;
							pago.cantidad = 0;
						} else {
							total = areaSeleccionada.precio_real;
							areaSeleccionada.precio_real = 0;
							pago.cantidad = 0;
						}

						const dato = {
							...facial,
							metodo_pago_nombre: metodoPago.nombre,
							producto: producto,
							impuesto_porcentaje: `${impuestoPorcentaje}%`,
							importe_1: toFormatterCurrency(producto.importe1),
							area: areaSeleccionada.nombre,
							tipo_tarjeta: pago.tipo_tarjeta_nombre,
							banco_nombre: pago.banco_nombre,
							digitos: pago.digitos,
							//cantidad_servicios: 1 / producto.areasSeleccionadas.length / facial.pagos.length,
							total_pagos: totalPagos,
							total_moneda: toFormatterCurrency(total),
						}
						datos.push(dato);
					}

				});

			});
		});
	}

	const procesarDatos = async () => {
		const datosCompletos = [...consultas, ...faciales, ...dermapens, ...cirugias, ...esteticas, ...aparatologias];
		const consultasProcesadas = [];
		const facialesProcesadas = [];
		const dermapensProcesadas = [];
		const cirugiasProcesadas = [];
		const esteticasProcesadas = [];
		const aparatologiasProcesadas = [];

		datosCompletos.forEach(async (item) => {
			const fecha = new Date(item.fecha_hora);

			item.fecha_show = `${addZero(fecha.getDate())}/${addZero(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
			item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
			item.precio_moneda = toFormatterCurrency(item.precio);
			item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
			item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
			item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
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

			switch (item.servicio._id) {
				case servicioAparatologiaId:
					break;
				case servicioFacialId:
					procesarFacial(item, facialesProcesadas);
					break;
				case servicioConsultaId:
					procesarConsulta(item, consultasProcesadas);
					break;
				case servicioCirugiaId:
					break;
				case servicioEsteticaId:
					break;
				case servicioDermapenId:
					break;
			}
		});
		facialesProcesadas.forEach(falcial => {
			//console.log("KAOZ", falcial);
			const coincidencias = facialesProcesadas.filter( facialProcesada => {
				return falcial._id === facialProcesada._id && falcial.producto === facialProcesada.producto;
			});
			falcial.cantidad_servicios = 1 / coincidencias.length;
			console.log("KAOZ", coincidencias.length);

		});
		const datos = [...consultasProcesadas, ...facialesProcesadas, ...dermapensProcesadas, ...cirugiasProcesadas, ...esteticasProcesadas, ...aparatologiasProcesadas];
		datos.sort((a, b) => {
			if (a.consecutivo > b.consecutivo) return 1;
			if (a.consecutivo < b.consecutivo) return -1;
			return 0;
		});
		setDatos(datos);
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