import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;
const urlSepomexGetEstados = 'https://api-sepomex.hckdrk.mx/query/get_estados';
const urlSepomexGetMunicipos = 'https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/';
const urlSepomexGetColonia = 'https://api-sepomex.hckdrk.mx/query/get_colonia_por_municipio/';
const urlSepomexGetAllInfoByCP = 'https://api-sepomex.hckdrk.mx/query/info_cp/';

// PACIENTES

export const getAllPatients = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllPatients', error);
    }
}

export const findPatientByPhoneNumber = async (telefono) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/phonenumber/${telefono}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findPatientByPhoneNumber', error);
    }
}

export const updatePatient = async (pacienteId, paciente) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/${pacienteId}`,
            method: 'PUT',
            data: paciente
        });
        return response;
    } catch (error) {
        console.log('updatePatient', error);
    }
}

export const createPatient = async (paciente) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'POST',
            data: paciente
        });
        return response;
    } catch (error) {
        console.log('createPatient', error);
    }
}

// SERVICIOS

export const getAllServices = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/servicio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllServices', error);
    }
}

// TRATAMIENTOS

export const getAllTreatments = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamiento`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getTreatments', error);
    }
}

export const findTreatmentByServicio = async (servicioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamiento/servicio/${servicioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTreatmentByServicio', error);
    }
}

// AREAS

export const findAreasByTreatmentServicio = async (servicioId, tratamientoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/area/servicio/${servicioId}/tratamiento/${tratamientoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAreasByTreatmentServicio', error);
    }
}

// HORARIO

export const getAllSchedules = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllSchedules', error);
    }
}

export const findSchedulesBySucursalAndServicio = async (idSucursal, idServicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/sucursal/${idSucursal}/servicio/${idServicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllSchedules', error);
    }
}

export const findScheduleByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDate', error);
    }
}

export const findScheduleByDateAndSucursalAndService = async (dia, mes, anio, sucursalId, servicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}/${sucursalId}/${servicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDateAndSucursalAndService', error);
    }
}

export const findScheduleInConsultByDateAndSucursal = async (consultaId, dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/consulta/${consultaId}/${dia}/${mes}/${anio}/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleInConsultByDateAndSucursal', error);
    }
}

// CITAS

export const getAllDates = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDates', error);
    }
}

export const getAllDatesBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDatesBySucursal', error);
    }
}

export const showAllDatesBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDatesBySucursalAsistio', error);
    }
}

export const findDatesByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDate', error);
    }
}

export const findDatesByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDateAndSucursal', error);
    }
}

export const findDatesByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByRangeDateAndSucursal', error);
    }
}

export const findHistoricByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/histotic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricByPaciente', error);
    }
}

export const findHistoricByPacienteAndService = async (pacienteId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/histotic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricByPacienteAndService', error);
    }
}

export const findDateById = async (citaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${citaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDateById', error);
    }
}

export const createDate = async (cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'POST',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('createDate', error);
    }
}

export const updateDate = async (dateId, cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dateId}`,
            method: 'PUT',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('updateDate', error);
    }
}

export const waitingListTratamiento = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListTratamiento', error);
    }
}
export const findDatesByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, medicoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}/sucursal/${sucursalId}/medico/${medicoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByPayOfDoctorTurno', error);
    }
}

// RECEPCIONISTAS

export const findRecepcionistByEmployeeNumber = async (employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/recepcionista/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRecepcionistByEmployeeNumber', error);
    }
}

// EMPLEADOS

export const findEmployeeByEmployeeNumber = async (employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeeByEmployeeNumber', error);
    }
}

export const loginEmployee = async (employeeNumber, password) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/login/${employeeNumber}/${password}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('loginEmployee', error);
    }
}

export const findEmployeesByRolId = async (rolId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/rol/${rolId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeesByRolId', error);
    }
}

export const findEmployeesByRolIdAvailable = async (rolId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/rol/${rolId}/available`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeesByRolIdAvailable', error);
    }
}

export const updateEmployee = async (employeeId, employee) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/${employeeId}`,
            method: 'PUT',
            data: employee
        });
        return response;
    } catch (error) {
        console.log('updateEmployee', error);
    }
}

// SUCURSALES

export const showAllOffices = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/sucursal`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllOffices', error);
    }
}

