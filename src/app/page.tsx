'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Thermometer,
  ThermometerSun,
  CloudSun,
  TrendingUp,
  TrendingDown,
  MapPin,
  Droplets,
  Wind,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Calendar,
  LineChart,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { capitals, Capital } from '@/lib/capitals';

/* ──────────────────────────────────────────────
   Types
   ────────────────────────────────────────────── */

export type TemperatureZone = 'all' | 'cold' | 'warm';
export type TimeSpan = '7days' | '14days' | '5weeks';

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
}

export interface WeatherData {
  capital: Capital;
  forecasts: DailyForecast[];
  isSimulated: boolean;
}

/* ──────────────────────────────────────────────
   Utility helpers
   ────────────────────────────────────────────── */

function generateHumidity(baseTemp: number): number {
  const tempFactor = (25 - baseTemp) / 20;
  const baseHumidity = 65 + tempFactor * 20;
  const variation = (Math.random() - 0.5) * 20;
  return Math.min(88, Math.max(50, baseHumidity + variation));
}

function simulateWeatherData(capital: Capital): DailyForecast[] {
  const baseTemp = 15 + (capital.latitude - 35) * (-0.4) + (capital.longitude + 100) * 0.1;
  const seasonOffset = Math.sin((new Date().getMonth() - 2) * Math.PI / 6) * 8;

  return Array.from({ length: 35 }, (_, i) => {
    const dayOfYear = new Date().getDate() + i;
    const dayFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 5;
    const randomFactor = (Math.random() - 0.5) * 6;

    const maxTemp = Math.round(baseTemp + seasonOffset + dayFactor + randomFactor + 5);
    const minTemp = Math.round(baseTemp + seasonOffset + dayFactor + randomFactor - 5);

    return {
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxTemp,
      minTemp,
      precipitation: Math.round(Math.random() * 80),
      windSpeed: Math.round(10 + Math.random() * 25),
      humidity: Math.round(generateHumidity((maxTemp + minTemp) / 2)),
      weatherCode: Math.random() > 0.7 ? 600 + Math.floor(Math.random() * 40) : 0,
    };
  });
}

async function fetchWeatherData(capital: Capital): Promise<DailyForecast[]> {
  const url = `http://api.open-meteo.com/v1/forecast?latitude=${capital.latitude}&longitude=${capital.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,weather_code&timezone=auto&forecast_days=35`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('API request failed');

  const data = await response.json();
  const daily = data.daily;

  return daily.time.map((date: string, i: number) => ({
    date,
    maxTemp: Math.round(daily.temperature_2m_max[i]),
    minTemp: Math.round(daily.temperature_2m_min[i]),
    precipitation: Math.round(daily.precipitation_probability_max[i]),
    windSpeed: Math.round(daily.wind_speed_10m_max[i]),
    humidity: Math.round(generateHumidity((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2)),
    weatherCode: daily.weather_code[i],
  }));
}

function getWeatherIcon(code: number) {
  if (code >= 600) return '🌧️';
  if (code >= 300) return '🌦️';
  if (code >= 200) return '⛈️';
  if (code >= 100) return '🌤️';
  return '☀️';
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
  };
}

function formatShortDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ──────────────────────────────────────────────
   Sub-components
   ────────────────────────────────────────────── */

function KPICard({
  label,
  value,
  unit,
  icon: Icon,
  gradient,
  trend,
}: {
  label: string;
  value: number | string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  trend?: 'up' | 'down' | 'stable';
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-md`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>
      {trend && (
        <div
          className={`mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            trend === 'up'
              ? 'bg-red-50 text-red-600'
              : trend === 'down'
              ? 'bg-blue-50 text-blue-600'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          <span>{trend === 'up' ? 'Warming' : trend === 'down' ? 'Cooling' : 'Stable'}</span>
        </div>
      )}
    </div>
  );
}

