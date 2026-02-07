import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA-3KRZIlqWWIriG69k870i_s0p3Fb1vrY",
  authDomain: "bukber-ikoed.firebaseapp.com",
  databaseURL: "https://bukber-ikoed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bukber-ikoed",
  storageBucket: "bukber-ikoed.firebasestorage.app",
  messagingSenderId: "1048793981361",
  appId: "1:1048793981361:web:3688383e06cd8418875d90"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
  const btnMasuk = document.getElementById("btnMasuk");
  const opening = document.getElementById("opening");
  const main = document.getElementById("mainContent");
  const bgMusic = document.getElementById("bgMusic");
  const toggleMusic = document.getElementById("toggleMusic");

  // autoplay musik
  bgMusic.play().catch(() => console.log("Autoplay diblok, akan main saat klik tombol."));

  btnMasuk.addEventListener("click", function () {
    // overlay fade out
    opening.style.animation = "fadeOut 1s forwards";

    setTimeout(() => {
      opening.style.display = "none";
      main.classList.remove("hidden");
      main.classList.add("animate");

      bgMusic.play().catch(() => console.log("Autoplay gagal, klik ikon play di browser."));
    }, 900);
  });

  // toggle musik
  toggleMusic.addEventListener("click", () => {
    if (bgMusic.paused) bgMusic.play();
    else bgMusic.pause();
  });

  // Absensi
  const selectAngkatan = document.getElementById("angkatanSelect");
  const hadirBox = document.getElementById("hadirBox");
  const statusText = document.getElementById("status");
  const btnHadir = document.getElementById("btnHadir");
  const btnTidakHadir = document.getElementById("btnTidakHadir");
  const rekapBox = document.getElementById("rekap");
  const jumlahHadir = document.getElementById("jumlahHadir");
  const jumlahTidakHadir = document.getElementById("jumlahTidakHadir");

  const sudahIsi = localStorage.getItem("absen_sudah");

  selectAngkatan.addEventListener("change", function () {
    const angkatan = this.value;
    if (!angkatan) return;

    tampilkanRekap(angkatan);

    if (sudahIsi) {
      hadirBox.classList.add("hidden");
      statusText.innerText = "Kamu sudah mengisi kehadiran.";
    } else {
      hadirBox.classList.remove("hidden");
      statusText.innerText = "";
    }
  });

  btnHadir.addEventListener("click", () => kirimAbsen("hadir"));
  btnTidakHadir.addEventListener("click", () => kirimAbsen("tidak_hadir"));

  function kirimAbsen(status) {
    if (sudahIsi) return;

    const angkatan = selectAngkatan.value;
    if (!angkatan) return;

    const tanggal = new Date().toISOString().split("T")[0];
    const absenRef = ref(db, 'absensi/' + angkatan + '/' + tanggal);
    push(absenRef, status);

    localStorage.setItem("absen_sudah", "ya");
    hadirBox.classList.add("hidden");
    statusText.innerText = "Terima kasih. Kehadiran sudah tercatat.";
  }

  function tampilkanRekap(angkatan) {
    const tanggal = new Date().toISOString().split("T")[0];
    const rekapRef = ref(db, 'absensi/' + angkatan + '/' + tanggal);

    onValue(rekapRef, (snapshot) => {
      let hadir = 0;
      let tidakHadir = 0;

      snapshot.forEach(child => {
        if (child.val() === "hadir") hadir++;
        if (child.val() === "tidak_hadir") tidakHadir++;
      });

      jumlahHadir.innerText = hadir;
      jumlahTidakHadir.innerText = tidakHadir;
      rekapBox.classList.remove("hidden");
    });
  }
});