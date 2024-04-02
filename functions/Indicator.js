export async function getIndicators() {
  try {
    const response = await fetch("http://localhost:4444/indicators", {
      headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const indicators = await response.json();
	return indicators;
  } catch (error) {
    console.error(error);
  }
}

export async function getIndicator(indicatorId) {
  try {
    const response = await fetch(`http://localhost:4444/indicators/${indicatorId}`, {
      headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const indicator = await response.json();
    return indicator;
  } catch (error) {
    console.error(error);
  }
}

/*
data = {
      name,
      unit,
      type,
	    object
}
*/

export async function postIndicator(data) {
  try {
    const response = await fetch(`http://localhost:4444/indicators/`, {
      method: 'POST',
	  headers: {
        "Content-Type": "application/json",
        'User-agent': 'eco-monitor',
      },
      body: JSON.stringify(data),
    });
    const indicator = await response.json();
    return indicator;
  } catch (error) {
    console.error(error);
  }	
}

/*
data = {
      name,
      unit,
      type,
	  object
}
*/

export async function updateIndicator(data, indicatorId) {
  try {
    const response = await fetch(`http://localhost:4444/indicators/${indicatorId}`, {
      method: 'PATCH',
	  headers: {
        "Content-Type": "application/json",
        'User-agent': 'eco-monitor',
      },
      body: JSON.stringify(data),
    });
    const indicator = await response.json();
    return indicator;
  } catch (error) {
    console.error(error);
  }	
}

export async function deleteIndicator(indicatorId) {
  try {
    const response = await fetch(`http://localhost:4444/indicators/${indicatorId}`, {
      method: 'DELETE',
	  headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const indicator = await response.json();
    return indicator;
  } catch (error) {
    console.error(error);
  }	
}