import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { weatherService } from '../services/weatherService';
import { weatherIconUrl } from '../utils/formatters';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../hooks/useToast';
import Toast from '../components/common/Toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const weatherTips = [
  '🌱 Check soil moisture before scheduling irrigation after rain.',
  '☀️ High temperature days — water crops in early morning or evening.',
  '🌧 Rain forecast? Postpone pesticide spraying for better effectiveness.',
];

export default function WeatherPage() {
  const [city, setCity] = useState('Delhi');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();

  const fetchWeather = async (searchCity) => {
    setLoading(true);
    try {
      const [curRes, foreRes] = await Promise.all([
        weatherService.getCurrent(searchCity),
        weatherService.getForecast(searchCity),
      ]);
      setCurrent(curRes.data.data);
      const fd = foreRes.data.data;
      setForecast(Array.isArray(fd) ? fd : fd?.list ?? []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Weather fetch failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(city); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchWeather(city); };

  const useLocation = () => {
    if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLoading(true);
        try {
          const res = await weatherService.getByLocation(pos.coords.latitude, pos.coords.longitude);
          setCurrent(res.data.data);
          const foreRes = await weatherService.getForecast(res.data.data.city);
          const fd2 = foreRes.data.data;
          setForecast(Array.isArray(fd2) ? fd2 : fd2?.list ?? []);
          setCity(res.data.data.city);
        } catch { showToast('Location weather failed', 'error'); }
        finally { setLoading(false); }
      },
      () => showToast('Location permission denied', 'error')
    );
  };

  const formatDay = (d) => {
    if (d.date) return new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
    return d.day || '';
  };

  const chartOpts = (label) => ({
    responsive: true,
    plugins: { legend: { display: false }, title: { display: true, text: label, color: 'var(--text)', font: { size: 13, weight: '600' } } },
    scales: { x: { ticks: { color: 'var(--text-muted)', font: { size: 11 } }, grid: { color: 'var(--border)' } }, y: { ticks: { color: 'var(--text-muted)', font: { size: 11 } }, grid: { color: 'var(--border)' } } },
  });

  const tempChart = {
    labels: forecast.map(formatDay),
    datasets: [{ label: 'Max Temp (°C)', data: forecast.map((d) => d.maxTemp ?? d.temperature), borderColor: '#2E7D32', backgroundColor: 'rgba(46,125,50,0.08)', tension: 0.35, fill: true, pointBackgroundColor: '#2E7D32', pointRadius: 4 }],
  };
  const humidityChart = {
    labels: forecast.map(formatDay),
    datasets: [{ label: 'Humidity (%)', data: forecast.map((d) => d.humidity), backgroundColor: 'rgba(102,187,106,0.7)', borderRadius: 6 }],
  };

  return (
    <>
      <Toast toast={toast} />
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="page-title mb-0">🌤 Weather Forecast</h2>
        <span className="badge-custom badge-primary">Live Data</span>
      </div>

      {/* ── Search bar ── */}
      <form onSubmit={handleSearch} className="card-custom mb-4 p-3">
        <div className="row g-2 align-items-center">
          <div className="col">
            <input className="form-control" placeholder="Search city, town or village..." value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary-custom">🔍 Search</button>
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-outline-success" onClick={useLocation}>📍 My Location</button>
          </div>
        </div>
      </form>

      {loading ? <LoadingSkeleton rows={5} height={60} /> : !current ? (
        <div className="row g-4">
          <div className="col-lg-8">
            <EmptyState icon="🌤" title="No weather data" message="Search for a city to get started" />
          </div>
          <div className="col-lg-4">
            <div className="card-custom">
              <div className="section-title">🌾 Weather Tips</div>
              {weatherTips.map((t, i) => <div key={i} className="info-tip">{t}</div>)}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {/* ── Main weather hero ── */}
            <div className="col-lg-8">
              <div className="weather-hero">
                <div className="row align-items-center">
                  <div className="col-sm-8">
                    <div style={{ fontSize: '0.85rem', opacity: 0.85, marginBottom: '0.25rem', fontWeight: 500 }}>
                      📍 {current.city}{current.country ? `, ${current.country}` : ''}
                    </div>
                    <div className="weather-temp">{current.temperature}°C</div>
                    <div className="weather-condition">{current.condition}</div>
                    <div style={{ fontSize: '0.88rem', opacity: 0.8, marginTop: '0.5rem' }}>Feels like {current.feelsLike}°C</div>
                  </div>
                  <div className="col-sm-4 text-center mt-3 mt-sm-0">
                    {current.icon
                      ? <img src={weatherIconUrl(current.icon)} alt="" style={{ width: 90, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }} />
                      : <div style={{ fontSize: '5rem' }}>☁️</div>}
                  </div>
                </div>
                {/* Stat pills */}
                <div className="row g-2 mt-3">
                  {[
                    { icon: '💧', label: 'Humidity',    val: `${current.humidity}%` },
                    { icon: '💨', label: 'Wind',        val: `${current.windSpeed} km/h` },
                    { icon: '🌡', label: 'Pressure',    val: `${current.pressure} hPa` },
                    { icon: '🌧', label: 'Rain',        val: `${current.rainProbability}%` },
                    { icon: '👁', label: 'Visibility',  val: `${(current.visibility / 1000).toFixed(1)} km` },
                    { icon: '🌅', label: 'Sunrise',     val: current.sunrise },
                    { icon: '🌇', label: 'Sunset',      val: current.sunset },
                  ].filter((s) => s.val && s.val !== 'undefined').map((s) => (
                    <div className="col-6 col-sm-4 col-md-3" key={s.label}>
                      <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.5rem 0.75rem', backdropFilter: 'blur(4px)' }}>
                        <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.icon} {s.label}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{s.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Weather sidebar ── */}
            <div className="col-lg-4">
              <div className="card-custom h-100">
                <div className="section-title">🌾 Farming Alerts</div>
                {weatherTips.map((t, i) => <div key={i} className="info-tip" style={{ fontSize: '0.85rem' }}>{t}</div>)}
                <div className="divider" />
                <div className="section-title">📊 Quick Summary</div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.88rem' }}>
                  <span className="text-muted-custom">Condition</span>
                  <span className="fw-600">{current.condition}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.88rem' }}>
                  <span className="text-muted-custom">Temperature</span>
                  <span className="fw-600">{current.temperature}°C</span>
                </div>
                <div className="d-flex justify-content-between" style={{ fontSize: '0.88rem' }}>
                  <span className="text-muted-custom">Rain Chance</span>
                  <span className="fw-600">{current.rainProbability}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 7-day forecast ── */}
          {forecast.length > 0 && (
            <>
              <h5 className="section-title mb-3">📅 7-Day Forecast</h5>
              <div className="row g-2 mb-4">
                {forecast.map((d, i) => (
                  <div className="col-6 col-sm-4 col-md" key={i}>
                    <div className="forecast-card">
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>{formatDay(d)}</div>
                      {d.icon && <img src={weatherIconUrl(d.icon)} alt="" style={{ width: 44, margin: '0.4rem 0' }} />}
                      <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.1rem' }}>{d.maxTemp ?? d.temperature}°C</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{d.condition}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Charts ── */}
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card-custom"><Line data={tempChart} options={chartOpts('Temperature Trend (°C)')} /></div>
                </div>
                <div className="col-md-6">
                  <div className="card-custom"><Bar data={humidityChart} options={chartOpts('Humidity Forecast (%)')} /></div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
