'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { rupiah, Wallet } from '@/lib/api';

export function ActivityChart({ activity }: { activity: Wallet['activity'] }) {
  const chart = activity.map(day => ({ ...day, label: new Date(day.date + 'T12:00:00').toLocaleDateString('id-ID', { weekday: 'short' }) }));
  const total = activity.reduce((sum, day) => sum + Number(day.incoming) - Number(day.outgoing), 0);
  return <section className="glass chart-panel">
    <div className="section-heading"><div><span className="eyebrow">AKTIVITAS</span><h2>Pergerakan saldo</h2></div><span className="subtle-tag">7 hari terakhir</span></div>
    <div className="chart-summary"><strong>{total >= 0 ? '+' : '−'}{rupiah(Math.abs(total))}</strong><span>Selisih masuk & keluar</span></div>
    <div className="chart-legend"><span><i/>Uang masuk</span><span><i className="outgoing"/>Uang keluar</span></div>
    <div className="chart-container" role="img" aria-label="Grafik uang masuk dan keluar tujuh hari terakhir">
      <ResponsiveContainer width="100%" height="100%"><AreaChart data={chart} margin={{ top: 16, right: 12, bottom: 0, left: -18 }}>
        <defs><linearGradient id="incoming-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#46765a" stopOpacity={0.24}/><stop offset="100%" stopColor="#46765a" stopOpacity={0.015}/></linearGradient></defs>
        <CartesianGrid vertical={false} stroke="#dce2d9" strokeDasharray="3 5"/>
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#66736a', fontSize: 11 }} dy={8}/>
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#66736a', fontSize: 10 }} width={60} tickFormatter={value => value >= 1000000 ? value / 1000000 + ' jt' : value >= 1000 ? value / 1000 + ' rb' : String(value)}/>
        <Tooltip formatter={value => rupiah(Number(value))} contentStyle={{ borderRadius: 14, border: '1px solid #dfe5dc', fontSize: 12, boxShadow: '0 8px 30px #243f2c12' }}/>
        <Area name="Uang masuk" type="monotone" dataKey="incoming" stroke="#3a7153" fill="url(#incoming-fill)" strokeWidth={2.5} isAnimationActive={false}/>
        <Area name="Uang keluar" type="monotone" dataKey="outgoing" stroke="#a6814c" fill="transparent" strokeDasharray="5 4" strokeWidth={2} isAnimationActive={false}/>
      </AreaChart></ResponsiveContainer>
    </div>
    <div className="sr-only"><table><caption>Aktivitas tujuh hari</caption><tbody>{chart.map(day => <tr key={day.date}><th>{day.date}</th><td>Masuk {rupiah(day.incoming)}</td><td>Keluar {rupiah(day.outgoing)}</td></tr>)}</tbody></table></div>
  </section>;
}
