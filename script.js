/* =========================================================
   FILMSTARZ
   Gerador de Stories
   Exportação real em Canvas 1080 x 1920
   Compatível com PC + celular
========================================================= */


/* =========================================================
   FUNÇÃO AUXILIAR
========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   ESTADO
========================================================= */

const state = {

    rating: 5,

    favorite: true,

    font: "Inter",

    blur: 18,

    dark: 45,

    posterURL: ""

};


/* =========================================================
   ATUALIZAR ESTRELAS DO FORMULÁRIO
========================================================= */

function updateRatingButtons() {

    document
        .querySelectorAll(".stars-input button")
        .forEach((button) => {

            const value =
                Number(button.dataset.rating);

            button.classList.toggle(
                "active",
                value <= state.rating
            );

        });

}


/* =========================================================
   ATUALIZAR PREVIEW
========================================================= */

function updatePreview() {

    const title =
        $("title").value.trim();

    const year =
        $("year").value.trim();

    const director =
        $("director").value.trim();

    const review =
        $("review").value.trim();


    /* -----------------------------------------
       TÍTULO
    ----------------------------------------- */

    $("storyTitle").textContent =
        title || "SEU FILME";


    /* -----------------------------------------
       ANO
    ----------------------------------------- */

    $("storyYear").textContent =
        year || "2026";


    /* -----------------------------------------
       DIRETOR
    ----------------------------------------- */

    $("storyDirector").textContent =
        director || "SEU DIRETOR";


    /* -----------------------------------------
       RESENHA
    ----------------------------------------- */

    $("storyReview").textContent =
        review ||
        "Sua resenha aparece aqui.";


    /* -----------------------------------------
       CONTADOR
    ----------------------------------------- */

    $("reviewCount").textContent =
        $("review").value.length;


    /* -----------------------------------------
       NOTA
    ----------------------------------------- */

    $("ratingText").textContent =
        `${state.rating}/5`;


    $("storyRating").textContent =
        "★".repeat(state.rating) +
        "☆".repeat(5 - state.rating);


    /* -----------------------------------------
       FONTE
    ----------------------------------------- */

    $("storyTitle").style.fontFamily =
        `"${state.font}", sans-serif`;


    $("storyReview").style.fontFamily =
        `"${state.font}", sans-serif`;


    /* -----------------------------------------
       CORAÇÃO
    ----------------------------------------- */

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


    /* -----------------------------------------
       VALORES DOS CONTROLES
    ----------------------------------------- */

    $("blurValue").textContent =
        state.blur;


    $("darkValue").textContent =
        state.dark;


    /* -----------------------------------------
       BLUR DO PREVIEW
    ----------------------------------------- */

    $("bgImage").style.filter =
        `blur(${state.blur}px)`;


    /* -----------------------------------------
       ESCURECIMENTO
    ----------------------------------------- */

    $("bgOverlay").style.background =
        `rgba(0,0,0,${state.dark / 100})`;

}


/* =========================================================
   ESTRELAS
========================================================= */

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


/* =========================================================
   CORAÇÃO
========================================================= */

$("heartToggle").addEventListener(
    "click",
    () => {

        state.favorite =
            !state.favorite;

        updatePreview();

    }
);


/* =========================================================
   FONTE
========================================================= */

$("fontSelect").addEventListener(
    "change",
    (event) => {

        state.font =
            event.target.value;

        updatePreview();

    }
);


/* =========================================================
   BLUR
========================================================= */

$("blurRange").addEventListener(
    "input",
    (event) => {

        state.blur =
            Number(event.target.value);

        updatePreview();

    }
);


/* =========================================================
   ESCURECIMENTO
========================================================= */

$("darkRange").addEventListener(
    "input",
    (event) => {

        state.dark =
            Number(event.target.value);

        updatePreview();

    }
);


/* =========================================================
   CAMPOS DE TEXTO
========================================================= */

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


/* =========================================================
   CARREGAR POSTER
========================================================= */

