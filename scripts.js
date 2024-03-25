document.addEventListener('DOMContentLoaded', function () {
  var map = L.map('map').setView([49.0, 31.0], 6); // центр карти та зум

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '\u0026copy; \u003ca href="https://www.openstreetmap.org/copyright"\u003eOpenStreetMap\u003c/a\u003e contributors',
  }).addTo(map);

  map.on('dblclick', function (e) {
    var coordinates = e.latlng;
    var markerName = prompt('Enter marker name:');

    if (markerName !== null && markerName.trim() !== '') {
      var marker = L.marker(coordinates).addTo(map);

      marker.bindPopup(`<b>${markerName}</b>`).openPopup();

      marker.on('dblclick', function () {
        var confirmation = confirm(
          'Are you sure you want to delete this marker?'
        );
        if (confirmation) {
          map.removeLayer(marker);
        }
      });
    }
  });

  fetch('http://localhost:4444/addresses')
    .then(response => response.json())
    .then(data => {
      data.forEach(address => {
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
          } else {
            console.error('The content of the popup is not text');
          }
        });
        console.log(address);
      });
    })
    .catch(error => console.error('Error getting data', error));
});
