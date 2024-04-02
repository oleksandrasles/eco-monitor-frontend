export async function getTypes() {
  try {
    const response = await fetch("http://localhost:4444/types", {
      headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const types = await response.json();
	return types;
  } catch (error) {
    console.error(error);
  }
}

export async function getType(typeId) {
  try {
    const response = await fetch(`http://localhost:4444/types/${typeId}`, {
      headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const type = await response.json();
    return type;
  } catch (error) {
    console.error(error);
  }
}

export async function postType(data) {
  try {
    const response = await fetch(`http://localhost:4444/types/`, {
      method: 'POST',
	  headers: {
        "Content-Type": "application/json",
        'User-agent': 'eco-monitor',
      },
      body: JSON.stringify(data),
    });
    const type = await response.json();
    return type;
  } catch (error) {
    console.error(error);
  }	
}

export async function updateType(data, typeId) {
  try {
    const response = await fetch(`http://localhost:4444/types/${typeId}`, {
      method: 'PATCH',
	  headers: {
        "Content-Type": "application/json",
        'User-agent': 'eco-monitor',
      },
      body: JSON.stringify(data),
    });
    const type = await response.json();
    return type;
  } catch (error) {
    console.error(error);
  }	
}

export async function deleteType(typeId) {
  try {
    const response = await fetch(`http://localhost:4444/types/${typeId}`, {
      method: 'DELETE',
	  headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const type = await response.json();
    return type;
  } catch (error) {
    console.error(error);
  }	
}