function loadPoster(file) {

    if (!file) {
        return;
    }


    if (
        !file.type.startsWith("image/")
    ) {

        showToast(
            "Escolha uma imagem válida."
        );

        return;

    }


    /*
       Limite de 20 MB
    */

    if (
        file.size > 20 * 1024 * 1024
    ) {

        showToast(
            "A imagem deve ter no máximo 20 MB."
        );

        return;

    }


    /*
       Liberar URL anterior
    */

    if (state.posterURL) {

        URL.revokeObjectURL(
            state.posterURL
        );

    }


    /*
       Criar nova URL
    */

    state.posterURL =
        URL.createObjectURL(file);


    /*
       Preview principal
    */

    $("posterImage").src =
        state.posterURL;


    $("bgImage").src =
        state.posterURL;


    /*
       Mostrar imagens
    */

    $("posterImage").style.display =
        "block";


    $("bgImage").style.display =
        "block";


    /*
       Esconder placeholder
    */

    $("posterPlaceholder").style.display =
        "none";


    /*
       Mostrar nome
    */

    $("fileName").textContent =
        file.name;


    updatePreview();

}


/* =========================================================
   INPUT DO POSTER
========================================================= */

$("posterInput").addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];

        loadPoster(file);

    }
);


/* =========================================================
   DRAG AND DROP
========================================================= */

const uploadArea =
    $("uploadArea");


[
    "dragenter",
    "dragover"
].forEach(
    (eventName) => {

        uploadArea.addEventListener(
            eventName,
            (event) => {

                event.preventDefault();

                uploadArea.classList.add(
                    "dragover"
                );

            }
        );

    }
);


[
    "dragleave",
    "drop"
].forEach(
    (eventName) => {

        uploadArea.addEventListener(
            eventName,
            (event) => {

                event.preventDefault();

                uploadArea.classList.remove(
                    "dragover"
                );

            }
        );

    }
);


uploadArea.addEventListener(
    "drop",
    (event) => {

        const file =
            event.dataTransfer.files[0];

        loadPoster(file);

    }
);


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        $("toast");


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.filmstarzToast
    );


    window.filmstarzToast =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =========================================================
   CARREGAR IMAGEM PARA CANVAS
========================================================= */

function loadImageForCanvas(src) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();


            img.onload =
                () => resolve(img);


            img.onerror =
                () => reject(
                    new Error(
                        "Erro ao carregar a imagem."
                    )
                );


            img.src =
                src;

        }
    );

}


/* =========================================================
   DESENHAR IMAGEM COMO COVER
========================================================= */

function drawCover(
    ctx,
    img,
    x,
    y,
    width,
    height
) {

    const imageRatio =
        img.width / img.height;


    const areaRatio =
        width / height;


    let drawWidth;

    let drawHeight;

    let drawX;

    let drawY;


    if (
        imageRatio > areaRatio
    ) {

        /*
           Imagem mais horizontal.
        */

        drawHeight =
            height;

        drawWidth =
            height * imageRatio;

        drawX =
            x +
            (width - drawWidth) / 2;

        drawY =
            y;

    } else {

        /*
           Imagem mais vertical.
        */

        drawWidth =
            width;

        drawHeight =
            width / imageRatio;

        drawX =
            x;

        drawY =
            y +
            (height - drawHeight) / 2;

    }


    ctx.drawImage(
        img,
        drawX,
        drawY,
        drawWidth,
        drawHeight
    );

}


/* =========================================================
   CRIAR FUNDO BORRADO
========================================================= */

function drawBlurredBackground(
    ctx,
    img,
    blur,
    dark
) {

    /*
       Canvas auxiliar.

       Usamos resolução menor para criar
       um desfoque mais confiável no celular.
    */

    const smallCanvas =
        document.createElement(
            "canvas"
        );


    const smallWidth =
        270;


    const smallHeight =
        480;


    smallCanvas.width =
        smallWidth;


    smallCanvas.height =
        smallHeight;


    const smallCtx =
        smallCanvas.getContext(
            "2d"
        );


    /*
       Aumentamos a área para evitar
       bordas quando o blur é aplicado.
    */

    smallCtx.save();


    try {

        smallCtx.filter =
            `blur(${Math.max(blur / 2, 2)}px)`;

    } catch (error) {

        /*
           Caso filter não exista,
           a redução de resolução
           continuará criando desfoque.
        */

    }


    drawCover(
        smallCtx,
        img,
        -35,
        -35,
        smallWidth + 70,
        smallHeight + 70
    );


    smallCtx.restore();


    /*
       Agora ampliamos para
       1080 × 1920.
    */

    ctx.imageSmoothingEnabled =
        true;


    ctx.imageSmoothingQuality =
        "high";


    ctx.drawImage(
        smallCanvas,
        0,
        0,
        1080,
        1920
    );


    /*
       Escurecimento.
    */

    if (dark > 0) {

        ctx.fillStyle =
            `rgba(0,0,0,${dark / 100})`;


        ctx.fillRect(
            0,
            0,
            1080,
            1920
        );

    }

}


