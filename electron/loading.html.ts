import { BrowserWindow } from "electron";

export const loadingPage = `<!DOCTYPE html>
<html>

<head>
  <style>
    * {
      padding: 0;
      margin: 0;
    }

    html,
    body {
      height: 100vh;
      width: 100vw;
      background: #0a0a0a;
      color: #FFF;
      font-size: 2rem;
    }

    @keyframes bounce {
      0% {
        transform: translateY(0);
      }

      25% {
        transform: translateY(-10px);
      }

      50% {
        transform: translateY(0px);
      }
    }

    div {
      display: flex;
      min-height: 100%;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    span:nth-child(1) {
      animation: bounce 3s infinite normal;
    }

    span:nth-child(2) {
      animation: bounce 3s infinite normal;
      animation-delay: 1s;
    }

    span:nth-child(3) {
      animation: bounce 3s infinite normal;
      animation-delay: 2s;
    }
  </style>
  <title>Loading app</title>
</head>

<body>
  <div>
    Loading <span>.</span><span>.</span><span>.</span>
  </div>
</body>

</html>`;



export const showLoadingPage = async (win: BrowserWindow) => {
  const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(loadingPage)}`;
  await win.loadURL(dataUrl);
  win.show();
}
