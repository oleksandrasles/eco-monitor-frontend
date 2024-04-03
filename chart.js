import { getObject } from './functions/Object.js';

import { getIndicator } from './functions/Indicator.js';

const urlParams = new URLSearchParams(window.location.search);
const objectId = urlParams.get('objectId');
console.log('objectId:', objectId);

const object = await getObject(objectId);

if (object) {
  const indicatorsData = [];

  if (object.indicators && object.indicators.length > 0) {
    for (let indicatorId of object.indicators) {
      const indicator = await getIndicator(indicatorId);

      if (indicator) {
        indicatorsData.push(indicator);
      }
    }

    console.log('Indicators data:', indicatorsData);

    const selectElement = document.createElement('select');

    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select indicator';
    defaultOption.value = '';

    selectElement.appendChild(defaultOption);

    indicatorsData.forEach(indicator => {
      const optionElement = document.createElement('option');
      optionElement.textContent = indicator.name;
      optionElement.value = indicator._id;

      selectElement.appendChild(optionElement);
    });

    selectElement.addEventListener('change', function () {
      const selectedIndicatorId = this.value;
      const selectedIndicator = indicatorsData.find(
        indicator => indicator._id === selectedIndicatorId
      );
      if (selectedIndicator) {
        console.log('Selected indicator:', selectedIndicator);
        renderChart(selectedIndicator);
      }
      console.log('Select changed. New value:', this.value);
    });

    document.body.appendChild(selectElement);
  } else {
    console.log('This object does not have any indicators.');
  }
} else {
  console.log('Object not found.');
}

const canvasElement = document.createElement('canvas');
canvasElement.id = 'myChart';
document.body.appendChild(canvasElement);

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
        beginAtZero: true,
      },
    },
  },
});

async function renderChart(selectedIndicator) {
  const labels = [];
  const values = [];

  selectedIndicator.values.forEach(value => {
    const date = new Date(value.date);
    const formattedDate = date.toLocaleDateString();
    labels.push(formattedDate);
    values.push(value.value);
  });

  myChart.data.labels = labels;
  myChart.data.datasets = [
    {
      label: selectedIndicator.name,
      data: values,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1,
    },
  ];
  myChart.update();
}