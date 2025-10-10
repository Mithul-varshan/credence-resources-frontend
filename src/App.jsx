// src/App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/sales`;

function App() {
  const [salesReports, setSalesReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    vesselName: "",
    purchaseOrderNumber: "",
  });

  const [formData, setFormData] = useState({
    invoice_date: "",
    firc_date: "",
    shipping_bill_date: "",
    purchase_order_number: "",
    purchase_order_date: "",
    qty: "",
    rate_in_usd: "",
    firc_number: "",
    no_of_containers_bulk: "",
    inward_amount: "",
    exchange_rate: "",
    shipping_bill_number: "",
    vessel_name: "",
    bill_number: "",
    shipped_on_board_date: "",
  });

  useEffect(() => {
    fetchSalesReports();
  }, [searchTerm, filters]);

  const fetchSalesReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.vesselName) params.append("vessel_name", filters.vesselName);
      if (filters.purchaseOrderNumber)
        params.append("purchase_order_number", filters.purchaseOrderNumber);

      const response = await axios.get(`${API_BASE_URL}`, { params });
      setSalesReports(response.data);
    } catch (error) {
      console.error("Error fetching sales reports:", error);
      alert("Error fetching sales reports");
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      invoice_date: "",
      firc_date: "",
      shipping_bill_date: "",
      purchase_order_number: "",
      purchase_order_date: "",
      qty: "",
      rate_in_usd: "",
      firc_number: "",
      no_of_containers_bulk: "",
      inward_amount: "",
      exchange_rate: "",
      shipping_bill_number: "",
      vessel_name: "",
      bill_number: "",
      shipped_on_board_date: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/${editingId}`, formData);
        alert("Sales report updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}`, formData);
        alert("Sales report created successfully");
      }
      resetForm();
      fetchSalesReports();
    } catch (error) {
      console.error("Error saving sales report:", error);
      alert("Error saving sales report");
    }
    setLoading(false);
  };

  const handleEdit = (report) => {
    setFormData({
      invoice_date: report.invoice_date
        ? report.invoice_date.split("T")[0]
        : "",
      firc_date: report.firc_date ? report.firc_date.split("T")[0] : "",
      shipping_bill_date: report.shipping_bill_date
        ? report.shipping_bill_date.split("T")[0]
        : "",
      purchase_order_number: report.purchase_order_number || "",
      purchase_order_date: report.purchase_order_date
        ? report.purchase_order_date.split("T")[0]
        : "",
      qty: report.qty || "",
      rate_in_usd: report.rate_in_usd || "",
      firc_number: report.firc_number || "",
      no_of_containers_bulk: report.no_of_containers_bulk || "",
      inward_amount: report.inward_amount || "",
      exchange_rate: report.exchange_rate || "",
      shipping_bill_number: report.shipping_bill_number || "",
      vessel_name: report.vessel_name || "",
      bill_number: report.bill_number || "",
      shipped_on_board_date: report.shipped_on_board_date
        ? report.shipped_on_board_date.split("T")[0]
        : "",
    });
    setEditingId(report.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sales report?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        alert("Sales report deleted successfully");
        fetchSalesReports();
      } catch (error) {
        console.error("Error deleting sales report:", error);
        alert("Error deleting sales report");
      }
    }
  };

  const formatNumber = (num) => {
    return num ? parseFloat(num).toFixed(2) : "0.00";
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "";
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 text-primary">
              Credence Resources - Sales Report
            </h1>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Hide Form" : "Add New Report"}
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Search & Filter</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by PO, FIRC, Bill numbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-2 mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-2 mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="col-md-2 mb-3">
                  <label className="form-label">Vessel Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="vesselName"
                    value={filters.vesselName}
                    onChange={handleFilterChange}
                    placeholder="Filter by vessel"
                  />
                </div>
                <div className="col-md-2 mb-3">
                  <label className="form-label">PO Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="purchaseOrderNumber"
                    value={filters.purchaseOrderNumber}
                    onChange={handleFilterChange}
                    placeholder="Filter by PO"
                  />
                </div>
                <div className="col-md-1 mb-3 d-flex align-items-end">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({
                        startDate: "",
                        endDate: "",
                        vesselName: "",
                        purchaseOrderNumber: "",
                      });
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h5>
                  {editingId ? "Edit Sales Report" : "Add New Sales Report"}
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    {/* Date Fields */}
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Invoice Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="invoice_date"
                        value={formData.invoice_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">FIRC Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="firc_date"
                        value={formData.firc_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Shipping Bill Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="shipping_bill_date"
                        value={formData.shipping_bill_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Purchase Order Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="purchase_order_date"
                        value={formData.purchase_order_date}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Text/Number Fields */}
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Purchase Order Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="purchase_order_number"
                        value={formData.purchase_order_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="qty"
                        value={formData.qty}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Rate in USD</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="rate_in_usd"
                        value={formData.rate_in_usd}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">FIRC Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="firc_number"
                        value={formData.firc_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        No of Containers (Bulk)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="no_of_containers_bulk"
                        value={formData.no_of_containers_bulk}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Inward Amount</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="inward_amount"
                        value={formData.inward_amount}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Exchange Rate</label>
                      <input
                        type="number"
                        step="0.0001"
                        className="form-control"
                        name="exchange_rate"
                        value={formData.exchange_rate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Shipping Bill Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="shipping_bill_number"
                        value={formData.shipping_bill_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Vessel Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="vessel_name"
                        value={formData.vessel_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Bill Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="bill_number"
                        value={formData.bill_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">
                        Shipped on Board Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="shipped_on_board_date"
                        value={formData.shipped_on_board_date}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading
                        ? "Saving..."
                        : editingId
                        ? "Update Report"
                        : "Save Report"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Sales Reports Table */}
          <div className="card">
            <div className="card-header">
              <h5>Sales Reports ({salesReports.length} records)</h5>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Invoice Date</th>
                        <th>PO Number</th>
                        <th>PO Date</th>
                        <th>Qty</th>
                        <th>Rate USD</th>
                        <th>Amount USD</th>
                        <th>FIRC Number</th>
                        <th>FIRC Date</th>
                        <th>Containers</th>
                        <th>Inward Amount</th>
                        <th>Exchange Rate</th>
                        <th>INR Value</th>
                        <th>Balance</th>
                        <th>Shipping Bill</th>
                        <th>Shipping Date</th>
                        <th>Vessel Name</th>
                        <th>Bill Number</th>
                        <th>Board Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesReports.length === 0 ? (
                        <tr>
                          <td colSpan="20" className="text-center">
                            No sales reports found
                          </td>
                        </tr>
                      ) : (
                        salesReports.map((report) => (
                          <tr key={report.id}>
                            <td>{report.id}</td>
                            <td>{formatDate(report.invoice_date)}</td>
                            <td>{report.purchase_order_number}</td>
                            <td>{formatDate(report.purchase_order_date)}</td>
                            <td>{formatNumber(report.qty)}</td>
                            <td>${formatNumber(report.rate_in_usd)}</td>
                            <td className="text-success fw-bold">
                              ${formatNumber(report.amount_in_usd)}
                            </td>
                            <td>{report.firc_number}</td>
                            <td>{formatDate(report.firc_date)}</td>
                            <td className="text-info fw-bold">
                              {formatNumber(report.no_of_containers_bulk)}
                            </td>
                            <td>${formatNumber(report.inward_amount)}</td>
                            <td>{formatNumber(report.exchange_rate)}</td>
                            <td className="text-warning fw-bold">
                              ₹{formatNumber(report.inr_value)}
                            </td>
                            <td className="text-primary fw-bold">
                              ${formatNumber(report.balance)}
                            </td>
                            <td>{report.shipping_bill_number}</td>
                            <td>{formatDate(report.shipping_bill_date)}</td>
                            <td>{report.vessel_name}</td>
                            <td>{report.bill_number}</td>
                            <td>{formatDate(report.shipped_on_board_date)}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(report)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(report.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
