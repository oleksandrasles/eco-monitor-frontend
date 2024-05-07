import { calculateAIR, calculateWTR, calculateIS, calculateRAD, calculatePX, calculateHLTH, calculateP } from "./calculations.js";
import {
  deleteAddress,
  getAddresses,
  postAddress,
} from "./functions/Address.js";
import { getIndicator } from "./functions/Indicator.js";
import { getObject } from "./functions/Object.js";
import { getTypes } from "./functions/Type.js";

document.addEventListener("DOMContentLoaded", async function () {
  var map = L.map("map", {
    doubleClickZoom: false,
  }).setView([49.0, 31.0], 6);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const types = await getTypes();

  const typesDiv = document.getElementById("types");

  const allTypeButton = document.createElement("button");

  allTypeButton.addEventListener("click", function (e) {
    localStorage.setItem("type", "all all");
    location.reload();
  });

  allTypeButton.textContent = "All";
  typesDiv.appendChild(allTypeButton);

  types.forEach((type) => {
    const typeButton = document.createElement("button");
    typeButton.textContent += type.name;
    typeButton.addEventListener("click", function (e) {
      localStorage.setItem("type", type._id + " " + type.name);
      location.reload();
    });

    typesDiv.appendChild(typeButton);
  });

  const current = document.getElementById("current");
  const curType = localStorage.getItem("type");
  const curTypeValue = curType.split(" ")[1];
  current.textContent += curType.split(" ")[1];

  map.on("dblclick", function (e) {
    var coordinates = e.latlng;
    const newCity = prompt("Enter the new city for the location:");
    if (!newCity) return;

    const newStreet = prompt("Enter the new street for the location:");
    if (!newStreet) return;

    var marker = L.marker(coordinates).addTo(map);

    marker
      .bindPopup(
        `<b>${newCity}</b><br>${newStreet}<br><button id="infoButton" class="detailsButton">Information</button>`
      )
      .openPopup();

    document
      .getElementById("infoButton")
      .addEventListener("click", function () {
        console.log("The button was pressed");
        const addressId = address._id;
        console.log("ID:", addressId);
        window.open(`info.html?id=${addressId}`, "_blank");
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

  addresses.forEach(async (address) => {
    const { _id, city, street, latitude, longitude } = address;
    var marker = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`<b>${city}</b><br>${street}<br>`, { autoClose: false });

    marker.on("click", async function (e) {
      var popupContent = e.target._popup.getContent();

      let val = { value: 0, level: 0 };

      if (address.objects && address.objects.length > 0) {
        if (curTypeValue == "air-quality") {
          for (let objectId of address.objects) {
            const AIR = await calculateAIR(objectId); //(3.1)
            if (AIR) {
              val = AIR;
            }
          }
        }
        if (curTypeValue == "water-quality") {
          for (let objectId of address.objects) {
            const WTR = await calculateWTR(objectId); //(3.3)
            if (WTR) {
              val = WTR;
            }
          }
        }
        if (curTypeValue == "soil-quality") {
          for (let objectId of address.objects) {
            const IS = await calculateIS(objectId); //(3.4)
            if (IS.value) {
              val = IS;
            }
          }
        }
        if (curTypeValue == "radiation") {
          for (let objectId of address.objects) {
            const RAD = await calculateRAD(objectId); //(3.5)
            if (RAD) {
              val = RAD;
            }
          }
        }
        if (curTypeValue == "economic") {
          for (let objectId of address.objects) {
            const PX = await calculatePX(objectId); //price index
            if (PX) {
              val = PX;
            }
          }
        }
        if (curTypeValue == "health") {
          for (let objectId of address.objects) {
            const HLTH = await calculateHLTH(objectId); //Показник народжуваності = число народжень на рік / кількість населення
            if (HLTH) {
              val = HLTH;
            }
          }
        }
        if (curTypeValue == "energy") {
          for (let objectId of address.objects) {
            const P = await calculateP(objectId); //(3.10)
            if (P) {
              val = P;
            }
          }
        }
      }

      console.log(address);
      console.log(val.value);

      if (typeof popupContent === "string") {
        var tempDiv = document.createElement("div");
        tempDiv.innerHTML = popupContent;

        var button = document.createElement("button");
        button.textContent = "Information";
        button.classList.add("detailsButton");

        var valP = document.createElement("p");
        valP.textContent = val.value;

        if (val.level == 1) valP.classList.add("lvl_1");
        else if (val.level == 2) valP.classList.add("lvl_2");
        else if (val.level == 3) valP.classList.add("lvl_3");
        else if (val.level == 4) valP.classList.add("lvl_4");
        else if (val.level == 5) valP.classList.add("lvl_5");

        button.addEventListener("click", function (event) {
          console.log("The button was pressed");
          const addressId = address._id;
          console.log("ID:", addressId);
          window.open(`info.html?id=${addressId}`, "_blank");
        });

        tempDiv.appendChild(button);
        tempDiv.appendChild(valP);

        e.target._popup.setContent(tempDiv);
      }
    });

    let confirmation = false;

    marker.on("dblclick", async function (e) {
      confirmation = confirm("Are you sure you want to delete this marker?");
      if (confirmation) {
        const response = await deleteAddress(_id);
        map.removeLayer(marker);
        console.log(response);
      }
      console.log(e, confirmation);
    });

    //console.log(address);
  });
});