export const findOfficeById = async (idSucursal) => {
    try {
        const response = await axios({
            url: `${baseUrl}/sucursal/${idSucursal}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findOfficeById', error);
    }
}

// CONSULTORIOS

export const findSurgeryBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalId', error);
    }
}

export const findSurgeryBySucursalIdWaitingList = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/waitinglist/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalIdWaitingList', error);
    }
}

export const findSurgeryBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalIdAndFree', error);
    }
}

export const createSurgery = async (consultorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio`,
            method: 'POST',
            data: consultorio
        });
        return response;
    } catch (error) {
        console.log('createSurgery', error);
    }
}

export const updateSurgery = async (surgeryId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/${surgeryId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateSurgery', error);
    }
}

export const breakFreeSurgeryByIdPaciente = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/liberar/paciente/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSurgeryByIdPaciente', error);
    }
}

export const breakFreeSurgeryByIdMedico = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/liberar/medico/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSurgeryByIdMedico', error);
    }
}

// SALA DE CIRUGIA

export const findSalaCirugiaBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCirugiaBySucursalId', error);
    }
}

export const findSalaCirugiaBySucursalIdWaitingList = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/waitinglist/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCirugiaBySucursalIdWaitingList', error);
    }
}

export const findSalaCirugiaBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCirugiaBySucursalIdAndFree', error);
    }
}

export const createSalaCirugia = async (consultorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia`,
            method: 'POST',
            data: consultorio
        });
        return response;
    } catch (error) {
        console.log('createSalaCirugia', error);
    }
}

export const updateSalaCirugia = async (salaCirugiaId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/${salaCirugiaId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateSalaCirugia', error);
    }
}

export const breakFreeSalaCirugiaByIdPaciente = async (salaCirugiaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/liberar/paciente/${salaCirugiaId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSalaCirugiaByIdPaciente', error);
    }
}

export const breakFreeSalaCirugiaByIdMedico = async (salaCirugiaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/liberar/medico/${salaCirugiaId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSalaCirugiaByIdMedico', error);
    }
}

// CABINAS

export const findCabinaBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalId', error);
    }
}

export const findCabinaBySucursalIdWaitingList = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/waitinglist/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalIdWaitingList', error);
    }
}

export const findCabinaBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalIdAndFree', error);
    }
}

export const createCabina = async (cabina) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina`,
            method: 'POST',
            data: cabina
        });
        return response;
    } catch (error) {
        console.log('createCabina', error);
    }
}

export const updateCabina = async (surgeryId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/${surgeryId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateCabina', error);
    }
}

export const breakFreeCabinaByIdPaciente = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/liberar/paciente/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeCabinaByIdPaciente', error);
    }
}

export const breakFreeCabinaByIdMedico = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/liberar/medico/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeCabinaByIdMedico', error);
    }
}

// CONSULTAS

export const getAllConsults = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllConsults', error);
    }
}

export const getAllConsultsBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllConsultsBySucursal', error);
    }
}

export const showAllConsultsBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllConsultsBySucursalAsistio', error);
    }
}

export const findConsultsByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByDate', error);
    }
}

export const findConsultsByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByDateAndSucursal', error);
    }
}

export const findConsultsByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByRangeDateAndSucursal', error);
    }
}

export const findHistoricConsultByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/histotic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricConsultByPaciente', error);
    }
}

export const findHistoricConsultByMedico = async (medicoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/histotic/medico/${medicoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricConsultByMedico', error);
    }
}

export const findConsultById = async (consultId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${consultId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultById', error);
    }
}


export const createConsult = async (consulta) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta`,
            method: 'POST',
            data: consulta
        });
        return response;
    } catch (error) {
        console.log('createConsult', error);
    }
}

export const updateConsult = async (dateId, consulta) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dateId}`,
            method: 'PUT',
            data: consulta
        });
        return response;
    } catch (error) {
        console.log('updateConsult', error);
    }
}

export const waitingListConsulta = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListConsulta', error);
    }
}

// TIPO CITAS

export const showAllTipoCitas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipocita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoCitas', error);
    }
}

// MEDIO

export const showAllMedios = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/medio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMedios', error);
    }
}

// STATUS

export const showAllStatus = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/status`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllStatus', error);
    }
}

// BANCOS

export const showAllBanco = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/banco`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllBanco', error);
    }
}

// METODO PAGO

export const showAllMetodoPago = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/metodopago`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMetodoPago', error);
    }
}

// TIPO TARJETA

export const showAllTipoTarjeta = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipotarjeta`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoTarjeta', error);
    }
}

