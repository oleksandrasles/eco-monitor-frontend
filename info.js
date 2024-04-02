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

      let isListExpanded = false;

      const deleteButton = document.getElementById('deleteObjectButton');
      deleteButton.addEventListener('click', async function () {
        try {
          const data = await logAddressAndObject(addressId);
          const objects = data.objects;

          const objectListContainer = document.getElementById(
            'objectListContainer'
          );
          objectListContainer.innerHTML = '';

          if (isListExpanded) {
            objectListContainer.innerHTML = '';
            const popup = document.getElementById('popup');
            popup.style.display = 'none';
            isListExpanded = false;
            return;
          }
          const chooseMessage = document.createElement('div');
          chooseMessage.textContent = 'Choose object to delete:';
          objectListContainer.appendChild(chooseMessage);

          objects.forEach(obj => {
            const objectItem = document.createElement('div');
            objectItem.textContent = obj.name;
            objectItem.classList.add('object-item');
            objectItem.addEventListener('click', async () => {
              const confirmation = confirm(
                `Are you sure you want to delete the object "${obj.name}"?`
              );
              if (confirmation) {
                try {
                  const response = await fetch(
                    `http://localhost:4444/objects/${obj._id}`,
                    {
                      method: 'DELETE',
                    }
                  );

                  if (response.ok) {
                    console.log('Object deleted successfully!');
                    const objectIndex = objects.findIndex(
                      item => item._id === obj._id
                    );
                    if (objectIndex !== -1) {
                      objects.splice(objectIndex, 1);
                      objectListContainer.removeChild(objectItem);
                    }
                  } else {
                    console.error('Failed to delete object:', response.status);
                  }
                } catch (error) {
                  console.error('Error deleting object:', error);
                }
              }
            });

            objectItem.addEventListener('mouseenter', function () {
              objectItem.style.color = 'rgb(36, 52, 123);';
            });

            objectItem.addEventListener('mouseleave', function () {
              objectItem.style.color = '';
            });

            objectListContainer.appendChild(objectItem);
          });

          const popup = document.getElementById('popup');
          popup.style.display = 'block';
          isListExpanded = true;
        } catch (error) {
          console.error('Error fetching objects:', error);
        }
      });

      //renameObjectButton
      const renameObjectButton = document.getElementById('renameObjectButton');
      renameObjectButton.addEventListener('click', async function () {
        try {
          const data = await logAddressAndObject(addressId);
          const objects = data.objects;

          const objectListContainer = document.getElementById(
            'objectListContainer'
          );
          objectListContainer.innerHTML = '';

          if (isListExpanded) {
            objectListContainer.innerHTML = '';
            const popup = document.getElementById('popup');
            popup.style.display = 'none';
            isListExpanded = false;
            return;
          }

          const chooseMessage = document.createElement('div');
          chooseMessage.textContent = 'Choose object to rename:';
          objectListContainer.appendChild(chooseMessage);

          objects.forEach(obj => {
            const objectItem = document.createElement('div');
            objectItem.textContent = obj.name;
            objectItem.classList.add('object-item');
            objectItem.addEventListener('click', async () => {
              const newName = prompt('Enter the new name for the object:');
              if (!newName) return;

              try {
                const response = await fetch(
                  `http://localhost:4444/objects/${obj._id}`,
                  {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newName }),
                  }
                );

                if (response.ok) {
                  console.log('Object renamed successfully!');
                } else {
                  console.error('Failed to rename object:', response.status);
                }
              } catch (error) {
                console.error('Error renaming object:', error);
              }
            });

            objectItem.addEventListener('mouseenter', function () {
              objectItem.style.color = 'rgb(36, 52, 123);';
            });

            objectItem.addEventListener('mouseleave', function () {
              objectItem.style.color = '';
            });

            objectListContainer.appendChild(objectItem);
          });

          const popup = document.getElementById('popup');
          popup.style.display = 'block';
          isListExpanded = true;
        } catch (error) {
          console.error('Error fetching objects:', error);
        }
      });

      //renameLocationButton
      const renameLocationButton = document.getElementById(
        'renameLocationButton'
      );
      renameLocationButton.addEventListener('click', async function () {
        const newCity = prompt('Enter the new city for the location:');
        if (!newCity) return;

        const newStreet = prompt('Enter the new street for the location:');
        if (!newStreet) return;

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