/* =========================================================
   DESENHAR POSTER CENTRAL
========================================================= */

function drawPoster(
    ctx,
    img
) {

    /*
       Mesma proporção visual do preview.

       Preview:
       180 × 255

       Canvas:
       540 × 765
    */

    const posterWidth =
        540;


    const posterHeight =
        765;


    const x =
        (1080 - posterWidth) / 2;


    const y =
        250;


    /*
       Sombra.
    */

    ctx.save();


    ctx.shadowColor =
        "rgba(0,0,0,.75)";


    ctx.shadowBlur =
        45;


    ctx.shadowOffsetX =
        0;


    ctx.shadowOffsetY =
        20;


    ctx.fillStyle =
        "#050505";


    ctx.fillRect(
        x - 10,
        y - 10,
        posterWidth + 20,
        posterHeight + 20
    );


    ctx.restore();


    /*
       Recortar exatamente
       a área do poster.
    */

    ctx.save();


    ctx.beginPath();


    ctx.rect(
        x,
        y,
        posterWidth,
        posterHeight
    );


    ctx.clip();


    drawCover(
        ctx,
        img,
        x,
        y,
        posterWidth,
        posterHeight
    );


    ctx.restore();

}


/* =========================================================
   DESENHAR TEXTO CENTRALIZADO
========================================================= */

function drawCenteredText(
    ctx,
    text,
    x,
    y
) {

    ctx.textAlign =
        "center";


    ctx.fillText(
        text,
        x,
        y
    );

}


/* =========================================================
   QUEBRAR TEXTO
========================================================= */

function wrapText(
    ctx,
    text,
    maxWidth
) {

    const words =
        text.split(/\s+/);


    const lines = [];


    let line =
        "";


    for (
        const word of words
    ) {

        const test =
            line
                ? `${line} ${word}`
                : word;


        const width =
            ctx.measureText(
                test
            ).width;


        if (
            width > maxWidth &&
            line
        ) {

            lines.push(
                line
            );


            line =
                word;

        } else {

            line =
                test;

        }

    }


    if (line) {

        lines.push(
            line
        );

    }


    return lines;

}


/* =========================================================
   DESENHAR "FILME DA VEZ"
========================================================= */

function drawMovieLabel(
    ctx
) {

    ctx.save();


    /*
       Borda.
    */

    ctx.strokeStyle =
        "rgba(255,255,255,.45)";


    ctx.lineWidth =
        2;


    ctx.beginPath();


    ctx.roundRect(
        80,
        105,
        305,
        75,
        38
    );


    ctx.stroke();


    /*
       Texto.
    */

    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "700 22px Inter, Arial, sans-serif";


    ctx.textAlign =
        "left";


    ctx.fillText(
        "FILME DA VEZ",
        112,
        151
    );


    ctx.restore();

}


/* =========================================================
   DESENHAR CORAÇÃO
========================================================= */

function drawHeart(
    ctx
) {

    if (!state.favorite) {

        return;

    }


    ctx.save();


    ctx.font =
        "55px Arial";


    ctx.fillStyle =
        "#ff78b7";


    ctx.textAlign =
        "right";


    ctx.shadowColor =
        "rgba(255,120,183,.45)";


    ctx.shadowBlur =
        15;


    ctx.fillText(
        "♥",
        1000,
        160
    );


    ctx.restore();

}


/* =========================================================
   TAMANHO DO TÍTULO
========================================================= */

function getTitleSize(
    title
) {

    if (
        title.length > 30
    ) {

        return 48;

    }


    if (
        title.length > 24
    ) {

        return 54;

    }


    if (
        title.length > 18
    ) {

        return 62;

    }


    return 76;

}


/* =========================================================
   DESENHAR TÍTULO
========================================================= */

function drawTitle(
    ctx,
    title
) {

    const size =
        getTitleSize(title);


    ctx.save();


    ctx.font =
        `800 ${size}px "${state.font}", Arial, sans-serif`;


    ctx.fillStyle =
        "#ffffff";


    ctx.textAlign =
        "center";


    ctx.shadowColor =
        "rgba(0,0,0,.75)";


    ctx.shadowBlur =
        14;


    /*
       Se for muito comprido,
       quebrar em duas linhas.
    */

    const lines =
        wrapText(
            ctx,
            title.toUpperCase(),
            850
        );


    if (
        lines.length === 1
    ) {

        drawCenteredText(
            ctx,
            lines[0],
            540,
            1435
        );

    } else {

        const lineHeight =
            size * .95;


        const firstY =
            1435 -
            ((lines.length - 1) *
                lineHeight / 2);


        lines
            .slice(0, 2)
            .forEach(
                (line, index) => {

                    drawCenteredText(
                        ctx,
                        line,
                        540,
                        firstY +
                        index *
                        lineHeight
                    );

                }
            );

    }


    ctx.restore();

}


