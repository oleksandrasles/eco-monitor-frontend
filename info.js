import {
  getAddress,
  deleteAddress,
} from './functions/Address.js';

import {
  getObject,
  updateObject,
  postObject,
  deleteObject
} from './functions/Object.js';

import {
  getIndicator,
  postIndicator,
  deleteIndicator
} from './functions/Indicator.js';

const urlParams = new URLSearchParams(window.location.search);
const addressId = urlParams.get('id');

const address = await getAddress(addressId);
console.log('addressId:', addressId);

const { _id, city, street, objectIds } = address;

const citySpan = document.getElementById('city');
const streetSpan = document.getElementById('street');

citySpan.textContent = city;
streetSpan.textContent = street;

/*
const deleteAddressButton = document.getElementById('delete_address');

deleteAddressButton.addEventListener('click', async function () {
  const response = await deleteAddress(addressId);
  console.log(response);
});
*/

const addObjectButton = document.getElementById('add_object');

addObjectButton.addEventListener('click', async function () {
  const objectName = prompt('Enter object name:');
  if (objectName) {
    const newObject = {
      name: objectName,
      addressId: addressId,
    };

    const response = await postObject(newObject);
    console.log(response);
  }
});

if (address.objects && address.objects.length > 0) {
  for (let objectId of address.objects) {
    const object = await getObject(objectId);
    if (object) {
      const objectsContainer = document.getElementById(
        'objectDetailsContainer'
      );
      
      const objectContainer = document.createElement('div');

      const objectNameParagraph = document.createElement('p');
      objectNameParagraph.textContent = object.name;
  
      const updateObjectButton = document.createElement('button');
      updateObjectButton.textContent = "Update Object";
      
      updateObjectButton.addEventListener('click', async function () {
        const objName = prompt('Enter Object name:', object.name);

        if (objName) {
          const updatedObject = {
            name: objName,
          };
      
          const response = await updateObject(updatedObject, objectId);
          console.log(response);
        }
      });

      const deleteObjectButton = document.createElement('button');
      deleteObjectButton.textContent = "Delete Object";

      deleteObjectButton.addEventListener('click', async function () {
        const response = await deleteObject(objectId);
        console.log(response);
      });

      const addIndicatorButton = document.createElement('button');
      addIndicatorButton.textContent = "Add Indicator";

      addIndicatorButton.addEventListener('click', async function () {
        const indName = prompt('Enter indicator name:');
        const indUnit = prompt('Enter indicator unit:');
        const indType = prompt('Enter indicator type id:');
        const indValueDate = prompt('Enter indicator value date:');
        const indValue = prompt('Enter indicator value:');

        if (indName && indUnit && indType) {
          const newIndicator = {
            name: indName,
            unit: indUnit,
            objectId: objectId,
            typeId: indType,
            values: [{date: indValueDate, value: indValue}]
          };
      
          const response = await postIndicator(newIndicator);
          console.log(response);
        }
      });
  
      objectContainer.appendChild(objectNameParagraph);

      objectContainer.appendChild(updateObjectButton);
      objectContainer.appendChild(deleteObjectButton);
      objectContainer.appendChild(addIndicatorButton);
  
      const indicatorList = document.createElement('ul');
      indicatorList.style.listStyleType = 'none';
      
      if (object.indicators && object.indicators.length > 0) {
        for(let indicatorId of object.indicators) {
          const indicator = await getIndicator(indicatorId);
          
          if(indicator) {
            const deleteIndicatorButton = document.createElement('button');
            deleteIndicatorButton.textContent = "Delete Indicator";
      
            deleteIndicatorButton.addEventListener('click', async function () {
              const response = await deleteIndicator(indicatorId);
              console.log(response);
            });
    
            const indicatorItem = document.createElement('li');
            indicatorItem.textContent = ` ${indicator.name}: ${indicator.values[0].value} ${indicator.unit}`;
            
            indicatorList.appendChild(indicatorItem);
            indicatorList.appendChild(deleteIndicatorButton);
    
            console.log('Indicator Name:', indicator.name);
            console.log('Indicator Value:', indicator.values[0].value);
            console.log('Indicator Unit:', indicator.unit);
          }
        }
      }
  
      objectContainer.appendChild(indicatorList);
      objectsContainer.appendChild(objectContainer);
    } 
  }
}


