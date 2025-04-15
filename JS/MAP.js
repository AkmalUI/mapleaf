function dialog(e) {
  dialog.open();
  document.getElementById("latadd").value = e.latlng.lat;
  document.getElementById("lonadd").value = e.latlng.lng;
}
// declare map
let map = L.map("map", {
  contextmenu: true,
  contextmenuWidth: 160,
  zoomControl: false,
  contextmenuItems: [
    {
      text: "Add marker here",
      callback: dialog,
    },
    {
      text: "Add coordinates to edit",
      callback: showCoordinates,
    },
    {
      text: "Center map here",
      callback: centerMap,
    },
    "-",
    {
      text: "Zoom in",
      callback: zoomIn,
    },
    {
      text: "Zoom out",
      callback: zoomOut,
    },
  ],
}).setView([-6.97269, 107.6322], 18);
var notification = L.control
  .notifications({
    timeout: 10000,
    position: "topright",
    closable: false,
    dismissable: false,
    className: "modern",
  })
  .addTo(map);
// notification
if (localStorage.getItem("notifadd")) {
  notification.success("Success", "Record added successfully", {
    timeout: 6000,
    closable: true,
    dismissable: true,
    icon: "fa fa-check-circle",
  });
  localStorage.removeItem("notifadd");
}
// icon button
L.control
  .zoom({
    position: "topleft",
  })
  .addTo(map);
L.cascadeButtons(
  [
    {
      icon: "fa fa-home",
      ignoreActiveState: true,
      command: () => {
        home();
      },
    },
  ],
  { position: "topleft", direction: "vertical" }
).addTo(map);
//home zoom
function home() {
  map.setView([-6.97269, 107.6322], 18);
}
// map attri
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
// test slide
// function slide(){
//   var map = document.getElementById('map');
//   map.style.marginLeft = '0px';
// }

