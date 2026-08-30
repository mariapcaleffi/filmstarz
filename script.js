/* =====================================================
   FILMSTARZ
   Gerador de Stories de Filmes
   Canvas 1080 x 1920
===================================================== */


/* =====================================================
   PEGAR ELEMENTOS
===================================================== */

const $ = (id) => document.getElementById(id);


/* =====================================================
   ESTADO DO APLICATIVO
===================================================== */

const state = {

    posterURL: "",

    rating: 0,

    favorite: false,

    blur: 12,

    dark: 35,

    font: "Inter"

};


/* =====================================================
   ELEMENTOS
===================================================== */

const titleInput =
    $("title");

const yearInput =
    $("year");

const directorInput =
    $("director");

const reviewInput =
    $("review");

const posterInput =
    $("posterInput");

const uploadBox =
    $("uploadBox");

const uploadPreview =
    $("uploadPreview");

const storyPoster =
    $("storyPoster");

const bgImage =
    $("bgImage");

const storyTitle =
    $("storyTitle");

const storyYear =
    $("storyYear");

const storyDirector =
    $("storyDirector");

const storyReview =
    $("storyReview");

const storyStars =
    $("storyStars");

const storyHeart =
    $("storyHeart");

const favoriteButton =
    $("favoriteButton");

const fontSelect =
    $("fontSelect");

const blurRange =
    $("blurRange");

const darkRange =
    $("darkRange");

const blurValue =
    $("blurValue");

const darkValue =
    $("darkValue");

const characterCount =
    $("characterCount");

const downloadBtn =
    $("downloadBtn");

const toast =
    $("toast");


/* =====================================================
   ATUALIZAR PREVIEW
===================================================== */

function updatePreview() {

    const title =
        titleInput.value.trim();

    const year =
        yearInput.value.trim();

    const director =
        directorInput.value.trim();

    const review =
        reviewInput.value.trim();


    /*
        Título
    */

    storyTitle.textContent =
        title
            ? title.toUpperCase()
            : "SEU FILME";


    /*
        Ano
    */

    storyYear.textContent =
        year || "2026";


    /*
        Diretor
    */

    storyDirector.textContent =
        director
            ? director.toUpperCase()
            : "SEU DIRETOR";


    /*
        Resenha
    */

    storyReview.textContent =
        review ||
        "sua resenha aparecerá aqui";


    /*
        Estrelas
    */

    storyStars.textContent =
        "★".repeat(state.rating) +
        "☆".repeat(5 - state.rating);


    /*
        Coração
    */

    storyHeart.style.display =
        state.favorite
            ? "block"
            : "none";


    /*
        Fonte
    */

    storyTitle.style.fontFamily =
        `"${state.font}", sans-serif`;

    storyReview.style.fontFamily =
        `"${state.font}", sans-serif`;


    /*
        Blur
    */

    bgImage.style.filter =
        `blur(${state.blur}px)`;


    /*
        Escurecimento
    */

    bgImage.style.opacity =
        "1";

    document
        .getElementById("bgOverlay")
        .style.background =
        `rgba(0,0,0,${state.dark / 100})`;

}


/* =====================================================
   INPUTS DE TEXTO
===================================================== */

titleInput.addEventListener(
    "input",
    updatePreview
);


yearInput.addEventListener(
    "input",
    updatePreview
);


directorInput.addEventListener(
    "input",
    updatePreview
);


reviewInput.addEventListener(
    "input",
    () => {

        characterCount.textContent =
            reviewInput.value.length;

        updatePreview();

    }
);


/* =====================================================
   UPLOAD DO POSTER
===================================================== */

posterInput.addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        /*
            Verificar tipo
        */

        if (
            !file.type.startsWith("image/")
        ) {

            showToast(
                "Escolha uma imagem válida."
            );

            return;

        }


        /*
            Limitar tamanho
        */

        if (
            file.size > 15 * 1024 * 1024
        ) {

            showToast(
                "A imagem deve ter no máximo 15 MB."
            );

            return;

        }


        /*
            Remover URL anterior
        */

        if (state.posterURL) {

            URL.revokeObjectURL(
                state.posterURL
            );

        }


        /*
            Criar Blob URL
        */

        state.posterURL =
            URL.createObjectURL(file);


        /*
            Mostrar preview do upload
        */

        uploadPreview.src =
            state.posterURL;

        uploadPreview.style.display =
            "block";


        /*
            Colocar imagem no Story
        */

        storyPoster.src =
            state.posterURL;

        bgImage.src =
            state.posterURL;


        /*
            Alterar aparência da caixa
        */

        uploadBox.classList.add(
            "has-image"
        );


        showToast(
            "Poster adicionado! 🎬"
        );


        updatePreview();

    }
);


