function normalizeWhatsApp(raw) {
  let digits = String(raw).replace(/\D/g, "");
  if (digits.startsWith("0")) digits = "62" + digits.slice(1);
  return digits;
}

function getCvUrl() {
  if (CONFIG.cvUrlOnline && CONFIG.cvUrlOnline.trim()) {
    const base = CONFIG.cvUrlOnline.replace(/\/$/, "");
    return `${base}/index.html`;
  }
  const base = window.location.href.replace(/[^/]*$/, "");
  return `${base}index.html`;
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  elements.forEach((el) => observer.observe(el));
}

function initSkillBars() {
  const fills = document.querySelectorAll(".skill-fill");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  fills.forEach((fill) => observer.observe(fill));
}

function initProfilePhoto() {
  const img = document.getElementById("profile-photo");
  if (!img) return;

  img.addEventListener("error", () => {
    img.src = CONFIG.fotoFallback;
  });
  img.src = CONFIG.foto;
  img.alt = `Foto profil ${CONFIG.nama}`;
}

function initContactLinks() {
  const emailEl = document.getElementById("contact-email");
  const waEl = document.getElementById("contact-wa");
  const igEl = document.getElementById("social-instagram");
  const liEl = document.getElementById("social-linkedin");

  if (emailEl) {
    emailEl.href = `mailto:${CONFIG.email}`;
    emailEl.textContent = CONFIG.email;
  }

  if (waEl) {
    const nomor = normalizeWhatsApp(CONFIG.whatsapp);
    waEl.href = `https://wa.me/${nomor}`;
    waEl.textContent = CONFIG.whatsapp;
  }

  if (igEl && CONFIG.instagram && !CONFIG.instagram.endsWith("usernameanda")) {
    igEl.href = CONFIG.instagram;
  }
  if (liEl && CONFIG.linkedin && !CONFIG.linkedin.endsWith("usernameanda")) {
    liEl.href = CONFIG.linkedin;
  }
}

function initDownloadPdf() {
  const btn = document.getElementById("btn-download-pdf");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = "Menyiapkan PDF…";

    try {
      if (typeof html2pdf === "undefined") {
        window.print();
        return;
      }

      const element = document.getElementById("cv-content");
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `CV_${CONFIG.nama.replace(/\s+/g, "_")}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      document.querySelectorAll(".skill-fill").forEach((fill) => {
        fill.classList.add("animated");
      });

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      alert("Gagal membuat PDF otomatis. Gunakan Cetak → Simpan sebagai PDF di browser.");
      window.print();
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initProfilePhoto();
  initContactLinks();
  initScrollAnimations();
  initSkillBars();
  initDownloadPdf();
});