function ForecastCard({ forecast }: { forecast: DailyForecast }) {
  const { day, date } = formatDate(forecast.date);
  const tempDiff = forecast.maxTemp - forecast.minTemp;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* ── Top: day + date ── */}
      <div className="text-center mb-3">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">{day}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{date}</p>
      </div>

      {/* ── Middle: weather emoji ── */}
      <div className="text-4xl my-4 text-center">{getWeatherIcon(forecast.weatherCode)}</div>

      {/* ── Bottom: temp range + diff ── */}
      <div className="text-center mb-4">
        <p className="text-lg font-bold text-slate-900 tracking-tight">
          {forecast.minTemp}° <span className="text-slate-300 mx-0.5">—</span> {forecast.maxTemp}°
        </p>
        <p
          className={`text-[10px] font-semibold mt-1 ${
            tempDiff >= 15 ? 'text-orange-500' : tempDiff >= 10 ? 'text-amber-500' : 'text-emerald-500'
          }`}
        >
          Δ {tempDiff}°
        </p>
      </div>

      {/* ── Bottom grid: rain / wind / humidity ── */}
      <div className="mt-auto grid grid-cols-3 gap-1 pt-3 border-t border-slate-50">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs">🌧️</span>
          <span className="text-[10px] font-semibold text-slate-500">{forecast.precipitation}%</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs">💨</span>
          <span className="text-[10px] font-semibold text-slate-500">{forecast.windSpeed}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs">💧</span>
          <span className="text-[10px] font-semibold text-slate-500">{forecast.humidity}%</span>
        </div>
      </div>
    </div>
  );
}