// delete marker
function deleteMark(e) {
  var deleted = new FormData();
  deleted.append("nama", e.relatedTarget.options.name);

  fetch("delete.php", {
    method: "POST",
    body: deleted,
  })
    .then((response) => {
      if (response.ok) {
        // Handle successful response
        map.removeLayer(nama[e.relatedTarget.options.name]);
        notification.success("Success", "Record deleted successfully", {
          timeout: 6000,
          closable: true,
          dismissable: true,
          icon: "fa fa-check-circle",
        });
      } else {
        // Handle failed response
        console.error("Failed to delete marker");
      }
    })
    .catch((error) => {
      // Handle network errors
      console.error("Error:", error);
    });
}
// edit marker
// document.getElementById("submitBtn").addEventListener("click", function() {
//   var formData = new FormData(document.getElementById("sen"));
//   var name = formData.get('nama');
//   var namebaru = formData.get('namabaru');
//   var lat = formData.get('lat');
//   var lon = formData.get('lon')
//   fetch("edit.php", {
//     method: "POST",
//     body: formData
//   })
//   .then(response => response.text())
//   .then(data => {
//     let mar = nama[name]
//     delete nama[name]
//     mar.options.name = namebaru;
//     nama[name] = mar;
//     mar.setLatLng([lat, lon])
//     mar.bindTooltip(namebaru);
//     notification.success('Success', 'Record updated successfully',
//   {
//     timeout: 6000,
//     closable: true,
//     dismissable: true,
//     icon: 'fa fa-check-circle',
//   })
//   })
//   .catch(error => {
//     console.error("Error:", error);
//   });
// });
// add marker
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("submitmarker")
    .addEventListener("click", function () {
      var formData = new FormData(document.getElementById("add"));
      fetch("add.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          window.location.reload();
          localStorage.setItem("notifadd", "true");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});
// ambil data dari database
async function fetchData(add) {
  console.log("Fetching data...");
  try {
    const response = await fetch("get.php");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
var content = `
      <form id="add">
        <table>
          <tr>
            <th><h3>Name</h3></th>
            <td><input type="text" id="nama" name="nama"></td>
          </tr>
          <tr>
            <th><h3>Latitude</h3></th>
            <td><input type="text" id="latadd" name="latadd"></td>
          </tr>
          <tr>
            <th><h3>Longitude</h3></th>
            <td><input type="text" id="lonadd" name="lonadd"></td>
          </tr>
          <tr>
            <th><h3>Suhu</h3></th>
            <td><input type="text" id="suhu" name="suhu"></td>
          </tr>
          <tr>
            <th><h3>Kelembapan</h3></th>
            <td><input type="text" id="kelembapan" name="kelembapan"></td>
          </tr>
          <tr>
            <th><h3>Keterangan</h3></th>
            <td><input type="text" id="keterangan" name="keterangan"></td>
          </tr>
        </table>
        <input type="button" id="submitmarker" value="Submit">
      </form>
  `;
// right click
var dialog = L.control
  .dialog({
    size: [300, 500],
    minSize: [100, 100],
    maxSize: [1000, 1000],
    anchor: [250, 250],
    position: "topleft",
    initOpen: false,
  })
  .setContent(content)
  .addTo(map);

//setup marker
let panjangdata = 0;
let namamarker = {};

fetchData(add).then((data) => {
  panjangdata = data.length;
  for (let i = 0; i < data.length; i++) {
    let marker = L.marker([data[i].lat, data[i].lon], {
      icon: buoy,
      name: data[i].nama,
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: [
        {
          text: "Delete Marker",
          callback: deleteMark,
          index: 0,
        },
        {
          text: "Show coordinates",
          callback: showCoordinates,
        },
        {
          text: "Center map here",
          callback: centerMap,
        },
        "-",
        {
          text: "Zoom in",
          callback: zoomIn,
        },
        {
          text: "Zoom out",
          callback: zoomOut,
        },
      ],
    })
      .bindTooltip(data[i].nama)
      .openTooltip()
      .addTo(map)
      .on("click", open);
    namamarker[data[i].nama] = marker;
  }
});
// setInterval(fetchData, 5000);
// set marker icon
let buoy = L.icon({
  iconUrl: "CSS/buoy.png",
  iconSize: [50, 50], // size of the icon
  // shadowSize:   [50, 64], // size of the shadow
  iconAnchor: [22, 48], // point of the icon which will correspond to marker's location
  // shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor: [0, -47], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [0, -47],
});
//func for right click map
function showCoordinates(e) {
  document.getElementById("lat").value = e.latlng.lat;
  document.getElementById("lon").value = e.latlng.lng;
}

function centerMap(e) {
  map.panTo(e.latlng);
}

function zoomIn(e) {
  map.zoomIn();
}

function zoomOut(e) {
  map.zoomOut();
}
// popup on random place
let popup = L.popup()
  .setLatLng([-6.97254, 107.6322])
  .setContent("Click on marker for more information")
  .openOn(map);

// sidebar
const panelRight = L.control
  .sidepanel("panelID", {
    panelPosition: "left",
    hasTabs: true,
    tabsPosition: "top",
    pushControls: true,
    darkMode: false,
    startTab: "tab-1",
  })
  .addTo(map);
// open sidebar and highlight marker when marker click
var light = L.divIcon({
  className: "high-light", // optional CSS class name
  html: `
          <div class="container">
           <div class="pulse-ring"></div>
           <div class="red-medium-circle"></div>
           <div class="red-big-circle"></div>
           <div class="red-huge-circle"></div>
          </div>
      `,
  iconSize: [30, 42], // size of the icon
  iconAnchor: [15, 42], // point of the icon which will correspond to marker's location
});

// var state = false;
//   function open(e) {
//     if(!state){
//       document.getElementById("slept").click();
//       state = true;
//     }
//     console.log(e.target.options.name)
//     fetchData(e.target.options.name)
//       .then(data => {
//         for (let z = 0; z < data.length; z++){
//           if (e.target.options.name === data[z].nama){
//             document.getElementById("data1").innerHTML = "Suhu : " + data[z].suhu;
//             document.getElementById("data2").innerHTML = "Kelembapan : " + data[z].kelembapan;
//             document.getElementById("lat").value = data[z].lat;
//             document.getElementById("lon").value = data[z].lon;
//             document.getElementById("nama").value = data[z].nama;
//             document.getElementById("namabaru").value = data[z].nama;

//             let head = document.querySelectorAll("#monitor");
//             head.forEach(function(element) {
//               element.innerHTML = data[z].nama;
//             });
//             // if(tescis){
//             //   tescis.remove();
//             // }
//             // tescis = L.marker([data[z].lat, data[z].lon], {
//             //   icon: light,
//             //   zIndexOffset: -100
//             // }).addTo(map);
//             break;
//           }
//         }
//       })
//   // map.setView(e.target.getLatLng(), map.getZoom());
//   }
//   document.getElementById("slept").addEventListener("click", function() {
//     state = !state;
//     // document.getElementById("data1").innerHTML = "Suhu : ";
//     // document.getElementById("data2").innerHTML = "Kelembapan : ";
//     // document.getElementById("lat").value = "";
//     // document.getElementById("lon").value = "";
//     // document.getElementById("nama").value = "";
//     // document.getElementById("namabaru").value = "";
//     // let head = document.querySelectorAll("#monitor");
//     // head.forEach(function(element) {
//     //   element.innerHTML = "";
//     // });
//     // if(tescis){
//     //   tescis.remove();
//     // }

//   });

function Destroy() {
  window.location.href = "https://matias.me/nsfw/";
}
