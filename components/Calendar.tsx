import React, { useState } from 'react';
import { EnrichedEvent } from '../types';
import EventCard from './EventCard';
import Modal from './Modal';
import { useAuth } from '../hooks/useAuth';

interface CalendarProps {
    events: EnrichedEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<EnrichedEvent | null>(null);
    const { user } = useAuth();

    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };

    const eventsByDate: { [key: string]: EnrichedEvent[] } = {};
    events.forEach(event => {
        const dateKey = event.date;
        if (!eventsByDate[dateKey]) {
            eventsByDate[dateKey] = [];
        }
        eventsByDate[dateKey].push(event);
    });

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="border border-white/10 rounded-md"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = eventsByDate[dateKey] || [];
            
            const today = new Date();
            today.setHours(0,0,0,0);
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            const isToday = today.getTime() === dayDate.getTime();
            const isPast = dayDate < today;

            days.push(
                <div key={day} className={`border border-white/10 rounded-md p-2 flex flex-col ${isToday ? 'bg-brand-primary/30' : ''} ${isPast ? 'opacity-60' : ''}`}>
                    <div className={`font-bold ${isToday ? 'text-brand-accent' : 'text-white'}`}>{day}</div>
                    <div className="mt-1 space-y-1 overflow-y-auto">
                        {dayEvents.map(event => {
                            const isRegistered = user && event.attendees.some(a => a.email === user.email);
                            
                            let colorClass = 'bg-pink-600 hover:bg-pink-700'; // Default: Not registered (Pink)
                            if (isPast) {
                                colorClass = 'bg-gray-600 hover:bg-gray-700'; // Past (Gray)
                            } else if (isRegistered) {
                                colorClass = 'bg-purple-600 hover:bg-purple-700'; // Registered (Purple)
                            }

                            return (
                                <div 
                                    key={event.id} 
                                    onClick={() => setSelectedEvent(event)} 
                                    className={`text-xs text-white p-1 rounded cursor-pointer truncate transition-colors ${colorClass}`}
                                >
                                    {event.title}
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return days;
    };
    
    return (
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="px-4 py-2 bg-brand-primary rounded-lg">&lt;</button>
                <h2 className="text-2xl font-bold text-white">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => changeMonth(1)} className="px-4 py-2 bg-brand-primary rounded-lg">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-gray-300 font-semibold mb-2">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-2 h-[60vh]">
                {renderDays()}
            </div>
            {selectedEvent && (
                <Modal onClose={() => setSelectedEvent(null)}>
                    <EventCard event={selectedEvent} onAction={() => {
                        setSelectedEvent(null);
                        // No need to refresh whole app state, useData hook handles it
                    }} />
                </Modal>
            )}
        </div>
    );
};

export default Calendar;