/* =========================================================
   DESENHAR METADADOS
========================================================= */

function drawMetadata(
    ctx,
    year,
    director
) {

    ctx.save();


    ctx.font =
        "400 27px Inter, Arial, sans-serif";


    ctx.fillStyle =
        "#e1e1e8";


    ctx.textAlign =
        "center";


    const meta =
        `${year}  •  ${director.toUpperCase()}`;


    drawCenteredText(
        ctx,
        meta,
        540,
        1500
    );


    ctx.restore();

}


/* =========================================================
   DESENHAR ESTRELAS
========================================================= */

function drawRating(
    ctx
) {

    ctx.save();


    ctx.font =
        "55px Arial";


    ctx.fillStyle =
        "#ff78b7";


    ctx.textAlign =
        "center";


    const stars =
        "★".repeat(
            state.rating
        ) +
        "☆".repeat(
            5 - state.rating
        );


    ctx.shadowColor =
        "rgba(255,120,183,.35)";


    ctx.shadowBlur =
        12;


    drawCenteredText(
        ctx,
        stars,
        540,
        1585
    );


    ctx.restore();

}


/* =========================================================
   DESENHAR RESENHA
========================================================= */

function drawReview(
    ctx,
    review
) {

    if (!review) {

        return;

    }


    ctx.save();


    ctx.font =
        `400 27px "${state.font}", Arial, sans-serif`;


    ctx.fillStyle =
        "#ffffff";


    ctx.textAlign =
        "center";


    const lines =
        wrapText(
            ctx,
            review,
            700
        );


    /*
       Limitar a quantidade de linhas
       para não invadir o rodapé.
    */

    const visibleLines =
        lines.slice(0, 3);


    const lineHeight =
        38;


    const startY =
        1665 -
        ((visibleLines.length - 1) *
            lineHeight / 2);


    visibleLines.forEach(
        (line, index) => {

            drawCenteredText(
                ctx,
                line,
                540,
                startY +
                index *
                lineHeight
            );

        }
    );


    ctx.restore();

}


/* =========================================================
   DESENHAR FOOTER
========================================================= */

function drawFooter(
    ctx
) {

    ctx.save();


    ctx.textAlign =
        "center";


    ctx.font =
        "500 18px 'DM Mono', monospace";


    ctx.fillStyle =
        "rgba(255,255,255,.60)";


    ctx.fillText(
        "filmstarz",
        515,
        1825
    );


    ctx.font =
        "22px Arial";


    ctx.fillStyle =
        "#ff78b7";


    ctx.fillText(
        "✦",
        625,
        1825
    );


    ctx.restore();

}


/* =========================================================
   GERAR STORY
========================================================= */

async function generateStory() {

    if (!state.posterURL) {

        throw new Error(
            "Nenhum poster foi enviado."
        );

    }


    /*
       Esperar as fontes carregarem.

       Isso evita que o Canvas use
       uma fonte diferente no celular.
    */

    if (
        document.fonts &&
        document.fonts.ready
    ) {

        await document.fonts.ready;

    }


    /*
       Canvas final.
    */

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        1080;


    canvas.height =
        1920;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.imageSmoothingEnabled =
        true;


    ctx.imageSmoothingQuality =
        "high";


    /*
       Carregar poster.
    */

    const poster =
        await loadImageForCanvas(
            state.posterURL
        );


    /*
       =====================================
       1 — FUNDO
       =====================================
    */

    drawBlurredBackground(
        ctx,
        poster,
        state.blur,
        state.dark
    );


    /*
       =====================================
       2 — POSTER CENTRAL
       =====================================
    */

    drawPoster(
        ctx,
        poster
    );


    /*
       =====================================
       3 — FILME DA VEZ
       =====================================
    */

    drawMovieLabel(
        ctx
    );


    /*
       =====================================
       4 — CORAÇÃO
       =====================================
    */

    drawHeart(
        ctx
    );


    /*
       =====================================
       5 — INFORMAÇÕES
       =====================================
    */

    const title =
        $("title")
            .value
            .trim() ||
        "SEU FILME";


    const year =
        $("year")
            .value
            .trim() ||
        "2026";


    const director =
        $("director")
            .value
            .trim() ||
        "SEU DIRETOR";


    const review =
        $("review")
            .value
            .trim();


    drawTitle(
        ctx,
        title
    );


    drawMetadata(
        ctx,
        year,
        director
    );


    drawRating(
        ctx
    );


    drawReview(
        ctx,
        review
    );


    /*
       =====================================
       6 — FOOTER
       =====================================
    */

    drawFooter(
        ctx
    );


    return canvas;

}


