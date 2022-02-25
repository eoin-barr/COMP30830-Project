let map;

async function initMap() {
    console.log('Helllloooooo')
    map = await new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
  }
  
  initMap();

