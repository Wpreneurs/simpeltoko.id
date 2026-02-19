<script>//<![CDATA[
window.APP = window.APP || {};
document.addEventListener("DOMContentLoaded", function(){

  const phoneEl = document.getElementById("Whatsapp");
  APP.phone = phoneEl ? phoneEl.textContent.trim() : "";

  const config = document.getElementById("sheet-config");

  APP.sheets = [
    { containerId:"product-list-1", url: config.dataset.sheet1 },
    { containerId:"product-list-2", url: config.dataset.sheet2 },
    { containerId:"product-list-3", url: config.dataset.sheet3 },
    { containerId:"product-list-4", url: config.dataset.sheet4 }
  ];

  APP.currentProduct = {};
});
//]]></script>

<script>//<![CDATA[
window.initSheets = function(){

  APP.sheets.forEach(sheet => {
    if (sheet.url && sheet.url.includes("https")) {
      loadSheet(sheet);
    }
  });

  function loadSheet(sheet){

    const container = document.getElementById(sheet.containerId);
    if (!container) return;

    container.innerHTML = "Memuat data...";

    fetch(sheet.url)
      .then(res => res.text())
      .then(csv => {

        const rows = csv.split("\n").filter(r => r.trim()).slice(1);
        container.innerHTML = "";

        rows.forEach(row => {

          const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          if (cols.length < 4) return;

          const nama  = cols[1].replace(/"/g,"").trim();
          const desk  = cols[2].replace(/"/g,"").trim();
          const harga = cols[3].replace(/"/g,"").trim();
          const img   = cols[4].replace(/"/g,"").trim();
          const badge = cols[5] ? cols[5].replace(/"/g,"").trim() : "";

          const card = document.createElement("div");
          card.className = "product-card";

          card.innerHTML = `
            ${badge ? `<span class="badge">${badge}</span>` : ""}
            <div class="thumb">
              <img src="${img}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            </div>
            <div class="info">
              <div class="title">${nama}</div>
              <span class="old">${desk}</span>
              <span class="new">Rp ${Number(harga).toLocaleString('id-ID')}</span>
              <button class="buy"><svg width="14px" height="14px" viewbox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z" fill="#ffffff"></path> </g></svg>Beli Sekarang</button>
            </div>
          `;

          card.querySelector(".buy").onclick = () => openModal(nama, harga, img);

          container.appendChild(card);
        });
      });
  }
};
//]]></script>

<script>//<![CDATA[
window.initModal = function(){

  const modal  = document.getElementById("orderModal");
  const mTitle = document.getElementById("m-title");
  const mPrice = document.getElementById("m-price");
  const mImg   = document.getElementById("m-img");

  window.openModal = function(nama, harga, img){
    APP.currentProduct = { nama, harga };

    mTitle.innerText = nama;
    mPrice.innerText = "Rp " + Number(harga).toLocaleString('id-ID');
    mImg.src = img;

    modal.style.display = "flex";
  };

  document.querySelector(".close").onclick = () => modal.style.display="none";

  window.onclick = (e)=>{
    if(e.target===modal) modal.style.display="none";
  };
};
//]]></script>

<script>//<![CDATA[
window.initWhatsapp = function(){

  const orderForm = document.getElementById("orderForm");

  orderForm.onsubmit = function(e){
    e.preventDefault();

    const name = custName.value;
    const addr = custAddress.value;
    const qty  = custQty.value;

    const p = APP.currentProduct;
    const total = Number(p.harga) * Number(qty);

    const msg = [
      "*PESANAN BARU*",
      "-----------------------------",
      `*Produk:* ${p.nama}`,
      `*Harga:* Rp ${Number(p.harga).toLocaleString('id-ID')}`,
      `*Jumlah:* ${qty}`,
      `*Total:* Rp ${total.toLocaleString('id-ID')}`,
      "-----------------------------",
      `*Nama:* ${name}`,
      `*Alamat:* ${addr}`
    ].join("\n");

    window.open(`https://wa.me/${APP.phone}?text=${encodeURIComponent(msg)}`, "_blank");

    orderForm.reset();
    document.getElementById("orderModal").style.display="none";
  };
};
//]]></script>

<script>//<![CDATA[
window.initTabs = function(){

  document.querySelectorAll(".tab-btn").forEach(btn=>{
    btn.onclick = function(){

      document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c=>c.classList.remove("active"));

      this.classList.add("active");

      const target = document.getElementById(this.dataset.tab);
      if(target) target.classList.add("active");

      this.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"});
    };
  });

};
//]]></script>
<script>//<![CDATA[
document.addEventListener("DOMContentLoaded", function(){
  initSheets();
  initModal();
  initWhatsapp();
  initTabs();
});
//]]></script>

<script>
//<![CDATA[
window.addEventListener("load", function(){

const clock = document.getElementById("clock");
console.log("clock found:", clock);

if (!clock) return;

const timeEl = document.getElementById("clockTime");
const dateEl = document.getElementById("clockDate");

const hari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

function updateClock(){

  const now = new Date();

  const h = String(now.getHours()).padStart(2,"0");
  const m = String(now.getMinutes()).padStart(2,"0");
  const s = String(now.getSeconds()).padStart(2,"0");

  timeEl.textContent = `${h} : ${m} : ${s}`;

  const d = now.getDate();
  const day = hari[now.getDay()];
  const month = bulan[now.getMonth()];
  const y = now.getFullYear();

  dateEl.textContent = `${day}, ${d} ${month} ${y}`;
}

updateClock();
setInterval(updateClock,1000);

});
//]]>
</script>   
   <script>//<![CDATA[
(async function(){

const SECRET = "SIMPELTOKO.ID_0354";

/* =============================
   BASIC FUNCTIONS
============================= */

function getBlogID(){
  const el = document.getElementById("blogger-id");
  if(!el) return "";
  return el.textContent.trim();
}

function getLicenseFromWidget(){
  const el = document.getElementById("license-code");
  if(!el) return "";
  return el.textContent.trim();
}

function decodeLicense(str){
  try{ return atob(str); }
  catch(e){ return ""; }
}

async function sha1(msg){
  const buffer = new TextEncoder().encode(msg);
  const hash = await crypto.subtle.digest("SHA-1", buffer);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2,"0"))
    .join("");
}

function setCookie(name,value,days){
  const d = new Date();
  d.setTime(d.getTime() + (days*86400000));
  document.cookie = name+"="+value+";expires="+d.toUTCString()+";path=/";
}

function getCookie(name){
  const v = document.cookie.match('(^|;) ?'+name+'=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function getFingerprint(){
  return btoa(
    navigator.userAgent +
    navigator.language +
    screen.width +
    screen.height +
    screen.colorDepth +
    new Date().getTimezoneOffset()
  );
}

/* =============================
   START
============================= */

document.addEventListener("DOMContentLoaded", async function(){

  const blogID = getBlogID();
  const inputLicense = decodeLicense(getLicenseFromWidget());
  const validLicense = await sha1(blogID + SECRET);

  if(inputLicense !== validLicense){

    /* =============================
       TRIAL MODE
    ============================= */

    const TRIAL_DAYS = 1;
    const FP = getFingerprint();
    const KEY = "st_trial_" + blogID + "_" + FP;

    let start =
      localStorage.getItem(KEY) ||
      getCookie(KEY);

    if(!start){
      start = Date.now();
      localStorage.setItem(KEY, start);
      setCookie(KEY, start, 3650);
    }

    const daysUsed = Math.floor((Date.now() - start) / 86400000);

    if(daysUsed < TRIAL_DAYS){
      console.log("Trial aktif hari ke:", daysUsed+1);
      return;
    }

    /* =============================
       SHOW OVERLAY AFTER DELAY
    ============================= */

    setTimeout(()=>{

      /* ===== BLUR LAYER ===== */
      const blurLayer = document.createElement("div");
      blurLayer.style.cssText = `
        position:fixed;
        inset:0;
        backdrop-filter: blur(10px) saturate(120%);
        background: rgba(15,23,42,0.35);
        z-index:999998;
        opacity:0;
        transition:opacity .4s ease;
      `;
      document.body.appendChild(blurLayer);

      /* ===== OVERLAY ===== */
      const overlay = document.createElement("div");
      overlay.id = "simpeltoko-license-overlay";
      overlay.style.cssText = `
        position:fixed;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:999999;
        font-family:system-ui,-apple-system,sans-serif;
        opacity:0;
        transform:scale(.92);
        transition:all .35s ease;
      `;

      overlay.innerHTML = `
        <div style="
          background:linear-gradient(180deg,#ffffff,#f8fafc);
          width:92%;
          max-width:420px;
          padding:30px 26px;
          border-radius:20px;
          text-align:center;
          box-shadow:0 25px 70px rgba(0,0,0,.25);
        ">
          <div style="
            width:58px;height:58px;margin:0 auto 14px;
            border-radius:16px;background:#FC2C5C;
            display:flex;align-items:center;justify-content:center;
            color:#fff;font-size:26px;font-weight:bold;
          ">!</div>

          <h2 style="margin:6px 0 8px;color:#0f172a">
            Lisensi Tidak Aktif
          </h2>

          <p style="color:#475569;font-size:14px;line-height:1.6;margin-bottom:20px">
            Template ini belum memiliki lisensi aktif.<br>
            Aktivasi lisensi untuk membuka semua fitur premium.
          </p>

          <a href="https://www.simpeltoko.id" target="_blank"
             style="
              display:block;padding:14px;border-radius:12px;
              background:#2563eb;color:white;text-decoration:none;
              font-weight:600;
              box-shadow:0 10px 20px rgba(37,99,235,.35);
             ">
            Aktivasi Sekarang
          </a>

          <div style="margin-top:14px;font-size:13px;color:#64748b">
            Redirect otomatis dalam <b><span id="count">20</span></b> detik
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      requestAnimationFrame(()=>{
        blurLayer.style.opacity="1";
        overlay.style.opacity="1";
        overlay.style.transform="scale(1)";
      });

      /* ===== COUNTDOWN ===== */
      let sec = 20;
      const timer = setInterval(()=>{
        sec--;
        document.getElementById("count").innerText = sec;
        if(sec === 0){
          clearInterval(timer);
          window.location.href="https://www.simpeltoko.id";
        }
      },1000);

      /* =============================
         🔒 PROTECTION LAYER
      ============================= */

      // reload jika widget lisensi dihapus
      setInterval(()=>{
        if(!document.getElementById("license-code")){
          location.reload();
        }
      },3000);

      // monitor DOM perubahan
      const observer = new MutationObserver(()=>{
        if(!document.getElementById("license-code")){
          location.reload();
        }
      });
      observer.observe(document.body,{childList:true,subtree:true});

      // paksa overlay tetap tampil
      setInterval(()=>{
        const o = document.getElementById("simpeltoko-license-overlay");
        if(o){
          o.style.display="flex";
          o.style.opacity="1";
          o.style.visibility="visible";
          o.style.pointerEvents="auto";
        }
      },1000);

      // reload jika overlay dihapus
      overlay.addEventListener("remove", ()=> location.reload());

      /* =============================
         🔒 ANTI DISABLE SCRIPT
      ============================= */

      try{
        Object.defineProperty(window, "simpeltokoProtected", {
          value:true,
          writable:false,
          configurable:false
        });
      }catch(e){}

      // cegah manipulasi body
      const originalRemove = Element.prototype.remove;
      Element.prototype.remove = function(){
        if(this.id === "simpeltoko-license-overlay"){
          location.reload();
          return;
        }
        originalRemove.apply(this, arguments);
      };

    },7000);

  }

});

})();//]]>
</script>