function StateSelect({
  states,
  selected,
  onChange,
  multiple = false,
  placeholder = 'Select state',
}: {
  states: Capital[];
  selected: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (stateCode: string) => {
    if (multiple) {
      const newSelected = selected.includes(stateCode)
        ? selected.filter((s) => s !== stateCode)
        : [...selected, stateCode];
      onChange(newSelected);
    } else {
      onChange([stateCode]);
      setIsOpen(false);
    }
  };

  const selectedCapitals = states.filter((s) => selected.includes(s.stateCode));

  const regionColor: Record<string, string> = {
    Northeast: 'bg-sky-100 text-sky-700',
    Midwest: 'bg-amber-100 text-amber-700',
    South: 'bg-rose-100 text-rose-700',
    West: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 w-full px-3 bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center justify-between hover:border-slate-300 transition-colors shadow-inner"
      >
        <span className={selected.length === 0 ? 'text-slate-400 text-sm' : 'text-slate-700 text-sm font-medium truncate'}>
          {selected.length === 0
            ? placeholder
            : selectedCapitals.map((s) => s.capital).join(', ') || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-64 overflow-y-auto">
            {states.map((state) => (
              <button
                key={state.stateCode}
                onClick={() => handleSelect(state.stateCode)}
                className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors ${
                  selected.includes(state.stateCode) ? 'bg-blue-50/60' : ''
                }`}
              >
                <MapPin
                  className={`w-4 h-4 flex-shrink-0 ${
                    selected.includes(state.stateCode) ? 'text-blue-500' : 'text-slate-400'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-slate-800">{state.state}</span>
                  <span className="text-xs text-slate-400 ml-1.5">{state.capital}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${regionColor[state.region]}`}>
                  {state.region}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────── */

export default function Home() {
  const [temperatureZone, setTemperatureZone] = useState<TemperatureZone>('all');
  const [selectedStatesForecast, setSelectedStatesForecast] = useState<string[]>(['NY']);
  const [selectedStatesTrend, setSelectedStatesTrend] = useState<string[]>(['NY', 'CA']);
  const [threshold, setThreshold] = useState(16);
  const [activePanel, setActivePanel] = useState<'forecast' | 'trend'>('forecast');
  const [timeSpan, setTimeSpan] = useState<TimeSpan>('7days');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [allDataSimulated, setAllDataSimulated] = useState(false);

  const fetchAllWeatherData = useCallback(async () => {
    setLoading(true);
    let allSimulated = true;

    const promises = capitals.map(async (capital) => {
      try {
        const forecasts = await fetchWeatherData(capital);
        allSimulated = false;
        return { capital, forecasts, isSimulated: false };
      } catch {
        const forecasts = simulateWeatherData(capital);
        return { capital, forecasts, isSimulated: true };
      }
    });

    const results = await Promise.all(promises);
    setWeatherData(results);
    setAllDataSimulated(allSimulated);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllWeatherData();
    const interval = setInterval(fetchAllWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAllWeatherData]);

  /* ── Derived state ── */

  const filteredCapitals = capitals.filter((capital) => {
    if (temperatureZone === 'all') return true;
    const data = weatherData.find((d) => d.capital.stateCode === capital.stateCode);
    if (!data || data.forecasts.length === 0) return false;
    const avgTemp = data.forecasts[0].maxTemp;
    return temperatureZone === 'warm' ? avgTemp >= threshold : avgTemp < threshold;
  });

  const warmStateCount = weatherData.filter((d) => {
    if (d.forecasts.length === 0) return false;
    return d.forecasts[0].maxTemp >= threshold;
  }).length;

  const coldStateCount = weatherData.filter((d) => {
    if (d.forecasts.length === 0) return false;
    return d.forecasts[0].maxTemp < threshold;
  }).length;

  const nationalAvgTemp =
    weatherData.length > 0
      ? Math.round(
          weatherData.reduce((sum, d) => {
            if (d.forecasts.length === 0) return sum;
            return sum + d.forecasts[0].maxTemp;
          }, 0) / weatherData.length
        )
      : 0;

  const trendDirection =
    weatherData.length > 0 && weatherData[0].forecasts.length > 1
      ? (() => {
          const todayTemp = weatherData[0].forecasts[0].maxTemp;
          const futureTemp = weatherData[0].forecasts[7].maxTemp;
          if (futureTemp > todayTemp + 2) return 'up';
          if (futureTemp < todayTemp - 2) return 'down';
          return 'stable';
        })()
      : 'stable';

  const getForecastData = () => {
    if (selectedStatesForecast.length === 0) return [];
    const data = weatherData.find((d) => d.capital.stateCode === selectedStatesForecast[0]);
    return data?.forecasts.slice(0, 7) || [];
  };

  const getTrendData = () => {
    const days = timeSpan === '7days' ? 7 : timeSpan === '14days' ? 14 : 35;

    const selectedData = weatherData.filter((d) =>
      selectedStatesTrend.includes(d.capital.stateCode)
    );
    if (selectedData.length === 0 || selectedData[0].forecasts.length === 0) return [];

    const result: { date: string; avgTemp: number }[] = [];

    for (let i = 0; i < days; i++) {
      let sumTemp = 0;
      let count = 0;

      selectedData.forEach((d) => {
        if (d.forecasts[i]) {
          sumTemp += (d.forecasts[i].maxTemp + d.forecasts[i].minTemp) / 2;
          count++;
        }
      });

      if (count > 0) {
        result.push({
          date: selectedData[0].forecasts[i].date,
          avgTemp: Math.round(sumTemp / count),
        });
      }
    }

    return result;
  };

  const chartColor =
    temperatureZone === 'cold' ? '#3B82F6' : temperatureZone === 'warm' ? '#EF4444' : '#8B5CF6';

  const forecastState = capitals.find((c) => c.stateCode === selectedStatesForecast[0]);

  /* ── Render ── */

  return (
    <div className="bg-slate-50 min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CloudSun className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">US Climate Dashboard</h1>
              <p className="text-xs text-slate-400 font-medium">Real-time analysis across 50 states</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              allDataSimulated
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {allDataSimulated ? <AlertTriangle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            <span>{allDataSimulated ? 'Simulation Mode' : 'Live Data'}</span>
          </div>
        </header>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Warm Zone States"
            value={warmStateCount}
            unit="states"
            icon={ThermometerSun}
            gradient="from-orange-500 to-red-500"
          />
          <KPICard
            label="Cold Zone States"
            value={coldStateCount}
            unit="states"
            icon={Thermometer}
            gradient="from-sky-500 to-blue-600"
          />
          <KPICard
            label="National Avg Temp"
            value={nationalAvgTemp}
            unit="°C"
            icon={CloudSun}
            gradient="from-violet-500 to-purple-600"
          />
          <KPICard
            label="7-Day Trend"
            value={trendDirection === 'up' ? 'Warming' : trendDirection === 'down' ? 'Cooling' : 'Stable'}
            icon={trendDirection === 'up' ? TrendingUp : trendDirection === 'down' ? TrendingDown : CloudSun}
            gradient={
              trendDirection === 'up'
                ? 'from-orange-500 to-red-500'
                : trendDirection === 'down'
                ? 'from-sky-500 to-blue-600'
                : 'from-emerald-500 to-teal-600'
            }
            trend={trendDirection}
          />
        </div>

        {/* ── Filter Center ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Meteorological Filter Center
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Zone filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Temperature Zone
              </label>
              <div className="relative">
                <select
                  value={temperatureZone}
                  onChange={(e) => setTemperatureZone(e.target.value as TemperatureZone)}
                  className="h-11 w-full px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-inner"
                >
                  <option value="all">All Zones</option>
                  <option value="cold">Cold Zones</option>
                  <option value="warm">Warm Zones</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* State select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {activePanel === 'forecast' ? 'State (Single)' : 'States (Multi)'}
              </label>
              <StateSelect
                states={filteredCapitals}
                selected={activePanel === 'forecast' ? selectedStatesForecast : selectedStatesTrend}
                onChange={activePanel === 'forecast' ? setSelectedStatesForecast : setSelectedStatesTrend}
                multiple={activePanel === 'trend'}
                placeholder={activePanel === 'forecast' ? 'Pick a state' : 'Pick states'}
              />
            </div>

            {/* Threshold slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cold/Warm Threshold
                </label>
                <span className="text-base font-bold text-slate-800">{threshold}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="25"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>10°C</span>
                <span>25°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pill Tabs ── */}
        <div className="bg-slate-100 p-1.5 rounded-xl inline-flex">
          <button
            onClick={() => setActivePanel('forecast')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
              activePanel === 'forecast'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Weather Forecast
          </button>
          <button
            onClick={() => setActivePanel('trend')}
            className={`flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold transition-colors ${
              activePanel === 'trend'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LineChart className="w-4 h-4" />
            Mid-term Trends
          </button>
        </div>

        {/* ── Panel Content ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 font-medium">Fetching weather data...</p>
          </div>
        ) : activePanel === 'forecast' ? (
          /* ── Forecast Panel ── */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <h2 className="text-sm font-semibold text-slate-700">
                  7-Day Forecast
                  {forecastState && (
                    <span className="ml-2 text-slate-400 font-normal">
                      for {forecastState.capital}, {forecastState.stateCode}
                    </span>
                  )}
                </h2>
              </div>
              {forecastState && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500 font-semibold">
                  {forecastState.region}
                </span>
              )}
            </div>

            <div className="p-6">
              {getForecastData().length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select a state to view its 7-day forecast</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                  {getForecastData().map((forecast) => (
                    <ForecastCard key={forecast.date} forecast={forecast} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Trend Panel ── */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-purple-500" />
                <h2 className="text-sm font-semibold text-slate-700">
                  Temperature Trends
                  {selectedStatesTrend.length > 0 && (
                    <span className="ml-2 text-slate-400 font-normal">
                      ({selectedStatesTrend.length} {selectedStatesTrend.length === 1 ? 'state' : 'states'})
                    </span>
                  )}
                </h2>
              </div>

              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                {(['7days', '14days', '5weeks'] as const).map((span) => (
                  <button
                    key={span}
                    onClick={() => setTimeSpan(span)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      timeSpan === span
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {span === '7days' ? '7 Days' : span === '14days' ? '14 Days' : '5 Weeks'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {selectedStatesTrend.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Layers className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select one or more states to view temperature trends</p>
                </div>
              ) : (
                <div className="h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={getTrendData()} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickFormatter={(date) => formatShortDate(date)}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={{ stroke: '#e2e8f0' }}
                        label={{
                          value: '°C',
                          angle: -90,
                          position: 'insideLeft',
                          style: { fontSize: 11, fill: '#94a3b8', fontWeight: 600 },
                        }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}°C`, 'Avg Temperature']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                          fontSize: '13px',
                          fontWeight: 600,
                        }}
                        labelStyle={{ color: '#64748b', fontWeight: 500, marginBottom: 4 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} iconType="line" />
                      <Line
                        type="monotone"
                        dataKey="avgTemp"
                        stroke={chartColor}
                        strokeWidth={2.5}
                        strokeDasharray="6 3"
                        dot={{ fill: chartColor, r: 5, strokeWidth: 0 }}
                        activeDot={{ r: 7, stroke: 'white', strokeWidth: 2 }}
                        name="Average Temperature"
                        animationDuration={800}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="flex items-center justify-between pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400 font-medium">Data provided by Open-Meteo API</p>
          <p className="text-xs text-slate-400 font-medium">US Climate Dashboard &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
}