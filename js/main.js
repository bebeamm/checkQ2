const scriptURL = "https://script.google.com/macros/s/AKfycbzsN1Sw0bPLO5rL_ETF_j-x5h2aXAeasMLJJCv_6lvlKVOFYve0GiP7Wu5pdWIDc-tP-A/exec";

function checkStatus() {
  const id = document.getElementById("queueInput").value.trim();
  const resultBox = document.getElementById("result");
  const resultText = document.getElementById("resultText");

  // ซ่อน falling stars (ถ้ามี)
  const stars = document.querySelectorAll('.falling-stars');
  stars.forEach(star => {
    star.style.opacity = "0";
  });

  if (!id) {
    resultText.innerHTML = "<p style='color:red;'>กรุณากรอกรหัสคิว</p>";
    return;
  }

  fetch(`${scriptURL}?id=${encodeURIComponent(id)}`)
    .then(res => res.json())
    .then(data => {
      if (data.found) {
        resultText.innerHTML = `
          <p><strong>รหัสคิว:</strong> ${data.result.queueID}</p>
          <p><strong>สถานะงาน:</strong> ${data.result.status}</p>
        `;
        burstStars(); // 💥 ดาวกระจาย!
      } else {
        resultText.innerHTML = "<p style='color:red;'>ไม่พบคิวนี้ในระบบ</p>";
      }

      // แสดง falling stars ถ้ามี
      stars.forEach(star => {
        star.style.opacity = "1";
        star.style.animation = "fall 2s ease-in-out";
      });

      document.getElementById("pendingBubble").textContent = data.pendingCount;
    })
    .catch(err => {
      resultText.innerHTML = "<p style='color:red;'>เกิดข้อผิดพลาดในการดึงข้อมูล</p>";
      console.error(err);
    });
}

function burstStars() {
  const container = document.getElementById("burst-stars");
  for (let i = 0; i < 30; i++) {
    const star = document.createElement("div");
    star.classList.add("burst-star");
    star.textContent = "⭐";


    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 400 + 300;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    star.style.setProperty("--x", `${x}px`);
    star.style.setProperty("--y", `${y}px`);

    container.appendChild(star);
    setTimeout(() => {
      star.remove();
    }, 1200);
  }
}

// โหลดค่าคิวที่ยังไม่เสร็จตอนเปิดเว็บ
window.onload = () => {
  fetch(`${scriptURL}?id=`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("pendingBubble").textContent = data.pendingCount;
    });
};
