import {
  logAddresses,
  setupCounter,
  logObjects,
  logObjectAndIndicator,
  logAddressAndObject,
} from './functions.js';

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const addressId = urlParams.get('id');
  console.log('addressId:', addressId);

  fetch(`http://localhost:4444/addresses/${addressId}`)
    .then(response => response.json())
    .then(data => {
      const { _id, city, street, objects } = data;

      const citySpan = document.getElementById('city');
      citySpan.textContent = city;

      const streetSpan = document.getElementById('street');
      streetSpan.textContent = street;

      logAddressAndObject(addressId)
        .then(data => {
          console.log('Object:', data.objects);

          const objectsContainer = document.getElementById(
            'objectDetailsContainer'
          );
          objectsContainer.innerHTML = '';
          if (data.objects && data.objects.length > 0) {
            data.objects.forEach(object => {
              const objectNameParagraph = document.createElement('p');
              objectNameParagraph.textContent = object.name;
              objectsContainer.appendChild(objectNameParagraph);
            });
          } else {
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'No objects found.';
            objectsContainer.appendChild(errorMessage);
          }
        })
        .catch(error => {
          console.error('Error getting data:', error);
        });
    })
    .catch(error => console.error('Error getting data:', error));
});
