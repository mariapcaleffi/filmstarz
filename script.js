const $ = (id) => document.getElementById(id);


const state = {

  rating: 5,

  favorite: true,

  font: "Inter",

  blur: 18,

  dark: 45,

  posterURL: ""

};


/* =========================
   ATUALIZA ESTRELAS
========================= */

function updateRatingButtons() {

  document
    .querySelectorAll(".stars-input button")
    .forEach((button) => {

      button.classList.toggle(
        "active",
        Number(button.dataset.rating) <= state.rating
      );

    });

}


/* =========================
   ATUALIZA PREVIEW
========================= */

function updatePreview() {

  const title =
    $("title").value.trim();

  const year =
    $("year").value.trim();

  const director =
    $("director").value.trim();

  const review =
    $("review").value.trim();


  $("storyTitle").textContent =
    title || "SEU FILME";


  $("storyYear").textContent =
    year || "2026";


  $("storyDirector").textContent =
    director || "SEU DIRETOR";


  $("storyReview").textContent =
    review || "Sua resenha aparece aqui.";


  $("reviewCount").textContent =
    $("review").value.length;


  $("ratingText").textContent =
    `${state.rating}/5`;


  $("storyRating").textContent =
    "★".repeat(state.rating) +
    "☆".repeat(5 - state.rating);


  $("storyTitle").style.fontFamily =
    `"${state.font}", sans-serif`;


  $("storyReview").style.fontFamily =
    `"${state.font}", sans-serif`;


  $("heartPreview").classList.toggle(
    "visible",
    state.favorite
  );


  $("heartToggle").classList.toggle(
    "active",
    state.favorite
  );


  $("heartToggle").setAttribute(
    "aria-pressed",
    String(state.favorite)
  );


  $("blurValue").textContent =
    state.blur;


  $("darkValue").textContent =
    state.dark;


  $("bgImage").style.filter =
    `blur(${state.blur}px)`;


  $("bgOverlay").style.background =
    `rgba(0,0,0,${state.dark / 100})`;

}


/* =========================
   ESTRELAS
========================= */

function setRating(rating) {

  state.rating = rating;

  updateRatingButtons();

  updatePreview();

}


document
  .querySelectorAll(".stars-input button")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        setRating(
          Number(button.dataset.rating)
        );

      }
    );

  });


/* =========================
   CORAÇÃO
========================= */

$("heartToggle").addEventListener(
  "click",
  () => {

    state.favorite =
      !state.favorite;

    updatePreview();

  }
);


/* =========================
   FONTE
========================= */

$("fontSelect").addEventListener(
  "change",
  (event) => {

    state.font =
      event.target.value;

    updatePreview();

  }
);


/* =========================
   BLUR
========================= */

$("blurRange").addEventListener(
  "input",
  (event) => {

    state.blur =
      Number(event.target.value);

    updatePreview();

  }
);


/* =========================
   ESCURECIMENTO
========================= */

$("darkRange").addEventListener(
  "input",
  (event) => {

    state.dark =
      Number(event.target.value);

    updatePreview();

  }
);


/* =========================
   CAMPOS
========================= */

[
  "title",
  "year",
  "director",
  "review"
].forEach((id) => {

  $(id).addEventListener(
    "input",
    updatePreview
  );

});


/* =========================
   UPLOAD
========================= */

function loadPoster(file) {

  if (
    !file ||
    !file.type.startsWith("image/")
  ) {

    showToast(
      "Escolha uma imagem válida."
    );

    return;

  }


  if (state.posterURL) {

    URL.revokeObjectURL(
      state.posterURL
    );

  }


  state.posterURL =
    URL.createObjectURL(file);


  $("posterImage").src =
    state.posterURL;


  $("bgImage").src =
    state.posterURL;


  $("posterImage").style.display =
    "block";


  $("bgImage").style.display =
    "block";


  $("posterPlaceholder").style.display =
    "none";


  $("fileName").textContent =
    file.name;


  updatePreview();

}


$("posterInput").addEventListener(
  "change",
  (event) => {

    loadPoster(
      event.target.files[0]
    );

  }
);


/* =========================
   DRAG AND DROP
========================= */

const uploadArea =
  $("uploadArea");


