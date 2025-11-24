import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Ship,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Dashboard = ({ salesReports }) => {
  const analytics = useMemo(() => {
    if (!salesReports || salesReports.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        totalContainers: 0,
        averageOrderValue: 0,
        monthlyData: [],
        vesselDistribution: [],
        recentTrend: 0,
      };
    }

    // Calculate totals
    const totalSales = salesReports.length;
    const totalRevenue = salesReports.reduce(
      (sum, report) => sum + (parseFloat(report.amount_in_usd) || 0),
      0
    );
    const totalContainers = salesReports.reduce(
      (sum, report) => sum + (parseFloat(report.no_of_containers_bulk) || 0),
      0
    );
    const averageOrderValue = totalRevenue / totalSales;

    // Monthly sales data
    const monthlyMap = {};
    salesReports.forEach((report) => {
      if (report.invoice_date) {
        const date = new Date(report.invoice_date);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { month: monthKey, sales: 0, revenue: 0 };
        }
        monthlyMap[monthKey].sales += 1;
        monthlyMap[monthKey].revenue += parseFloat(report.amount_in_usd) || 0;
      }
    });

    const monthlyData = Object.values(monthlyMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map((item) => ({
        month: new Date(item.month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        sales: item.sales,
        revenue: Math.round(item.revenue),
      }));

    // Vessel distribution
    const vesselMap = {};
    salesReports.forEach((report) => {
      if (report.vessel_name) {
        vesselMap[report.vessel_name] =
          (vesselMap[report.vessel_name] || 0) + 1;
      }
    });

    const vesselDistribution = Object.entries(vesselMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Calculate trend (comparing last 2 months)
    const recentTrend =
      monthlyData.length >= 2
        ? ((monthlyData[monthlyData.length - 1].revenue -
            monthlyData[monthlyData.length - 2].revenue) /
            monthlyData[monthlyData.length - 2].revenue) *
          100
        : 0;

    return {
      totalSales,
      totalRevenue,
      totalContainers,
      averageOrderValue,
      monthlyData,
      vesselDistribution,
      recentTrend,
    };
  }, [salesReports]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="stat-card"
    >
      <div className="stat-card-header">
        <div className="stat-icon">
          <Icon size={24} />
        </div>
        <h3 className="stat-title">{title}</h3>
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      {trend !== undefined && trend !== 0 && (
        <div className={`stat-trend ${trend >= 0 ? "positive" : "negative"}`}>
          {trend >= 0 ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}
          <span>{Math.abs(trend).toFixed(1)}% vs last month</span>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="dashboard-container">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-title"
      >
        Sales Analytics Dashboard
      </motion.h2>

      {/* KPI Cards */}
      <div className="stats-grid">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle={`Avg: $${analytics.averageOrderValue.toLocaleString(
            undefined,
            { maximumFractionDigits: 2 }
          )} per order`}
          trend={analytics.recentTrend}
          delay={0.1}
        />
        <StatCard
          icon={TrendingUp}
          title="Total Sales"
          value={analytics.totalSales}
          subtitle="Orders processed"
          delay={0.2}
        />
        <StatCard
          icon={Ship}
          title="Unique Vessels"
          value={analytics.vesselDistribution.length}
          subtitle="Active shipping routes"
          delay={0.3}
        />
        <StatCard
          icon={Package}
          title="Total Containers"
          value={analytics.totalContainers.toFixed(1)}
          subtitle="Shipped containers"
          delay={0.4}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Monthly Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="chart-card"
        >
          <h3 className="chart-title">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", r: 5 }}
                activeDot={{ r: 8 }}
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Sales Volume */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="chart-card"
        >
          <h3 className="chart-title">Sales Volume by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="sales"
                fill="#10b981"
                name="Number of Sales"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Vessel Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="chart-card"
        >
          <h3 className="chart-title">Top Vessels by Shipments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.vesselDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.vesselDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