/* =====================================================
   DRAG AND DROP
===================================================== */

uploadBox.addEventListener(
    "dragover",
    (event) => {

        event.preventDefault();

        uploadBox.style.borderColor =
            "#ff70b5";

    }
);


uploadBox.addEventListener(
    "dragleave",
    () => {

        uploadBox.style.borderColor =
            "";

    }
);


uploadBox.addEventListener(
    "drop",
    (event) => {

        event.preventDefault();

        uploadBox.style.borderColor =
            "";


        const file =
            event.dataTransfer.files[0];


        if (!file) {
            return;
        }


        /*
            Colocar arquivo no input
        */

        const dataTransfer =
            new DataTransfer();

        dataTransfer.items.add(file);

        posterInput.files =
            dataTransfer.files;


        posterInput.dispatchEvent(
            new Event("change")
        );

    }
);


/* =====================================================
   ESTRELAS
===================================================== */

const starButtons =
    document.querySelectorAll(
        ".stars button"
    );


starButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                state.rating =
                    Number(
                        button.dataset.star
                    );


                updateStars();

                updatePreview();

            }
        );


        button.addEventListener(
            "mouseenter",
            () => {

                const hoverRating =
                    Number(
                        button.dataset.star
                    );


                starButtons.forEach(
                    (star) => {

                        const value =
                            Number(
                                star.dataset.star
                            );


                        star.classList.toggle(
                            "active",
                            value <= hoverRating
                        );

                    }
                );

            }
        );

    }
);


$("stars").addEventListener(
    "mouseleave",
    updateStars
);


function updateStars() {

    starButtons.forEach(
        (star) => {

            const value =
                Number(
                    star.dataset.star
                );


            star.classList.toggle(
                "active",
                value <= state.rating
            );

        }
    );

}


/* =====================================================
   CORAÇÃO
===================================================== */

favoriteButton.addEventListener(
    "click",
    () => {

        state.favorite =
            !state.favorite;


        favoriteButton.classList.toggle(
            "active",
            state.favorite
        );


        favoriteButton.textContent =
            state.favorite
                ? "♥"
                : "♡";


        updatePreview();

    }
);


/* =====================================================
   SELEÇÃO DE FONTE
===================================================== */

fontSelect.addEventListener(
    "change",
    () => {

        state.font =
            fontSelect.value;


        updatePreview();

    }
);


/* =====================================================
   BLUR
===================================================== */

blurRange.addEventListener(
    "input",
    () => {

        state.blur =
            Number(
                blurRange.value
            );


        blurValue.textContent =
            state.blur;


        updatePreview();

    }
);


/* =====================================================
   ESCURECIMENTO
===================================================== */

darkRange.addEventListener(
    "input",
    () => {

        state.dark =
            Number(
                darkRange.value
            );


        darkValue.textContent =
            `${state.dark}%`;


        updatePreview();

    }
);


/* =====================================================
   CARREGAR IMAGEM PARA CANVAS
===================================================== */

function loadImageForCanvas(src) {

    return new Promise(
        (resolve, reject) => {

            const img =
                new Image();


            img.onload = () => {

                resolve(img);

            };


            img.onerror = () => {

                reject(
                    new Error(
                        "Não foi possível carregar o poster."
                    )
                );

            };


            img.src = src;

        }
    );

}


/* =====================================================
   DESENHAR IMAGEM COMO COVER
===================================================== */

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
            Imagem mais horizontal
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
            Imagem mais vertical
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


/* =====================================================
   FUNDO BORRADO
===================================================== */

function drawBlurredBackground(
    ctx,
    img,
    blur,
    dark
) {

    /*
        Canvas auxiliar
    */

    const tempCanvas =
        document.createElement(
            "canvas"
        );


    tempCanvas.width =
        1080;

    tempCanvas.height =
        1920;


    const tempCtx =
        tempCanvas.getContext("2d");


    /*
        Blur
    */

    tempCtx.save();


    tempCtx.filter =
        `blur(${Math.max(blur * 2, 2)}px)`;


    /*
        Expandir a imagem
        para eliminar bordas
    */

    drawCover(
        tempCtx,
        img,
        -80,
        -80,
        1240,
        2080
    );


    tempCtx.restore();


    /*
        Colocar no canvas principal
    */

    ctx.drawImage(
        tempCanvas,
        0,
        0,
        1080,
        1920
    );


    /*
        Escurecer
    */

    ctx.fillStyle =
        `rgba(0,0,0,${dark / 100})`;


    ctx.fillRect(
        0,
        0,
        1080,
        1920
    );

}


