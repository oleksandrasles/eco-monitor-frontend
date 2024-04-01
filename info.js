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

      const addObjectButton = document.getElementById('addObjectButton');
      addObjectButton.addEventListener('click', async function () {
        const objectName = prompt('Enter object name:');
        if (objectName) {
          const newObject = {
            name: objectName,
            addressId: addressId,
          };

          try {
            const response = await fetch('http://localhost:4444/objects', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newObject),
            });

            if (response.ok) {
              console.log('Object created successfully!');
            } else {
              console.error('Failed to create object:', response.status);
            }
          } catch (error) {
            console.error('Error creating object:', error);
          }
        }
      });

      const deleteButton = document.getElementById('deleteObjectButton');
      deleteButton.addEventListener('click', async function () {
        try {
          const data = await logAddressAndObject(addressId);
          const objects = data.objects;

          const selectedObjectName = prompt(
            'Select object to delete:\n' +
              objects.map(obj => obj.name).join('\n')
          );
          if (!selectedObjectName) return;

          const selectedObject = objects.find(
            obj => obj.name === selectedObjectName
          );
          if (!selectedObject) {
            console.error('Object not found:', selectedObjectName);
            return;
          }

          const confirmation = confirm(
            `Are you sure you want to delete the object "${selectedObjectName}"?`
          );
          if (confirmation) {
            const response = await fetch(
              `http://localhost:4444/objects/${selectedObject._id}`,
              {
                method: 'DELETE',
              }
            );

            if (response.ok) {
              console.log('Object deleted successfully!');
              const objectIndex = objects.findIndex(
                obj => obj.name === selectedObjectName
              );
              objects.splice(objectIndex, 1);
            } else {
              console.error('Failed to delete object:', response.status);
            }
          }
        } catch (error) {
          console.error('Error deleting object:', error);
        }
      });

      logAddressAndObject(addressId)
        .then(data => {
          console.log('Object:', data.objects);

          const objectsContainer = document.getElementById(
            'objectDetailsContainer'
          );
          objectsContainer.innerHTML = '';
          if (data.objects && data.objects.length > 0) {
            const promises = data.objects.map(object =>
              logObjectAndIndicator(object._id)
            );

            Promise.all(promises)
              .then(indicatorDataArray => {
                indicatorDataArray.forEach((indicatorData, index) => {
                  const object = data.objects[index];

                  const objectContainer = document.createElement('div');
                  const objectNameParagraph = document.createElement('p');
                  objectNameParagraph.textContent = object.name;
                  objectContainer.appendChild(objectNameParagraph);

                  const indicatorList = document.createElement('ul');
                  indicatorList.style.listStyleType = 'none';
                  indicatorData.indicators.forEach(indicator => {
                    const indicatorItem = document.createElement('li');
                    indicatorItem.textContent = ` ${indicator.name}: ${indicator.value} ${indicator.unit}`;
                    indicatorList.appendChild(indicatorItem);

                    console.log('Indicator Name:', indicator.name);
                    console.log('Indicator Value:', indicator.value);
                    console.log('Indicator Unit:', indicator.unit);
                  });

                  objectContainer.appendChild(indicatorList);
                  objectsContainer.appendChild(objectContainer);
                });
              })
              .catch(error => {
                console.error('Error getting indicator data:', error);
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
