// https://www.youtube.com/watch?v=vK2NoOoqyRo
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore, collection, getDocs,
  addDoc, deleteDoc, doc, GeoPoint
} from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js';

import {
  getStorage, ref, getDownloadURL, uploadString
} from 'https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyCAN0iXjvVJ4WqZkYVGFUvGN1uGWgY94es",
  authDomain: "testmapproject-332010.firebaseapp.com",
  projectId: "testmapproject-332010",
  storageBucket: "testmapproject-332010.appspot.com",
  messagingSenderId: "693967843436",
  appId: "1:693967843436:web:553f1a2749c93b30df2849"
};

//init app
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const db = getFirestore()

const colRef = collection(db, 'Photos')

// getDocs(colRef)
//   .then((snapshot) => {
//     let photos = []
//     snapshot.docs.forEach((doc) => {
//       photos.push({ ...doc.data(), id: doc.id })
//     })
//     console.log(photos)
//   })
//   .catch(err => {
//     console.log(err.message)
//   })

//add documents

let position

const addPhotoForm = document.querySelector('.add')
if (addPhotoForm) {
  addPhotoForm.addEventListener('submit', (e) => {

    e.preventDefault()

    if (!addPhotoForm.url.value || !addPhotoForm.name.value) {
      e.preventDefault()
      alert('take a picture first before submitting a form')
      return false

    }


    if (addPhotoForm.latitude.value == "" && addPhotoForm.longnitude.value == "") {


      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          position = new GeoPoint(pos.coords.latitude, pos.coords.longitude);
          addDoc(colRef, {
            name: addPhotoForm.name.value,
            position: position,
            url: addPhotoForm.url.value,
          }).then(() => {
            alert("form submitted succesfully")
            addPhotoForm.reset()
          })

        },
          function (error) {
            if (error.code == error.PERMISSION_DENIED) {
              alert("User denied the request for Geolocation.")
            }
          }

        )
      } else {
        alert("Geolocation not supported")
      }


    }
    else if (addPhotoForm.latitude.value == "" || addPhotoForm.longnitude.value == "") {
      alert('please provide values for latitude and longnitude')
    }
    else {
      if (addPhotoForm.latitude.value > 90 || addPhotoForm.latitude.value < -90) {
        alert("Latitude must be a number between -90 and 90 but was: " + addPhotoForm.latitude.value)
      }
      if (addPhotoForm.longnitude.value > 180 || addPhotoForm.latitude.value < -180) {
        alert("Longnitude must be a number between -90 and 90 but was: " + addPhotoForm.longnitude.value)
      }
      addDoc(colRef, {
        name: addPhotoForm.name.value,
        position: new GeoPoint(addPhotoForm.latitude.value, addPhotoForm.longnitude.value),
        url: addPhotoForm.url.value

      }).then(() => {
        addPhotoForm.reset();
        console.log('success')
        alert('form submitted successfully')
      })
    }

  })
}


//delete documents
const deletePhotoForm = document.querySelector('.delete')
if (deletePhotoForm) {
  deletePhotoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'Photos', deletePhotoForm.id.value)

    deleteDoc(docRef)
      .then(() => {
        deletePhotoForm.reset()
      })
  })
}


const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById("snap");
const errorMsgElement = document.querySelector('span#errorMsg');

const constraints = {
  audio: false,
  video: {
    width: 400, height: 400
  }
};

// Access webcam
async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

// Success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

// Load init
init();

// Draw image
var context = canvas.getContext('2d');
snap.addEventListener("click", function () {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  var image = new Image();
  image.id = "pic";
  image.src = canvas.toDataURL();
  // console.log(image.src)
  var button = document.createElement('button')
  button.textContent = 'Upload Image'
  document.body.appendChild(button)

  button.addEventListener('click', () => {
    this.setAttribute('display', 'none')
    var fileName = new Date() + '-' + 'base64';
    const storageRef = ref(storage, fileName);
    const upload = uploadString(storageRef, image.src, "data_url").then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadurl) => {
        addPhotoForm.url.value = downloadurl.toString();
        alert('image uploaded successfully');
      })
    });
    context.clearRect(0, 0, canvas.width, canvas.height);
  })

}
);