/* =====================================================
   TEXTO CENTRALIZADO
===================================================== */

function centerText(
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


/* =====================================================
   QUEBRAR TEXTO
===================================================== */

function wrapText(
    ctx,
    text,
    maxWidth
) {

    const words =
        text.split(" ");


    const lines = [];

    let line = "";


    words.forEach(
        (word) => {

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

                lines.push(line);

                line = word;

            } else {

                line = test;

            }

        }
    );


    if (line) {

        lines.push(line);

    }


    return lines;

}


/* =====================================================
   DESENHAR POSTER CENTRAL
===================================================== */

function drawCentralPoster(
    ctx,
    img
) {

    /*
        Tamanho do poster
    */

    const posterWidth =
        540;


    const posterHeight =
        765;


    const x =
        (1080 - posterWidth) / 2;


    const y =
        245;


    /*
        Sombra
    */

    ctx.save();


    ctx.shadowColor =
        "rgba(0,0,0,.75)";


    ctx.shadowBlur =
        45;


    ctx.shadowOffsetY =
        20;


    /*
        Fundo atrás do poster
    */

    ctx.fillStyle =
        "#050505";


    ctx.fillRect(
        x - 8,
        y - 8,
        posterWidth + 16,
        posterHeight + 16
    );


    ctx.restore();


    /*
        Poster
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


/* =====================================================
   DESENHAR FILME DA VEZ
===================================================== */

function drawMovieLabel(ctx) {

    ctx.save();


    ctx.strokeStyle =
        "rgba(255,255,255,.55)";


    ctx.lineWidth =
        2;


    ctx.beginPath();


    ctx.roundRect(
        80,
        105,
        310,
        75,
        38
    );


    ctx.stroke();


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


/* =====================================================
   DESENHAR CORAÇÃO
===================================================== */

function drawHeart(ctx) {

    if (!state.favorite) {

        return;

    }


    ctx.save();


    ctx.font =
        "58px Arial";


    ctx.fillStyle =
        "#ff70b5";


    ctx.textAlign =
        "center";


    ctx.shadowColor =
        "rgba(255,112,181,.35)";


    ctx.shadowBlur =
        15;


    ctx.fillText(
        "♥",
        990,
        160
    );


    ctx.restore();

}


/* =====================================================
   DESENHAR TÍTULO
===================================================== */

function drawStoryTitle(
    ctx,
    title
) {

    let size =
        76;


    if (
        title.length > 18
    ) {

        size =
            64;

    }


    if (
        title.length > 26
    ) {

        size =
            54;

    }


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


    centerText(
        ctx,
        title.toUpperCase(),
        540,
        1435
    );


    ctx.restore();

}


/* =====================================================
   DESENHAR METADADOS
===================================================== */

function drawMetadata(
    ctx,
    year,
    director
) {

    ctx.save();


    ctx.font =
        '400 27px Inter, Arial, sans-serif';


    ctx.fillStyle =
        "#e3e3e8";


    ctx.textAlign =
        "center";


    const text =
        `${year}  •  ${director.toUpperCase()}`;


    centerText(
        ctx,
        text,
        540,
        1500
    );


    ctx.restore();

}


/* =====================================================
   DESENHAR ESTRELAS
===================================================== */

function drawRating(ctx) {

    ctx.save();


    ctx.font =
        "55px Arial";


    ctx.fillStyle =
        "#ff70b5";


    ctx.textAlign =
        "center";


    const stars =
        "★".repeat(state.rating) +
        "☆".repeat(5 - state.rating);


    centerText(
        ctx,
        stars,
        540,
        1585
    );


    ctx.restore();

}


/* =====================================================
   DESENHAR RESENHA
===================================================== */

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


    const lineHeight =
        38;


    let startY =
        1665 -
        ((lines.length - 1) * 19);


    lines.forEach(
        (line, index) => {

            centerText(
                ctx,
                line,
                540,
                startY +
                index * lineHeight
            );

        }
    );


    ctx.restore();

}


/* =====================================================
   DESENHAR RODAPÉ
===================================================== */

function drawStoryFooter(ctx) {

    ctx.save();


    ctx.font =
        '500 18px "DM Mono", monospace';


    ctx.fillStyle =
        "rgba(255,255,255,.65)";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "filmstarz",
        515,
        1825
    );


    ctx.font =
        "22px Arial";


    ctx.fillStyle =
        "#ff70b5";


    ctx.fillText(
        "✦",
        625,
        1825
    );


    ctx.restore();

}


