export async function getObjects() {
  try {
    const response = await fetch("http://localhost:4444/objects", {
      headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const objects = await response.json();
	return objects;
  } catch (error) {
    console.error(error);
  }
}

export async function getObject(objectId) {
  try {
    //const objectId = "65f584bb25d8f478eac69606";
    const response = await fetch(`http://localhost:4444/objects/${objectId}`, {
      headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const object = await response.json();
    return object;
  } catch (error) {
    console.error(error);
  }
}

/*
data = {
	name,
	addressId: addressId
}
*/

export async function postObject(data) {
  try {
    const response = await fetch(`http://localhost:4444/objects/`, {
      method: 'POST',
	    headers: {
        "Content-Type": "application/json",
        'User-agent': 'eco-monitor',
      },
      body: JSON.stringify(data),
    });
    const object = await response.json();
    return object;
  } catch (error) {
    console.error(error);
  }	
}

/*
data = {
	name,
	addressId: addressId
}
*/

export async function updateObject(data, objectId) {
  try {
    const response = await fetch(`http://localhost:4444/objects/${objectId}`, {
      method: 'PATCH',
	  headers: {
        "Content-Type": "application/json",
        'User-agent': 'eco-monitor',
      },
      body: JSON.stringify(data),
    });
    const object = await response.json();
    return object;
  } catch (error) {
    console.error(error);
  }	
}

export async function deleteObject(objectId) {
  try {
    const response = await fetch(`http://localhost:4444/objects/${objectId}`, {
      method: 'DELETE',
	  headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const object = await response.json();
    return object;
  } catch (error) {
    console.error(error);
  }	
}