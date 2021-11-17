// https://www.youtube.com/watch?v=vK2NoOoqyRo
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs,
  addDoc, deleteDoc, doc, GeoPoint
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCAN0iXjvVJ4WqZkYVGFUvGN1uGWgY94es",
  authDomain: "testmapproject-332010.firebaseapp.com",
  projectId: "testmapproject-332010",
  storageBucket: "testmapproject-332010.appspot.com",
  messagingSenderId: "693967843436",
  appId: "1:693967843436:web:553f1a2749c93b30df2849"
};

//init app
initializeApp(firebaseConfig)

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
console.log();