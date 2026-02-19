import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Calendar, MapPin, Users, Clock, ChevronRight, Loader2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatEventDate, daysUntil } from '@/lib/dateUtils';
import { formatCompact } from '@/lib/formatters';

const EVENT_TYPES = ['Workshop', 'Seminar', 'Hackathon', 'Social', 'Sports', 'Other'];

const EventCard = ({ event, onRegister, onView }) => {
    const days = daysUntil(event.startDate);
    const isToday = days === 0;
    const isUpcoming = days > 0;
    const isFull = event.isFull;

    return (
        <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
            {/* Cover image */}
            {event.image ? (
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-44 bg-gradient-to-br from-violet-900/40 to-violet-600/20 flex items-center justify-center">
                    <Calendar size={32} className="text-violet-400/50" />
                </div>
            )}

            {/* Status badge */}
            <div className="absolute top-3 left-3 flex gap-2">
                {isToday && (
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded-full">
                        Today!
                    </span>
                )}
                {!isToday && isUpcoming && (
                    <span className="px-2 py-0.5 bg-violet-500 text-white text-xs font-semibold rounded-full">
                        In {days}d
                    </span>
                )}
                {!isUpcoming && !isToday && (
                    <span className="px-2 py-0.5 bg-gray-600 text-gray-200 text-xs font-semibold rounded-full">
                        Ended
                    </span>
                )}
                <span className="px-2 py-0.5 bg-gray-900/80 text-gray-300 text-xs rounded-full border border-gray-700">
                    {event.eventType}
                </span>
            </div>

            <div className="p-5 space-y-4">
                <div>
                    <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
                        {event.title}
                    </h3>
                    {event.organiser && (
                        <p className="text-xs text-gray-500 mt-1">
                            by {event.organiser.name}
                        </p>
                    )}
                </div>

                {/* Meta info */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={12} className="text-violet-400 shrink-0" />
                        <span>{formatEventDate(event.startDate, true)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin size={12} className="text-violet-400 shrink-0" />
                        <span className="truncate">{event.location}</span>
                    </div>
                    {event.capacity && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Users size={12} className="text-violet-400 shrink-0" />
                            <span>
                                {formatCompact(event.registeredCount)} / {formatCompact(event.capacity)} registered
                            </span>
                        </div>
                    )}
                </div>

                {/* Capacity bar */}
                {event.capacity && (
                    <div className="space-y-1">
                        <div className="w-full bg-gray-800 rounded-full h-1.5">
                            <div
                                className={cn(
                                    'h-1.5 rounded-full transition-all',
                                    isFull ? 'bg-red-500' : 'bg-violet-500'
                                )}
                                style={{
                                    width: `${Math.min(100, (event.registeredCount / event.capacity) * 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={() => onView?.(event)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        View Details
                        <ChevronRight size={12} />
                    </button>
                    {isUpcoming || isToday ? (
                        <button
                            onClick={() => onRegister?.(event)}
                            disabled={isFull || event.isRegistered}
                            className={cn(
                                'flex-1 py-2 rounded-xl text-xs font-medium transition-colors',
                                event.isRegistered
                                    ? 'bg-green-500/20 border border-green-500/50 text-green-400 cursor-default'
                                    : isFull
                                        ? 'bg-red-500/20 border border-red-500/50 text-red-400 cursor-not-allowed'
                                        : 'bg-violet-600 hover:bg-violet-700 text-white'
                            )}
                        >
                            {event.isRegistered ? '✓ Registered' : isFull ? 'Full' : 'Register'}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

const EventExplorer = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['events', searchTerm, selectedType, showUpcomingOnly, page],
        queryFn: async () => {
            const params = new URLSearchParams({
                ...(searchTerm && { q: searchTerm }),
                ...(selectedType && { eventType: selectedType }),
                ...(showUpcomingOnly && { upcoming: 'true' }),
                page: String(page),
                limit: '12',
            });
            const res = await fetch(`/api/events?${params}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            if (!res.ok) throw new Error('Failed to fetch events.');
            return res.json();
        },
        keepPreviousData: true,
    });

    const events = data?.data ?? [];
    const meta = data?.meta ?? {};

    const handleRegister = async (event) => {
        try {
            const res = await fetch(`/api/events/${event._id}/register`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
            });
            if (!res.ok) throw new Error('Registration failed.');
        } catch { }
    };

    return (
        <div className="min-h-screen bg-gray-950 p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Explore Events</h1>
                <p className="text-gray-400">Discover workshops, seminars, and more on campus.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
                <div className="relative flex-1 min-w-[240px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                        placeholder="Search events..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:border-violet-500 outline-none transition-colors"
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                            <X size={14} />
                        </button>
                    )}
                </div>

                <select
                    value={selectedType}
                    onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                    className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white outline-none focus:border-violet-500 transition-colors"
                >
                    <option value="">All Types</option>
                    {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>

                <button
                    onClick={() => { setShowUpcomingOnly(!showUpcomingOnly); setPage(1); }}
                    className={cn(
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-colors',
                        showUpcomingOnly
                            ? 'bg-violet-500/20 border-violet-500 text-violet-300'
                            : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-600'
                    )}
                >
                    <Clock size={14} />
                    Upcoming Only
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 size={32} className="text-violet-500 animate-spin" />
                </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <AlertCircle size={32} className="text-red-400" />
                    <p className="text-red-400">{error?.message ?? 'Failed to load events.'}</p>
                </div>
            ) : events.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <Calendar size={48} className="text-gray-700" />
                    <p className="text-gray-500">No events found matching your filters.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedType(''); setShowUpcomingOnly(false); }}
                        className="text-violet-400 hover:text-violet-300 text-sm underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {events.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                onRegister={handleRegister}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-10">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-400">
                                Page {page} of {meta.totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className="px-4 py-2 text-sm rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export { EventCard, EventExplorer };
export default EventExplorer;