// PAGOS

export const createPago = async (pago) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago`,
            method: 'POST',
            data: pago
        });
        return response;
    } catch (error) {
        console.log('createPago', error);
    }
}

export const findPaysByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findPaysByRangeDateAndSucursal', error);
    }
}

export const findPagoByIds = async (pagosIds) => {
    console.log('PAGOS IDS', pagosIds);
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/${pagosIds}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagoByIds', error);
    }
}

export const findPagosByCita = async (idCita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/cita/${idCita}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagosByCita', error);
    }
}

export const findPagosByTipoServicioAndServicio = async (idTipoServicio, idServicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/tipo_servicio/${idTipoServicio}/servicio/${idServicio}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagosByTipoServicioAndServicio', error);
    }
}

export const updatePago = async (pagoId, pago) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/${pagoId}`,
            method: 'PUT',
            data: pago
        });
        return response;
    } catch (error) {
        console.log('updatePago', error);
    }
}

// RAZON SOCIAL

export const showAllRazonSocials = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllRazonSocials', error);
    }
}

export const updateRazonSocial = async (razonSocialId, razonSocial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial/${razonSocialId}`,
            method: 'PUT',
            data: razonSocial
        });
        return response;
    } catch (error) {
        console.log('updateRazonSocial', error);
    }
}

export const createRazonSocial = async (razonSocial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial`,
            method: 'POST',
            data: razonSocial
        });
        return response;
    } catch (error) {
        console.log('createRazonSocial', error);
    }
}

// SEPOMEX

export const sepomexGetEstados = async () => {
    try {
        const response = await axios({
            url: urlSepomexGetEstados,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetEstados', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetMunicipos = async (estado) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetMunicipos}${estado}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetMunicipos', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetColonia = async (municipio) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetColonia}${municipio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetColonia', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetAllInfoByCP = async (cp) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetAllInfoByCP}${cp}?type=simplified`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetAllInfoByCP', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

// USO CFDI

export const showAllUsoCfdis = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/usocfdi`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllUsoCfdis', error);
    }
}

// FACTURAS 

export const createFactura = async (factura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura`,
            method: 'POST',
            data: factura
        });
        return response;
    } catch (error) {
        console.log('createFactura', error);
    }
}

export const findFacturasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacturasByRangeDateAndSucursal', error);
    }
}

export const findFacturaByRazonSocialId = async (razonSocialId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/razonsocial/${razonSocialId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacturaByRazonSocialId', error);
    }
}

// TRATAMIENTO-PRECIO

export const createTreatmentPrice = async (tratamientoprecio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamientoprecio`,
            method: 'POST',
            data: tratamientoprecio
        });
        return response;
    } catch (error) {
        console.log('createTreatmentPrice', error);
    }
}

// FRECUENCIAS

export const showAllFrecuencias = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/frecuencia`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllFrecuencias', error);
    }
}

// SEXOS

export const showAllSexos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/sexo`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllSexos', error);
    }
}

// MEDICOS

export const findConsultsByPayOfDoctor = async (dia, mes, anio, sucursalId, medicoId, atendidoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/medico/${medicoId}/atendido/${atendidoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctor', error);
    }
}

export const findConsultsByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, medicoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/medico/${medicoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorTurno', error);
    }
}

export const findConsultsByPayOfDoctorTurnoFrecuencia = async (dia, mes, anio, sucursalId, medicoId, atendidoId, turno, frecuenciaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/medico/${medicoId}/atendido/${atendidoId}/turno/${turno}/frecuencia/${frecuenciaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorTurnoFrecuencia', error);
    }
}

export const findCirugiasByPayOfDoctor = async (dia, mes, anio, sucursalId, medicoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${dia}/${mes}/${anio}/sucursal/${sucursalId}/medico/${medicoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfDoctor', error);
    }
}

export const findCirugiasByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, medicoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${dia}/${mes}/${anio}/sucursal/${sucursalId}/medico/${medicoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfDoctorTurno', error);
    }
}

export const findEsteticasByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, medicoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${dia}/${mes}/${anio}/sucursal/${sucursalId}/medico/${medicoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByPayOfDoctorTurno', error);
    }
}

// MATERIALES

export const showAllMaterials = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/material`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMaterials', error);
    }
}

// CIRUGIA

