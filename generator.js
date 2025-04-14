
const form = document.getElementById("inputForm");
const canvas = document.getElementById("outputCanvas");
const ctx = canvas.getContext("2d");

const defaultBg = "https://i.imgur.com/0u5vmUv.jpg";
const defaultFrog = "https://i.imgur.com/FI8SwPb.png";
const defaultLogo = "https://i.imgur.com/4WArpdW.png";

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.src = src;
  });

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gain = parseFloat(document.getElementById("gain").value).toFixed(2);
  const wallet = document.getElementById("walletAddress").value || "9fZpJ...m4P";
  const tokenAddress = document.getElementById("tokenAddress").value.trim();
  const avatarFile = document.getElementById("avatarUpload").files[0];

  let tokenName = "Unknown";
  let tokenLogo = defaultLogo;
  try {
    const res = await fetch("https://cache.jup.ag/tokens");
    const data = await res.json();
    const token = data.find((t) => t.address === tokenAddress);
    if (token) {
      tokenName = token.name;
      tokenLogo = token.logoURI || defaultLogo;
    }
  } catch (err) {
    console.warn("Token fetch error:", err);
  }

  const bgImg = await loadImage(defaultBg);
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#73ff9d";
  ctx.font = "bold 100px Arial";
  ctx.fillText(`+${gain}%`, 50, 200);

  ctx.font = "bold 40px Arial";
  ctx.fillText(`75.8 SOL ($11K)`, 50, 260);

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText(`Hold: $9698.93`, 50, 320);
  ctx.fillText(`Sold: $5735.90`, 50, 360);
  ctx.fillText(`Bought: $4427.02`, 50, 400);

  ctx.font = "30px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(`${tokenName} PNL`, 150, 70);

  const logoImg = await loadImage(tokenLogo);
  ctx.beginPath();
  ctx.arc(100, 50, 30, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.drawImage(logoImg, 70, 20, 60, 60);
  ctx.restore();

  let avatarSrc = defaultFrog;
  if (avatarFile) {
    avatarSrc = URL.createObjectURL(avatarFile);
  }
  const avatar = await loadImage(avatarSrc);
  ctx.beginPath();
  ctx.arc(1000, 600, 30, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.drawImage(avatar, 970, 570, 60, 60);
  ctx.restore();

  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText(wallet, 1040, 610);

  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  const baseX = 400, baseY = 500;
  ctx.moveTo(baseX, baseY);
  for (let i = 1; i <= 10; i++) {
    const dx = baseX + i * 60;
    const dy = baseY - Math.sin(i / 2) * 50 - i * 10;
    ctx.lineTo(dx, dy);
  }
  ctx.stroke();

  ctx.fillStyle = "#4caf50";
  ctx.font = "bold 16px Arial";
  ctx.fillText("B", 450, 470);
  ctx.fillText("B", 720, 390);
  ctx.fillStyle = "#f44336";
  ctx.fillText("S", 540, 450);
});

function downloadImage() {
  const link = document.createElement("a");
  link.download = "gmgn_pnl.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}
