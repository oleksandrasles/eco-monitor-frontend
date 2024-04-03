import { deleteAddress, getAddresses, postAddress } from './functions/Address.js';
import { getTypes } from './functions/Type.js';

document.addEventListener('DOMContentLoaded', async function () {
  var map = L.map('map', {
    doubleClickZoom: false,
  }).setView([49.0, 31.0], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  const types = await getTypes();

  const typesDiv = document.getElementById("types");
  
  const allTypeButton = document.createElement("button");

  allTypeButton.addEventListener('click', function(e) {
    localStorage.setItem("type", "all all");
    location.reload();
  });

  allTypeButton.textContent = "All";
  typesDiv.appendChild(allTypeButton);

  types.forEach(type => {
    const typeButton = document.createElement("button");
    typeButton.textContent += type.name;
    typeButton.addEventListener('click', function(e) {
      localStorage.setItem("type", type._id + " " + type.name);
      location.reload();
    });

    typesDiv.appendChild(typeButton);
  });

  const current = document.getElementById("current");
  const curType = localStorage.getItem("type");
  current.textContent += curType.split(" ")[1];

  map.on('dblclick', function (e) {
    var coordinates = e.latlng;
    const newCity = prompt('Enter the new city for the location:');
    if (!newCity) return;

    const newStreet = prompt('Enter the new street for the location:');
    if (!newStreet) return;

    var marker = L.marker(coordinates).addTo(map);

    marker
      .bindPopup(
        `<b>${newCity}</b><br>${newStreet}<br><button id="infoButton" class="detailsButton">Information</button>`
      )
      .openPopup();

    document
      .getElementById('infoButton')
      .addEventListener('click', function () {
        console.log('The button was pressed');
        const addressId = address._id;
        console.log('ID:', addressId);
        window.open(`info.html?id=${addressId}`, '_blank');
      });

    const data = {
      city: newCity,
      street: newStreet,
      longitude: String(coordinates.lng),
      latitude: String(coordinates.lat),
    };

    postAddress(data);
    location.reload();
  });

  const addresses = await getAddresses();

  addresses.forEach(async address => {
    const { _id, city, street, latitude, longitude } = address;
    var marker = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`<b>${city}</b><br>${street}<br>`, { autoClose: false });

    marker.on('click', function (e) {
      var popupContent = e.target._popup.getContent();

      if (typeof popupContent === 'string') {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = popupContent;

        var button = document.createElement('button');
        button.textContent = 'Information';
        button.classList.add('detailsButton');

        button.addEventListener('click', function (event) {
          console.log('The button was pressed');
          const addressId = address._id;
          console.log('ID:', addressId);
          window.open(`info.html?id=${addressId}`, '_blank');
        });

        tempDiv.appendChild(button);

        e.target._popup.setContent(tempDiv);
      }
    });

    let confirmation = false;

    marker.on('dblclick', async function (e) {
      confirmation = confirm(
        'Are you sure you want to delete this marker?'
      );
      if(confirmation) {
        const response = await deleteAddress(_id);
        map.removeLayer(marker);
        console.log(response);
      }
      console.log(e, confirmation);
    });

    console.log(address);
  });
});