export const createCirugia = async (cirugia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia`,
            method: 'POST',
            data: cirugia
        });
        return response;
    } catch (error) {
        console.log('createCirugia', error);
    }
}

export const updateCirugia = async (idCirugia, cirugia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${idCirugia}`,
            method: 'PUT',
            data: cirugia
        });
        return response;
    } catch (error) {
        console.log('updateCirugia', error);
    }
}

export const findCirugiaById = async (cirugiaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${cirugiaId}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findCirugiaById', error);
    }
}

export const findCirugiaByConsultaId = async (consultaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/consulta/${consultaId}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findCirugiaByConsultaId', error);
    }
}

export const findCirugiasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByRangeDateAndSucursal', error);
    }
}

export const waitingListCirugia = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/waitingList/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListCirugia', error);
    }
}

// ESTETICA ( TOXINAS Y RELLENOS )

export const createEstetica = async (estetica) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica`,
            method: 'POST',
            data: estetica
        });
        return response;
    } catch (error) {
        console.log('createEstetica', error);
    }
}

export const updateEstetica = async (idEstetica, estetica) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${idEstetica}`,
            method: 'PUT',
            data: estetica
        });
        return response;
    } catch (error) {
        console.log('updateEstetica', error);
    }
}

export const findEsteticaById = async (esteticaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${esteticaId}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findEsteticaById', error);
    }
}

export const findEsteticaByConsultaId = async (consultaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/consulta/${consultaId}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findEsteticaByConsultaId', error);
    }
}

export const findEsteticasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByRangeDateAndSucursal', error);
    }
}

export const waitingListEstetica = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListEstetica', error);
    }
}


// CONSECUTIVOS 

export const createConsecutivo = async (consecutivo) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consecutivo`,
            method: 'POST',
            data: consecutivo
        });
        return response;
    } catch (error) {
        console.log('createConsecutivo', error);
    }
}

// BIOPSIA

export const createBiopsia = async (biopsias) => {
    try {
        const response = await axios({
            url: `${baseUrl}/biopsia`,
            method: 'POST',
            data: biopsias
        });
        return response;
    } catch (error) {
        console.log('createBiopsia', error);
    }
}

export const findBiopsiasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/biopsia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findBiopsiasByRangeDateAndSucursal', error);
    }
}

// TIPO ESTETICA

export const showAllTipoEsteticas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoestetica`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoEsteticas', error);
    }
}

// MATERIALES ESTETICA

export const showAllMaterialEsteticas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/materialestetica`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMaterialEsteticas', error);
    }
}

// PAGO MEDICO

export const createPagoMedico = async (pagoMedico) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoMedico`,
            method: 'POST',
            data: pagoMedico
        });
        return response;
    } catch (error) {
        console.log('createPagoMedico', error);
    }
}

export const showTodayPagoMedicoBySucursalTurno = async (medicoId, sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoMedico/${medicoId}/sucursal/${sucursalId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showTodayPagoMedicoBySucursalTurno', error);
    }
}

// INGRESO

export const createIngreso = async (ingreso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso`,
            method: 'POST',
            data: ingreso
        });
        return response;
    } catch (error) {
        console.log('createIngreso', error);
    }
}

export const showIngresosTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showIngresosTodayBySucursalAndTurno', error);
    }
}

// EGRESO

export const createEgreso = async (egreso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/egreso`,
            method: 'POST',
            data: egreso
        });
        return response;
    } catch (error) {
        console.log('createEgreso', error);
    }
}

export const showEgresosTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/egreso/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showEgresosTodayBySucursalAndTurno', error);
    }
}

// TIPO INGRESO

export const showAllTipoIngresos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoingreso`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoIngresos', error);
    }
}

export const findTipoIngresoById = async (tipoIngresoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoingreso/${tipoIngresoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTipoIngresoById', error);
    }
}

// TIPO EGRESO

export const showAllTipoEgresos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoegreso`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoEgresos', error);
    }
}

export const findTipoEgresoById = async (tipoEgresoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoegreso/${tipoEgresoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTipoEgresoById', error);
    }
}

// CORTE 

export const createCorte = async (corte) => {
    try {
        const response = await axios({
            url: `${baseUrl}/corte`,
            method: 'POST',
            data: corte
        });
        return response;
    } catch (error) {
        console.log('createCorte', error);
    }
}

export const showCorteTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/corte/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showCorteTodayBySucursalAndTurno', error);
    }
}