[
  "dragenter",
  "dragover"
].forEach((eventName) => {

  uploadArea.addEventListener(
    eventName,
    (event) => {

      event.preventDefault();

      uploadArea.classList.add(
        "dragover"
      );

    }
  );

});


[
  "dragleave",
  "drop"
].forEach((eventName) => {

  uploadArea.addEventListener(
    eventName,
    (event) => {

      event.preventDefault();

      uploadArea.classList.remove(
        "dragover"
      );

    }
  );

});


uploadArea.addEventListener(
  "drop",
  (event) => {

    const file =
      event.dataTransfer.files[0];

    loadPoster(file);

  }
);


/* =========================
   TOAST
========================= */

function showToast(message) {

  const toast =
    $("toast");


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    window.toastTimer
  );


  window.toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2500);

}


/* =========================
   DOWNLOAD
========================= */

/* =========================
   CRIAR FUNDO BORRADO
========================= */

function createBlurredBackground(imageSrc, blurAmount, darkAmount) {

  return new Promise((resolve, reject) => {

    const img = new Image();

    img.onload = () => {

      // Tamanho real do story
      const width = 1080;
      const height = 1920;

      /*
        Criamos um canvas menor primeiro.
        Isso ajuda a produzir um desfoque
        mais natural e compatível com exportação.
      */

      const smallWidth = 270;
      const smallHeight = 480;

      const smallCanvas =
        document.createElement("canvas");

      smallCanvas.width = smallWidth;
      smallCanvas.height = smallHeight;

      const smallCtx =
        smallCanvas.getContext("2d");

      /*
        Calcula o "cover", igual ao object-fit: cover
      */

      const imageRatio =
        img.width / img.height;

      const canvasRatio =
        smallWidth / smallHeight;

      let drawWidth;
      let drawHeight;
      let offsetX;
      let offsetY;

      if (imageRatio > canvasRatio) {

        drawHeight = smallHeight;
        drawWidth =
          drawHeight * imageRatio;

        offsetX =
          (smallWidth - drawWidth) / 2;

        offsetY = 0;

      } else {

        drawWidth = smallWidth;

        drawHeight =
          drawWidth / imageRatio;

        offsetX = 0;

        offsetY =
          (smallHeight - drawHeight) / 2;

      }

      /*
        Desenha a imagem em resolução reduzida.
        Quando ampliamos novamente, ela fica
        naturalmente borrada.
      */

      smallCtx.drawImage(
        img,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
      );


      /*
        Agora criamos o canvas final
      */

      const canvas =
        document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx =
        canvas.getContext("2d");

      ctx.imageSmoothingEnabled = true;

      ctx.imageSmoothingQuality = "high";


      /*
        Aplicamos blur adicional caso o navegador
        suporte Canvas Filter.
      */

      try {

        ctx.filter =
          `blur(${Math.max(blurAmount / 2, 1)}px)`;

      } catch (error) {

        console.log(
          "Canvas filter não disponível."
        );

      }


      /*
        Amplia a imagem borrada
      */

      ctx.drawImage(
        smallCanvas,
        0,
        0,
        width,
        height
      );


      /*
        Remove o filtro para não afetar
        o overlay escuro.
      */

      ctx.filter = "none";


      /*
        Escurecimento do fundo
      */

      if (darkAmount > 0) {

        ctx.fillStyle =
          `rgba(0,0,0,${darkAmount / 100})`;

        ctx.fillRect(
          0,
          0,
          width,
          height
        );

      }


      resolve(
        canvas.toDataURL(
          "image/jpeg",
          0.95
        )
      );

    };


    img.onerror = () => {

      reject(
        new Error(
          "Não foi possível carregar o poster."
        )
      );

    };


    img.src = imageSrc;

  });

}



/* =========================
   DOWNLOAD DO STORY
========================= */

