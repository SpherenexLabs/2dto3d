import React, { useEffect, useState } from "react";
import "./Lora.css";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1cHHlMWQfeNV6T6tiTRyqXLJYqkS2fHvCL6YUkyE6tzI/edit?gid=0#gid=0"; // Change this!

function AirPressureTable() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(csv => {
        const rows = csv.trim().split("\n");
        const header = rows[0].split(",");
        const idxP1 = header.findIndex(h => h.trim() === "AIR_Pressure1");
        const idxP2 = header.findIndex(h => h.trim() === "AIR_Pressure2");
        const tableData = rows.slice(1)
          .map(row => {
            const cols = row.split(",");
            return {
              air1: cols[idxP1],
              air2: cols[idxP2]
            }
          });
        setData(tableData);
        setStatus("done");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return <div className="pressure-container">Loading...</div>;
  if (status === "error") return <div className="pressure-container" style={{color: "red"}}>Failed to load data.</div>;

  return (
    <div className="pressure-container">
      <h2>AIR Pressure Data</h2>
      <table className="pressure-table">
        <thead>
          <tr>
            <th>AIR_Pressure1</th>
            <th>AIR_Pressure2</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.air1}</td>
              <td>{row.air2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AirPressureTable;