/* =========================================================
   GERAR NOME DO ARQUIVO
========================================================= */

function createFilename() {

    const title =
        $("title")
            .value
            .trim() ||
        "meu-filme";


    let clean =
        title
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );


    if (!clean) {

        clean =
            "story";

    }


    return `filmstarz-${clean}.png`;

}


/* =========================================================
   BAIXAR ARQUIVO
========================================================= */

function downloadBlob(
    blob,
    filename
) {

    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        filename;


    link.style.display =
        "none";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    /*
       Liberar memória.
    */

    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        5000
    );

}


/* =========================================================
   COMPARTILHAR NO CELULAR
========================================================= */

async function tryNativeShare(
    blob,
    filename
) {

    if (
        !navigator.share ||
        !navigator.canShare
    ) {

        return false;

    }


    try {

        const file =
            new File(
                [blob],
                filename,
                {
                    type:
                        "image/png"
                }
            );


        const shareData = {
            files: [file],

            title:
                "Meu Story — filmstarz"
        };


        if (
            !navigator.canShare(
                shareData
            )
        ) {

            return false;

        }


        await navigator.share(
            shareData
        );


        return true;

    } catch (error) {

        /*
           O usuário pode ter fechado
           a janela de compartilhamento.
        */

        if (
            error.name ===
            "AbortError"
        ) {

            return true;

        }


        return false;

    }

}


/* =========================================================
   BOTÃO DOWNLOAD
========================================================= */

$("downloadBtn").addEventListener(
    "click",
    async () => {

        if (!state.posterURL) {

            showToast(
                "Envie um poster antes de baixar."
            );

            return;

        }


        const button =
            $("downloadBtn");


        const originalHTML =
            button.innerHTML;


        try {

            button.disabled =
                true;


            button.innerHTML =
                "<span>…</span> Gerando Story";


            /*
               Gerar Canvas.
            */

            const canvas =
                await generateStory();


            /*
               Transformar em PNG.
            */

            const blob =
                await new Promise(
                    (resolve) => {

                        canvas.toBlob(
                            resolve,
                            "image/png"
                        );

                    }
                );


            if (!blob) {

                throw new Error(
                    "Não foi possível gerar o PNG."
                );

            }


            const filename =
                createFilename();


            /*
               =====================================
               CELULAR
               =====================================
            */

            const shared =
                await tryNativeShare(
                    blob,
                    filename
                );


            if (shared) {

                showToast(
                    "Story pronto! ✨"
                );

                return;

            }


            /*
               =====================================
               PC / DOWNLOAD NORMAL
               =====================================
            */

            downloadBlob(
                blob,
                filename
            );


            showToast(
                "Story baixado com sucesso! ✨"
            );

        } catch (error) {

            console.error(
                "Filmstarz:",
                error
            );


            showToast(
                "Não foi possível gerar o Story."
            );

        } finally {

            button.disabled =
                false;


            button.innerHTML =
                originalHTML;

        }

    }
);


/* =========================================================
   RESET
========================================================= */

$("resetBtn").addEventListener(
    "click",
    () => {

        /*
           Limpar formulário.
        */

        $("title").value =
            "";

        $("year").value =
            "";

        $("director").value =
            "";

        $("review").value =
            "";


        /*
           Resetar poster.
        */

        if (state.posterURL) {

            URL.revokeObjectURL(
                state.posterURL
            );

        }


        state.posterURL =
            "";


        $("posterInput").value =
            "";


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


        $("fileName").textContent =
            "";


        /*
           Resetar controles.
        */

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
            "Tudo limpo! 🎬"
        );

    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

updateRatingButtons();

updatePreview();


/* =========================================================
   IMPEDIR ARRASTAR IMAGENS
========================================================= */

document
    .querySelectorAll("img")
    .forEach(
        (image) => {

            image.draggable =
                false;

        }
    );