$("downloadBtn").addEventListener(
  "click",
  async () => {

    if (
      typeof html2canvas ===
      "undefined"
    ) {

      showToast(
        "Não foi possível carregar o gerador de imagem."
      );

      return;

    }


    if (!state.posterURL) {

      showToast(
        "Envie um poster antes de baixar."
      );

      return;

    }


    const button =
      $("downloadBtn");


    const original =
      button.innerHTML;


    try {

      button.disabled = true;


      button.innerHTML =
        "<span>…</span> Gerando Story";


      /*
        ========================================
        1. GUARDAR A IMAGEM ORIGINAL
        ========================================
      */

      const originalBg =
        $("bgImage").src;

      const originalFilter =
        $("bgImage").style.filter;


      /*
        ========================================
        2. CRIAR A VERSÃO BORRADA
        ========================================
      */

      const blurredBackground =
        await createBlurredBackground(
          originalBg,
          state.blur,
          state.dark
        );


      /*
        ========================================
        3. COLOCAR A IMAGEM BORRADA NO STORY
        ========================================
      */

      $("bgImage").src =
        blurredBackground;


      /*
        IMPORTANTE:
        removemos o blur CSS porque agora
        a própria imagem já está borrada.
      */

      $("bgImage").style.filter =
        "none";


      /*
        Como o escurecimento também já foi
        aplicado na imagem, removemos o
        overlay temporariamente.
      */

      const originalOverlay =
        $("bgOverlay").style.background;


      $("bgOverlay").style.background =
        "rgba(0,0,0,0)";


      /*
        Pequena espera para o navegador
        atualizar a imagem antes da captura.
      */

      await new Promise(
        resolve =>
          setTimeout(resolve, 150)
      );


      /*
        ========================================
        4. CAPTURAR STORY
        ========================================
      */

      const canvas =
        await html2canvas(
          $("story"),
          {

            width: 337.5,

            height: 600,

            scale: 1080 / 337.5,

            useCORS: true,

            allowTaint: false,

            backgroundColor:
              "#081022",

            logging: false,

            imageTimeout: 15000

          }
        );


      /*
        ========================================
        5. RESTAURAR O PREVIEW
        ========================================
      */

      $("bgImage").src =
        originalBg;


      $("bgImage").style.filter =
        originalFilter ||
        `blur(${state.blur}px)`;


      $("bgOverlay").style.background =
        originalOverlay ||
        `rgba(0,0,0,${state.dark / 100})`;


      /*
        ========================================
        6. DOWNLOAD
        ========================================
      */

      const cleanTitle =
        (
          $("title")
            .value
            .trim() ||
          "meu-filme"
        )
          .toLowerCase()
          .replace(
            /[^a-z0-9À-ÿ]+/gi,
            "-"
          )
          .replace(
            /^-|-$/g,
            "");


      const link =
        document.createElement("a");


      link.download =
        `filmstarz-${cleanTitle || "story"}.png`;


      link.href =
        canvas.toDataURL(
          "image/png"
        );


      document.body.appendChild(
        link
      );


      link.click();


      document.body.removeChild(
        link
      );


      showToast(
        "Story baixado com sucesso! ✨"
      );


    } catch (error) {

      console.error(error);


      /*
        Caso dê algum erro, tentamos
        restaurar o preview.
      */

      $("bgImage").style.filter =
        `blur(${state.blur}px)`;


      $("bgOverlay").style.background =
        `rgba(0,0,0,${state.dark / 100})`;


      showToast(
        "Não foi possível gerar o Story."
      );


    } finally {

      button.disabled =
        false;


      button.innerHTML =
        original;

    }

  }
);


/* =========================
   RESET
========================= */

$("resetBtn").addEventListener(
  "click",
  () => {

    $("title").value =
      "";

    $("year").value =
      "";

    $("director").value =
      "";

    $("review").value =
      "";

    $("posterInput").value =
      "";

    $("fileName").textContent =
      "";


    if (state.posterURL) {

      URL.revokeObjectURL(
        state.posterURL
      );

      state.posterURL =
        "";

    }


    $("posterImage").src =
      "";

    $("bgImage").src =
      "";


    $("posterImage").style.display =
      "none";

    $("bgImage").style.display =
      "none";


    $("posterPlaceholder").style.display =
      "flex";


    state.rating =
      5;

    state.favorite =
      true;

    state.font =
      "Inter";

    state.blur =
      18;

    state.dark =
      45;


    $("fontSelect").value =
      "Inter";

    $("blurRange").value =
      18;

    $("darkRange").value =
      45;


    updateRatingButtons();

    updatePreview();


    showToast(
      "Tudo limpo!"
    );

  }
);


updateRatingButtons();

updatePreview();