/* =====================================================
   GERAR STORY COMPLETO
===================================================== */

async function generateStory() {

    if (!state.posterURL) {

        throw new Error(
            "Nenhum poster foi enviado."
        );

    }


    /*
        Canvas final
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
        canvas.getContext("2d");


    ctx.imageSmoothingEnabled =
        true;


    ctx.imageSmoothingQuality =
        "high";


    /*
        Carregar poster
    */

    const poster =
        await loadImageForCanvas(
            state.posterURL
        );


    /*
        1. Fundo
    */

    drawBlurredBackground(
        ctx,
        poster,
        state.blur,
        state.dark
    );


    /*
        2. Poster central
    */

    drawCentralPoster(
        ctx,
        poster
    );


    /*
        3. Topo
    */

    drawMovieLabel(ctx);


    /*
        4. Coração
    */

    drawHeart(ctx);


    /*
        5. Informações
    */

    const title =
        titleInput.value.trim() ||
        "SEU FILME";


    const year =
        yearInput.value.trim() ||
        "2026";


    const director =
        directorInput.value.trim() ||
        "SEU DIRETOR";


    const review =
        reviewInput.value.trim();


    drawStoryTitle(
        ctx,
        title
    );


    drawMetadata(
        ctx,
        year,
        director
    );


    drawRating(ctx);


    drawReview(
        ctx,
        review
    );


    /*
        6. Rodapé
    */

    drawStoryFooter(ctx);


    return canvas;

}


/* =====================================================
   DOWNLOAD
===================================================== */

downloadBtn.addEventListener(
    "click",
    async () => {

        if (!state.posterURL) {

            showToast(
                "Envie um poster antes de baixar."
            );

            return;

        }


        const originalText =
            downloadBtn.innerHTML;


        try {

            downloadBtn.disabled =
                true;


            downloadBtn.innerHTML =
                "<span>…</span> Gerando Story";


            /*
                Criar imagem
            */

            const canvas =
                await generateStory();


            /*
                Transformar em PNG
            */

            const blob =
                await new Promise(
                    (resolve) => {

                        canvas.toBlob(
                            resolve,
                            "image/png",
                            1
                        );

                    }
                );


            if (!blob) {

                throw new Error(
                    "Não foi possível gerar o PNG."
                );

            }


            /*
                Nome do arquivo
            */

            let filename =
                titleInput.value.trim() ||
                "meu-filme";


            filename =
                filename
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    )
                    .replace(
                        /[^a-z0-9]+/g,
                        "-"
                    )
                    .replace(
                        /^-|-$/g,
                        ""
                    );


            filename =
                `filmstarz-${filename || "story"}.png`;


            /*
                ====================================
                COMPARTILHAMENTO NO CELULAR
                ====================================
            */

            const file =
                new File(
                    [blob],
                    filename,
                    {
                        type:
                            "image/png"
                    }
                );


            /*
                Se o navegador suporta
                compartilhamento de arquivos,
                usamos o sistema nativo.
            */

            if (
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({
                    files: [file]
                })
            ) {

                try {

                    await navigator.share({

                        files: [file],

                        title:
                            "Meu Story — filmstarz"

                    });


                    showToast(
                        "Story pronto! ✨"
                    );


                    return;

                } catch (shareError) {

                    /*
                        Se o usuário cancelar o
                        compartilhamento, não mostramos
                        erro.
                    */

                    if (
                        shareError.name ===
                        "AbortError"
                    ) {

                        return;

                    }

                }

            }


            /*
                ====================================
                DOWNLOAD NORMAL
                ====================================
            */

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
                Liberar memória
            */

            setTimeout(
                () => {

                    URL.revokeObjectURL(
                        url
                    );

                },
                5000
            );


            showToast(
                "Story baixado com sucesso! ✨"
            );


        } catch (error) {

            console.error(
                "Erro ao gerar Story:",
                error
            );


            /*
                ==================================
                FALLBACK
                ==================================
            */

            showToast(
                "Não foi possível baixar. Tente novamente."
            );

        } finally {

            downloadBtn.disabled =
                false;


            downloadBtn.innerHTML =
                originalText;

        }

    }
);


/* =====================================================
   TOAST
===================================================== */

let toastTimeout;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

updateStars();

updatePreview();

blurValue.textContent =
    state.blur;

darkValue.textContent =
    `${state.dark}%`;


/* =====================================================
   EVITAR QUE IMAGENS FIQUEM ARRASTÁVEIS
===================================================== */

document
    .querySelectorAll("img")
    .forEach(
        (img) => {

            img.draggable =
                false;

        }
    );