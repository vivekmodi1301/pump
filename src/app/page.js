"use client"
import Image from "next/image";
import styles from "./page.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react'

const PumpSelectionForm = () => {
  const [formData, setFormData] = useState({
    required_flow: '',
    differential_pressure: '',
    speed: '',
    min_viscosity: '',
    max_viscosity: '',
    max_temp: '',
    horizontal_pump: ''
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
  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleCardClick = (id) => {
    setSelectedPumpId(id);
  };

  return (
    // <div className="d-flex justify-content-center align-items-center vh-100" style={{ minHeight: '100vh', overflowY: 'auto' }}>
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <div className="container scrollable-container" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <img src="/your-logo.png" alt="Logo" className="img-fluid" style={{ maxWidth: '200px' }} />
        </div>
        <h1 className="text-center mb-4">Pump Selection</h1>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="required_flow" className="form-label">Required Flow (m³/h):</label>
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
            <label htmlFor="differential_pressure" className="form-label">Differential Pressure (bar):</label>
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
            <label htmlFor="speed" className="form-label">Speed (rpm):</label>
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
            <label htmlFor="min_viscosity" className="form-label">Min. Viscosity (cSt):</label>
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
            <label htmlFor="max_viscosity" className="form-label">Max. Viscosity (cSt):</label>
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
            <label htmlFor="max_temp" className="form-label">Max Temperature (°C):</label>
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
                checked={formData.horizontal_pump === 'Y'}
                onChange={handleChange}
              />
              <label htmlFor="horizontal_pump_yes" className="form-check-label">Yes</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="horizontal_pump_no"
                name="horizontal_pump"
                value="N"
                className="form-check-input"
                checked={formData.horizontal_pump === 'N'}
                onChange={handleChange}
              />
              <label htmlFor="horizontal_pump_no" className="form-check-label">No</label>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
        {pumpResults.length > 0 && (
          <div className="mt-5">
            <h3>Available Pumps:</h3>
            <div className="row">
              {pumpResults.map((pump) => (
                <div
                  key={pump.id}
                  className={`col-md-6 mb-3 card ${selectedPumpId === pump.id ? 'border-primary' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleCardClick(pump.id)}
                >
                  <img 
                    src={`images/pump${pump.id}.jpeg`} 
                    alt={`Pump ${pump.id}`} 
                    className="card-img-top" 
                    style={{ height: '150px', objectFit: 'cover' }} 
                  />
                  <div className="card-body">
                    <h5 className="card-title">Pump ID: {pump.id}</h5>
                    <p className="card-text"><strong>Delivery Flow:</strong> {pump.delivery_flow}</p>
                    <p className="card-text"><strong>Power Absorbed:</strong> {pump.power_absorbed}</p>
                    <p className="card-text"><strong>PN Factor:</strong> {pump.pn_factor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PumpSelectionForm;