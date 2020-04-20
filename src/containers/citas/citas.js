import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
require('moment/locale/es.js');

const localizer = momentLocalizer(moment);

export const CitasContainer = (props) => {

    const { events } = props;

    const messages = {
        allDay: 'Todo el dia',
        previous: '<',
        next: '>',
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Dia',
        agenda: 'Agenda',
        date: 'Fecha',
        time: 'Hora',
        event: 'Evento',
    };

    return (
        <div style={{ height: '950pt'}}>
            <Calendar
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultDate={moment().toDate()}
                localizer={localizer}
                messages={messages} />
        </div>
    );
}
