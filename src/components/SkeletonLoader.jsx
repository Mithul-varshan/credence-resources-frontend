import React from "react";
import "./SkeletonLoader.css";

export const StatCardSkeleton = () => (
  <div className="stat-card skeleton-card">
    <div className="stat-card-header">
      <div className="skeleton skeleton-icon"></div>
      <div className="skeleton skeleton-title"></div>
    </div>
    <div className="skeleton skeleton-value"></div>
    <div className="skeleton skeleton-subtitle"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="chart-card skeleton-card">
    <div className="skeleton skeleton-chart-title"></div>
    <div className="skeleton-chart-content">
      <div className="skeleton skeleton-chart"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 10 }) => (
  <div className="table-responsive">
    <table className="table">
      <thead className="table-dark">
        <tr>
          {[...Array(columns)].map((_, i) => (
            <th key={i}>
              <div className="skeleton skeleton-table-header"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {[...Array(columns)].map((_, colIndex) => (
              <td key={colIndex}>
                <div className="skeleton skeleton-table-cell"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="dashboard-container">
    <div className="skeleton skeleton-dashboard-title"></div>

    {/* KPI Cards Skeleton */}
    <div className="stats-grid">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Charts Skeleton */}
    <div className="charts-grid">
      <ChartSkeleton />
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
);

export default DashboardSkeleton;
