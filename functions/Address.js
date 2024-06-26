export async function getAddress(addressId) {
  try {
    //const addressId = "65f58383843530191d57ec28";
    const response = await fetch(
      `http://localhost:4444/addresses/${addressId}`,
      {
        headers: {
          accept: 'application/json',
          'User-agent': 'eco-monitor',
        },
      }
    );
    const address = await response.json();
    return address;
  } catch (error) {
    console.error(error);
  }
}

export async function getAddresses() {
  try {
    const response = await fetch('http://localhost:4444/addresses', {
      headers: {
        accept: 'application/json',
        'User-agent': 'eco-monitor',
      },
    });
    const addresses = await response.json();
    return addresses;
  } catch (error) {
    console.error(error);
  }
}

/*
data = {
    city,
    street,
    longitude,
	latitude,
}
*/

export async function postAddress(data) {
  try {
    const response = await fetch(`http://localhost:4444/addresses/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-agent': 'eco-monitor',
      },
      body: JSON.stringify(data),
    });
    const address = await response.json();
    return address;
  } catch (error) {
    console.error(error);
  }
}

/*
data = {
    city,
    street,
    longitude,
	latitude,
}
*/

export async function updateAddress(data, addressId) {
  try {
    const response = await fetch(
      `http://localhost:4444/addresses/${addressId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'User-agent': 'eco-monitor',
        },
        body: JSON.stringify(data),
      }
    );
    const address = await response.json();
    return address;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteAddress(addressId) {
  try {
    const response = await fetch(
      `http://localhost:4444/addresses/${addressId}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'User-agent': 'eco-monitor',
        },
      }
    );
    const address = await response.json();
    return address;
  } catch (error) {
    console.error(error);
  }
}

export async function renameAddress(addressId, newCity, newStreet) {
  try {
    const response = await fetch(
      `http://localhost:4444/addresses/${addressId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: newCity, street: newStreet }),
      }
    );

    if (response.ok) {
      console.log('Location renamed successfully!');
      const updatedLocation = await response.json();

      const cityElement = document.getElementById('city');
      cityElement.textContent = updatedLocation.city;

      const streetElement = document.getElementById('street');
      streetElement.textContent = updatedLocation.street;
    } else {
      console.error('Failed to rename location:', response.status);
    }
  } catch (error) {
    console.error('Error renaming location:', error);
  }
}
