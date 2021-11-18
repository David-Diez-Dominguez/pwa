// https://www.youtube.com/watch?v=vK2NoOoqyRo
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs,
  addDoc, deleteDoc, doc, GeoPoint
} from 'firebase/firestore';

import {
  getStorage, ref, getDownloadURL, uploadString
} from 'firebase/storage';

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

getDocs(colRef)
  .then((snapshot) => {
    let photos = []
    snapshot.docs.forEach((doc) => {
      photos.push({ ...doc.data(), id: doc.id })
    })
    console.log(photos)
  })
  .catch(err => {
    console.log(err.message)
  })

//add documents

let position
const addPhotoForm = document.querySelector('.add')
addPhotoForm.addEventListener('submit', (e) => {
  e.preventDefault()


  if (addPhotoForm.latitude.value == "" && addPhotoForm.longnitude.value == "") {


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {

        position = new GeoPoint(pos.coords.latitude, pos.coords.longitude);
        addDoc(colRef, {
          name: addPhotoForm.name.value,
          position: position,
        }).then(() => {
          addPhotoForm.reset()
        })

      })
    } else {
      // wenn kein gps oder keine koordinaten in input#
      console.log('fehelerrrrr');
    }


  }
  else {
    addDoc(colRef, {
      name: addPhotoForm.name.value,
      position: new GeoPoint(addPhotoForm.latitude.value, addPhotoForm.longnitude.value)

    }).then(() => {
      addPhotoForm.reset()
    })
  }

})

//delete documents
const deletePhotoForm = document.querySelector('.delete')
deletePhotoForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'Photos', deletePhotoForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deletePhotoForm.reset()
    })
})


function uploadImage() {
  const ref = storage().ref();
  const file = document.querySelector("#photo").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type
  };
  const task = ref.child(name).put(file, metadata);
  task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then(url => {
      console.log(url);
      document.querySelector("#image").src = url;
    })
    .catch(console.error);
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
  context.drawImage(video, 0, 0, 640, 480);
  var image = new Image();
  image.id = "pic";
  image.src = canvas.toDataURL();
  console.log(image.src)
  var button = document.createElement('button')
  button.textContent = 'Upload Image'
  document.body.appendChild(button)

  button.addEventListener('click', () => {
    const storageRef = ref(storage, "penis");
    uploadString(storageRef, image.src, "data_url").then((snapshot) => {
      console.log(snapshot);
    });
  })

}
);
