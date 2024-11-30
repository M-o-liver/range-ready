import React, { useState, useEffect } from "react";

function StartActivity() {
  const [rows, setRows] = useState([{ sn: "", name: "", email: "", unit: "" }]);
  const [activity, setActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [units, setUnits] = useState([]);
  const [ongoingActivities, setOngoingActivities] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [activityTypes, setActivityTypes] = useState([]); // Store activity types for dropdown
  const [selectedActivityType, setSelectedActivityType] = useState(""); // Store selected activity type

  // Fetch activity options
  useEffect(() => {
    fetch("https://hackfd-rangeready.ca/api/getActivitiesOptions", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActivities(data.data);
        } else {
          console.error("Failed to fetch activities:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching activity options:", error));

    // Fetch unit options
    fetch("https://hackfd-rangeready.ca/api/getUnitOptions", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUnits(data.data);
        } else {
          console.error("Failed to fetch units:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching unit options:", error));

    // Fetch ongoing activity data
    fetch("https://hackfd-rangeready.ca/api/getOnGoingActivity", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setOngoingActivities(data.data);
        } else {
          console.error("Failed to fetch ongoing activities:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching ongoing activities:", error));
  }, []);

  // Fetch activity types when Add Data is clicked
  const handleAddData = (index) => {
    const activityData = ongoingActivities[index];
    console.log("Adding data for", activityData); // Here, you can implement what should happen when the button is clicked
    fetch("https://hackfd-rangeready.ca/api/getOnGoingActivityType", {
      method: "GET",
      headers: {
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setActivityTypes(data.data); // Populate activity types dropdown
          setShowModal(true); // Show the modal when activity types are fetched
        } else {
          console.error("Failed to fetch activity types:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching activity types:", error));
  };

  const handleActivityTypeChange = (e) => {
    setSelectedActivityType(e.target.value);
  };

  const handleNext = () => {
    console.log("Next button clicked with activity type:", selectedActivityType);
    // Implement what happens when 'Next' is clicked (e.g., save data or advance step)
    setShowModal(false); // Close the modal
  };

  const addRow = () => {
    setRows([...rows, { sn: "", name: "", email: "", unit: "" }]);
  };

  const removeRow = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSubmit = () => {
    if (!activity) {
      alert("Please select an activity.");
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      const { sn, name, email, unit } = rows[i];
      if (!sn || !name || !email || !unit) {
        alert("Please fill out all fields in each row.");
        return;
      }
    }

    const data = {
      activity,
      rows: rows.map(row => ({
        ...row,
        unit: row.unit.split(" ")[0],
      })),
    };

    fetch("https://hackfd-rangeready.ca/api/registerActivity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic QWRtaW5pc3RyYXRvcjpSYW5nZXJlYWR5ITE=",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Activity Registered Successfully!");
        } else {
          alert("Error registering activity: " + data.message);
        }
      })
      .catch((error) => alert("Error registering activity!"));
  };

  return (
    <div className="start-activity">
      {/* Top Section */}
      <div className="create-activity">
        <h2>Create Activity</h2>
        <select onChange={(e) => setActivity(e.target.value)} value={activity}>
          <option value="">Select Activity</option>
          {activities.map((activityOption, index) => (
            <option key={index} value={activityOption.Name}>
              {activityOption.Name}
            </option>
          ))}
        </select>
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={row.sn}
                    onChange={(e) => handleChange(index, "sn", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="email"
                    value={row.email}
                    onChange={(e) =>
                      handleChange(index, "email", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={row.unit}
                    onChange={(e) => handleChange(index, "unit", e.target.value)}
                  >
                    <option value="">Select Unit</option>
                    {units.map((unitOption, index) => (
                      <option key={index} value={unitOption.Unit}>
                        {unitOption.Unit}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={() => removeRow(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow}>Add Row</button>
        <button onClick={handleSubmit}>Register</button>
      </div>

      {/* Bottom Section */}
      <div className="ongoing-activity">
        <h2>Ongoing Activity</h2>
        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Name</th>
              <th>Email</th>
              <th>Unit</th>
              <th>Activity Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ongoingActivities.map((activity, index) => (
              <tr key={index}>
                <td>{activity.sn}</td>
                <td>{activity.name}</td>
                <td>{activity.email}</td>
                <td>{activity.unit}</td>
                <td>{activity.activityName}</td>
                <td>
                  <button onClick={() => handleAddData(index)}>Add Data</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Activity Type */}
      {showModal && (
        <div className="modal">
          <h3>Select Activity Type</h3>
          <select
            value={selectedActivityType}
            onChange={handleActivityTypeChange}
          >
            <option value="">Select Activity Type</option>
            {activityTypes.map((activityType, index) => (
              <option key={index} value={activityType.Name}>
                {activityType.Name}
              </option>
            ))}
          </select>
          <button onClick={handleNext}>Next</button>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default StartActivity;
