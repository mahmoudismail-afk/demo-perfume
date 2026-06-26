import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, ShoppingBag, CreditCard } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [kpis, setKpis] = useState({ revenue: 0, profit: 0, orders: 0, avgValue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking the daily_sales_performance view from our D1 Database
    const mockData = [
      { sale_date: '2023-10-01', gross_revenue_cents: 125000, net_profit_cents: 65000, total_orders: 8 },
      { sale_date: '2023-10-02', gross_revenue_cents: 180000, net_profit_cents: 92000, total_orders: 12 },
      { sale_date: '2023-10-03', gross_revenue_cents: 155000, net_profit_cents: 78000, total_orders: 10 },
      { sale_date: '2023-10-04', gross_revenue_cents: 220000, net_profit_cents: 115000, total_orders: 15 },
      { sale_date: '2023-10-05', gross_revenue_cents: 280000, net_profit_cents: 150000, total_orders: 18 },
      { sale_date: '2023-10-06', gross_revenue_cents: 245000, net_profit_cents: 128000, total_orders: 14 },
      { sale_date: '2023-10-07', gross_revenue_cents: 310000, net_profit_cents: 165000, total_orders: 20 },
    ];

    // Format data for Recharts (converting cents to dollars)
    const formattedData = mockData.map(day => ({
      name: new Date(day.sale_date).toLocaleDateString('en-US', { weekday: 'short' }),
      Revenue: day.gross_revenue_cents / 100,
      Profit: day.net_profit_cents / 100,
      Orders: day.total_orders
    }));

    // Calculate Totals
    const totalRev = formattedData.reduce((sum, day) => sum + day.Revenue, 0);
    const totalProf = formattedData.reduce((sum, day) => sum + day.Profit, 0);
    const totalOrd = formattedData.reduce((sum, day) => sum + day.Orders, 0);

    setTimeout(() => {
      setSalesData(formattedData);
      setKpis({
        revenue: totalRev,
        profit: totalProf,
        orders: totalOrd,
        avgValue: totalOrd > 0 ? (totalRev / totalOrd) : 0
      });
      setLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h1>Performance Dashboard</h1>
        <p>Monitor your revenue, profit margins, and sales velocity.</p>
      </div>

      <div className="analytics-overview">
        <div className="kpi-card">
          <div className="kpi-icon"><DollarSign size={24} /></div>
          <div className="kpi-details">
            <h3>Total Revenue</h3>
            <p className="kpi-value">{loading ? '...' : formatCurrency(kpis.revenue)}</p>
            <span className="kpi-trend positive">+12.5% this week</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><TrendingUp size={24} /></div>
          <div className="kpi-details">
            <h3>Net Profit</h3>
            <p className="kpi-value">{loading ? '...' : formatCurrency(kpis.profit)}</p>
            <span className="kpi-trend positive">+8.2% this week</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><ShoppingBag size={24} /></div>
          <div className="kpi-details">
            <h3>Total Orders</h3>
            <p className="kpi-value">{loading ? '...' : kpis.orders}</p>
            <span className="kpi-trend positive">+15% this week</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><CreditCard size={24} /></div>
          <div className="kpi-details">
            <h3>Avg Order Value</h3>
            <p className="kpi-value">{loading ? '...' : formatCurrency(kpis.avgValue)}</p>
            <span className="kpi-trend negative">-2.1% this week</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Revenue (Last 7 Days)</h3>
          <div style={{ height: 300 }}>
            {loading ? <p>Loading chart...</p> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, undefined]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="Revenue" stroke="#111827" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>Order Volume</h3>
          <div style={{ height: 300 }}>
            {loading ? <p>Loading chart...</p> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="Orders" fill="#111827" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
