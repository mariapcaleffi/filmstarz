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


    const button =
      $("downloadBtn");


    const original =
      button.innerHTML;


    try {

      button.disabled =
        true;


      button.innerHTML =
        "<span>…</span> Gerando Story";


      const canvas =
        await html2canvas(
          $("story"),
          {

            scale:
              1080 /
              $("story")
                .getBoundingClientRect()
                .width,

            useCORS: true,

            backgroundColor:
              "#081522",

            logging: false

          }
        );


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
        document.createElement(
          "a"
        );


      link.download =
        `filmstarz-${cleanTitle || "story"}.png`;


      link.href =
        canvas.toDataURL(
          "image/png",
          1
        );


      link.click();


      showToast(
        "Story baixado com sucesso!"
      );


    } catch (error) {

      console.error(error);

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