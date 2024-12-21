"use client"
import Image from "next/image";
import styles from "./page.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react'
import Link from "next/link";

const PumpSelectionForm = () => {
  const [formData, setFormData] = useState({
    required_flow: '10', 
    differential_pressure: '1', 
    speed: '1500', 
    min_viscosity: '1', 
    max_viscosity: '100', 
    max_temp: '60', 
    horizontal_pump: 'Y' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [pumpResults, setPumpResults] = useState([]);
  const [selectedPumpId, setSelectedPumpId] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedPumpDetails, setSelectedPumpDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(formData).some(value => value === '')) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const response = await fetch('http://localhost/pumpsquare/index_211224.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      // alert('Form submitted successfully!');
      // console.log(result);
      setPumpResults(result.pumps);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
  };

  const handleCardClick = (pump) => { 
    setSelectedPumpId(pump.id); 
    setSelectedPumpDetails(pump); 
    setConfirmationVisible(true); 
  };
  
  const handleConfirmSelection = () => {
    alert("Pump selected!");
    setConfirmationVisible(false);
  };

  return (
    // <div className="d-flex justify-content-center align-items-center vh-100" style={{ minHeight: '100vh', overflowY: 'auto' }}>
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", overflowY: "auto" }}
    >
      <button><Link href="/pump-selection">Navigate</Link></button>
      <div
        className="container scrollable-container"
        style={{ maxWidth: "800px" }}
      >
        <div className="text-center mb-4">
          <img
            src="/images/pump-logo.avif"
            alt="Logo"
            className="img-fluid"
            style={{ height: "70px", maxWidth: "70px" }}
          />
        </div>
        <h1 className="text-center mb-4">Pump Selection</h1>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="required_flow" className="form-label">
              Required Flow (m³/h):
            </label>
            <input
              type="number"
              name="required_flow"
              id="required_flow"
              className="form-control"
              required
              min="0"
              placeholder="Enter flow rate in m³/h"
              value={formData.required_flow}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="differential_pressure" className="form-label">
              Differential Pressure (bar):
            </label>
            <input
              type="number"
              name="differential_pressure"
              id="differential_pressure"
              className="form-control"
              required
              min="0"
              placeholder="Enter pressure in bar"
              value={formData.differential_pressure}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="speed" className="form-label">
              Speed (rpm):
            </label>
            <input
              type="number"
              name="speed"
              id="speed"
              className="form-control"
              required
              min="0"
              placeholder="Enter speed in rpm"
              value={formData.speed}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="min_viscosity" className="form-label">
              Min. Viscosity (cSt):
            </label>
            <input
              type="number"
              name="min_viscosity"
              id="min_viscosity"
              className="form-control"
              required
              min="0"
              placeholder="Enter minimum viscosity in cSt"
              value={formData.min_viscosity}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="max_viscosity" className="form-label">
              Max. Viscosity (cSt):
            </label>
            <input
              type="number"
              name="max_viscosity"
              id="max_viscosity"
              className="form-control"
              required
              min="0"
              placeholder="Enter maximum viscosity in cSt"
              value={formData.max_viscosity}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="max_temp" className="form-label">
              Max Temperature (°C):
            </label>
            <input
              type="number"
              name="max_temp"
              id="max_temp"
              className="form-control"
              required
              min="0"
              placeholder="Enter maximum temperature in °C"
              value={formData.max_temp}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Horizontal Pump:</label>
            <div className="form-check">
              <input
                type="radio"
                id="horizontal_pump_yes"
                name="horizontal_pump"
                value="Y"
                className="form-check-input"
                required
                checked={formData.horizontal_pump === "Y"}
                onChange={handleChange}
              />
              <label htmlFor="horizontal_pump_yes" className="form-check-label">
                Yes
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="horizontal_pump_no"
                name="horizontal_pump"
                value="N"
                className="form-check-input"
                checked={formData.horizontal_pump === "N"}
                onChange={handleChange}
              />
              <label htmlFor="horizontal_pump_no" className="form-check-label">
                No
              </label>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        {pumpResults.length > 0 && (
          <div className="mt-5">
            <h3>Available Pumps:</h3>
            <div className="row">
              {pumpResults.map((pump) => (
                <div
                  key={pump.id}
                  className={`col-md-6 mb-3 card ${
                    selectedPumpId === pump.id ? "border-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCardClick(pump)}
                >
                  <img
                    src={`images/pump${pump.id}.jpeg`}
                    alt={`Pump ${pump.id}`}
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">Pump ID: {pump.id}</h5>
                    <p className="card-text">
                      <strong>Delivery Flow:</strong> {pump.delivery_flow}
                    </p>
                    <p className="card-text">
                      <strong>Power Absorbed:</strong> {pump.power_absorbed}
                    </p>
                    <p className="card-text">
                      <strong>PN Factor:</strong> {pump.pn_factor}
                    </p>
                  </div>
                </div>
              ))}
              {confirmationVisible && selectedPumpDetails && (
          <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Pump Selection</h5>
                  <button type="button" className="btn-close" onClick={() => setConfirmationVisible(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <p>Are you sure you want to select this pump?</p>
                  <p><strong>Pump ID:</strong> {selectedPumpDetails.id}</p>
                  <p><strong>Delivery Flow:</strong> {selectedPumpDetails.delivery_flow}</p>
                  <p><strong>Power Absorbed:</strong> {selectedPumpDetails.power_absorbed}</p>
                  <p><strong>PN Factor:</strong> {selectedPumpDetails.pn_factor}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setConfirmationVisible(false)}>Cancel</button>
                  <button type="button" className="btn btn-success" onClick={handleConfirmSelection}>Confirm</button>
                </div>
              </div>
            </div>
          </div>
        )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PumpSelectionForm;

