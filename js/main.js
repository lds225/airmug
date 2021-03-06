// 함수 자동 호출  === (function(){})();
(()=>{
    let yOffset = 0; // pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다  이전에 위치한 스크롤 섹션들의 높이값의 합
    let currentScene = 0; // 현재 활성화된 (눈 앞에 보고있는) 씬(scroll_section)
    let enterNewScene = false; // 새로운 씬이 시작된 순간 true
    let acc = 0.2;
    let delayedYOffset = 0;
    let rafId;
    let rafState; // 애니메이션프레임의 상태를 나타내는 변수

    const sceneInfo = [
        {
            //0   
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll_section_0'),
                messageA: document.querySelector('#scroll_section_0 .main_message.a'),
                messageB: document.querySelector('#scroll_section_0 .main_message.b'),
                messageC: document.querySelector('#scroll_section_0 .main_message.c'),
                messageD: document.querySelector('#scroll_section_0 .main_message.d'),
                canvas: document.querySelector('#video_canvas_0'),
                context:  document.querySelector('#video_canvas_0').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImagesCount: 300,
                imageSequence: [0, 299],
                canvas_opacity:[1,0, {start:0.9, end: 1}],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
            },
            finishedLoadingImages: false
        },
        {   
            //1   
            type: 'normal',
            // heightNum: 5, 필요없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll_section_1'),
                content: document.querySelector('#scroll_section_1 .description')
            }
        },
        {   
            type: 'sticky',
            //2   
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll_section_2'),
                messageA: document.querySelector('#scroll_section_2 .a'),
                messageB: document.querySelector('#scroll_section_2 .b'),
                messageC: document.querySelector('#scroll_section_2 .c'),
                pinB: document.querySelector('#scroll_section_2 .b .pin'),
                pinC: document.querySelector('#scroll_section_2 .c .pin'),
                canvas: document.querySelector('#video_canvas_1'),
                context:  document.querySelector('#video_canvas_1').getContext('2d'),
                videoImages: []
            },
            values: {
                videoImagesCount: 960,
                imageSequence: [0, 959],
                canvas_opacity_in:[0,1, {start:0, end: 0.1}],
                canvas_opacity_out:[1,0, {start:0.95, end: 1}],
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
                messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
                messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
                messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
                messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
                messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
                pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
            },
            finishedLoadingImages: false
        },
        {   
            //3   
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll_section_3'),
                canvasCaption: document.querySelector('.canvas_caption'),
                canvas: document.querySelector('.image_blend_canvas'),
                context: document.querySelector('.image_blend_canvas').getContext('2d'),
                imagesPath: [
                    './img/blend_image_1.jpg',
                    './img/blend_image_2.jpg'
                ],
                images: []
            },
            values: {
                rect1X: [0,0, {start: 0, end:0}],
                rect2X: [0,0, {start: 0, end:0}],
                blendHeight: [0, 0, {start: 0, end: 0}],
                canvas_scale: [0, 0, {start: 0, end: 0}],
                canvasCaption_opacity: [0,1,{start:0, end:0}],
                canvasCaption_translateY: [20,0,{start:0, end:0}],
                rectStartY: 0
            }
        }
    ];

   // 캔버스 이미지 로드

	let totalImages = 0;
	const scene0Images = [];
	const scene2Images = [];

	// Scene 0 이미지 로드
	function loadImagesOfScene0() {
		if (sceneInfo[0].finishedLoadingImages) return;

		let numberOfLoadedImages = 0;
		for (let i = 0; i < sceneInfo[0].values.videoImagesCount; i++) {
			let imgElem = new Image();
			imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
			imgElem.addEventListener('load', () => {
				scene0Images.push(imgElem);
				numberOfLoadedImages++;

				totalImages++;
				
				if (numberOfLoadedImages === sceneInfo[0].values.videoImagesCount) {
					// 해당 씬의 이미지가 모두 로드되었으면
					sceneInfo[0].finishedLoadingImages = true;
					console.log(`scene 0 이미지 로드 완료`)
					console.log(`로드된 이미지 총개수: ${totalImages}`);
					setImagesOfScene0();
					initAfterLoadImages();

					if (!sceneInfo[2].finishedLoadingImages) {
						loadImagesOfScene2();
					}
				}
			});
		}
	}

	// Scene 2 이미지 로드
	function loadImagesOfScene2() {
		if (sceneInfo[2].finishedLoadingImages) return;

		let numberOfLoadedImages = 0;
		for (let i = 0; i < sceneInfo[2].values.videoImagesCount; i++) {
			let imgElem = new Image();
			imgElem.src = `./video/002/IMG_${7027 + i}.JPG`;
			imgElem.addEventListener('load', () => {
				scene2Images.push(imgElem);
				numberOfLoadedImages++;

				totalImages++;
				
				if (numberOfLoadedImages === sceneInfo[2].values.videoImagesCount) {
					// 해당 씬의 이미지가 모두 로도되었으면
					sceneInfo[2].finishedLoadingImages = true;
					console.log(`scene 2 이미지 로드 완료`)
					console.log(`로드된 이미지 총개수: ${totalImages}`);
					setImagesOfScene2();
					initAfterLoadImages();

					if (!sceneInfo[0].finishedLoadingImages) {
						loadImagesOfScene0();
					}
				}
			});
		}
	}

	function getImageNumber(str) {
		const newStr = str.substring(
			str.lastIndexOf("_") + 1, 
			str.lastIndexOf(".")
		);
		return newStr * 1;
	}

	// 이미지가 로드되는 순서는 이미지 번호 순으로 보장이 안되기 때문에 정렬 함수로 번호순 정렬이 필요
	function sortImages(imageArray) {
		let temp;
		let imageNumber1;
		let imageNumber2;
		for (let i = 0; i < imageArray.length; i++) {
			for (let j = 0; j < imageArray.length - i; j++) {
				if (j < imageArray.length - 1) {
					imageNumber1 = getImageNumber(imageArray[j].currentSrc);
					imageNumber2 = getImageNumber(imageArray[j + 1].currentSrc);
					if (imageNumber1 > imageNumber2) {
						temp = imageArray[j];
						imageArray[j] = imageArray[j + 1];
						imageArray[j + 1] = temp;
					}
				}
			}
		}
	}

	function setImagesOfScene0() {
		// Scene 0에 쓰이는 scene0Images 이미지 배열을 번호순 정렬 후
		// sceneInfo[0].objs.videoImages 배열에 저장
		sortImages(scene0Images);
		for (let i = 0; i < scene0Images.length; i++) {				
			sceneInfo[0].objs.videoImages.push(scene0Images[i]);
		}
	}

	function setImagesOfScene2() {
		// Scene 2에 쓰이는 scene2Images 이미지 배열을 번호순 정렬 후
		// sceneInfo[2].objs.videoImages 배열에 저장
		sortImages(scene2Images);
		for (let i = 0; i < scene2Images.length; i++) {
			sceneInfo[2].objs.videoImages.push(scene2Images[i]);
		}
	}

	function checkMenu() {
		if (yOffset > 44) {
			document.body.classList.add('local_nav_sticky');
		} else {
			document.body.classList.remove('local_nav_sticky');
		}
	}

    function setLayout(){
        // 각 스크롤 섹션의 높이 세팅
        for(let i = 0; i < sceneInfo.length; i++){
            if(sceneInfo[i].type === 'sticky'){
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if(sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight + window.innerHeight * 0.5;
            }
            sceneInfo[i].objs.container.style.height= `${sceneInfo[i].scrollHeight}px`;
        }

        yOffset= window.pageYOffset;
        let totalScrollHeight = 0;
        for(let i = 0; i < sceneInfo.length; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset){
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show_scene_${currentScene}`)
        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset){
        let rv;
        // 현재 씬에서 스크롤된 범위를 비율로 구하기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;

        if(values.length === 3){
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if(currentYOffset < partScrollStart){
                rv = values[0];
            } else if(currentYOffset > partScrollEnd){
                rv = values[1];
            }
        }else{
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight;
    
        switch (currentScene) {
            case 0:
                // console.log('0 play');
                // let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
    
                break;
    
            case 2:
                // console.log('2 play');
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

                if (scrollRatio <= 0.5) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset)
                }else{
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset)

                }
                if (scrollRatio <= 0.32) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.67) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
    
                if (scrollRatio <= 0.93) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }

                // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
                if(scrollRatio > 0.9) {
                    const objs = sceneInfo[3].objs; // 변수 충동 오류 방지
                    const values = sceneInfo[3].values;
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;
                    let canvasScaleRatio;

                    if(widthRatio <= heightRatio){
                        // 캔버스보다 브라우저 창이 홀쭉한 경우
                        canvasScaleRatio = heightRatio;
                    } else {
                        // 캔버스보다 브라우저 창이 낙잡한 경우
                        canvasScaleRatio = widthRatio;
                    }

                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    objs.context.fillStyle = 'white';
                    objs.context.drawImage(objs.images[0], 0, 0);

                    // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                    const whiteRectWidth = recalculatedInnerWidth * 0.15;
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                    // 초기값으로 설정 [0]
                    objs.context.fillRect(parseInt(values.rect1X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
                    objs.context.fillRect(parseInt(values.rect2X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
                }
    
                break;
    
            case 3:
                // console.log('3 play');
                // 가로 세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
                let step = 0;
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;

                if(widthRatio <= heightRatio){
                    // 캔버스보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                } else {
                    // 캔버스보다 브라우저 창이 낙잡한 경우
                    canvasScaleRatio = widthRatio;
                }

                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white';
                objs.context.drawImage(objs.images[0], 0,0);

                // 캔버스 사이즈에 맞춰 가정한 innerWidth와 innerHeight
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                if(!values.rectStartY){
                    // values.rectStartY = objs.canvas.getBoundingClientRect().top;
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }

                const whiteRectWidth = recalculatedInnerWidth * 0.15;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // 오브젝트의 위치 좌표 (포지션과 크기)

                // 좌우 흰색 박스 그리기
                //x , y, width, height -> 정수로 했을 때 캔버스 처리 기능 더 좋음
                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height );
                objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);
                objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);

                if(scrollRatio < values.rect1X[2].end){
                    step = 1;
                    objs.canvas.classList.remove('sticky');
                }else{
                    step  = 2;
                    // 이미지 블렌드
                    // imageBlendY: [0,0,{start:0, end:0}]
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);

                    objs.context.drawImage(objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                    );

                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top =`${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`;

                    if(scrollRatio > values.blendHeight[2].end){
                        values.canvas_scale[0] = canvasScaleRatio;
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
                        values.canvas_scale[2].start = values.blendHeight[2].end;
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                        objs.canvas.style.marginTop = 0;
                    }

                    if(scrollRatio > values.canvas_scale[2].end
                        && values.canvas_scale[2].end > 0){
                        objs.canvas.classList.remove('sticky');
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;

                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
                        values.canvasCaption_translateY[2].start =values.canvasCaption_opacity[2].start;
                        values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;
                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
                    }
                }
                break;
        }
    }

    function scrollLoop(){
        enterNewScene = false;
        prevScrollHeight = 0; // 누적되지 않도록 초기화
        for(let i =0; i < currentScene; i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        if(delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            document.body.classList.remove('scroll_effect_end');
        }
        if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            enterNewScene = true;
            if(currentScene === sceneInfo.length -1){
                document.body.classList.add('scroll_effect_end');
            }
            if(currentScene < sceneInfo.length -1){
                currentScene++;
            }
            document.body.setAttribute('id', `show_scene_${currentScene}`)
        }

        if(delayedYOffset < prevScrollHeight){
            enterNewScene = true;
            if(currentScene === 0) return; // ios에서 스크롤 바운스가 있을 때 화면이 -(음수값)가 되어 오류가 될 가능성 배제
            currentScene--;
            document.body.setAttribute('id', `show_scene_${currentScene}`)
        }

        if(enterNewScene) return; // 스크롤 위치 바뀔 때 나쁜영향을 피하기 위하여 만듬

        // 애니메이션 처리
        playAnimation();
    }

    function loop() {
        // 빠르게 가다 느려져 서서히 멈추는 효과를 주는 값
        // 이동량이 점점 줄어 드는 것
        // 이전의 이동량보다 더 작아지는 식
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

        if(!enterNewScene){
            if(currentScene === 0 || currentScene === 2) {
                const currentYOffset = delayedYOffset - prevScrollHeight;
                const objs = sceneInfo[currentScene].objs;
                const values = sceneInfo[currentScene].values;
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if(objs.videoImages[sequence]){
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
            }
        }

         // 일부 기기에서 페이지 끝으로 고속 이동하면 body id가 제대로 인식 안되는 경우를 해결
        // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
        if (delayedYOffset < 1) {
            scrollLoop();
            sceneInfo[0].objs.canvas.style.opacity = 1;
			if (sceneInfo[0].objs.videoImages[0]) {
				sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
			}
        }
        // 페이지 맨 아래로 갈 경우: 마지막 섹션은 스크롤 계산으로 위치 및 크기를 결정해야할 요소들이 많아서 1픽셀을 움직여주는 것으로 해결
        if ((document.body.offsetHeight - window.innerHeight) - delayedYOffset < 1) {
            let tempYOffset = yOffset;
            scrollTo(0, tempYOffset - 1);
        }


        rafId = requestAnimationFrame(loop);

        // 두 지점의 차이가 1px 보다 작으면
        // Math.abs() -> 절대값 처리 
        // 음수가 나와 위로 스크롤할 시 동작이 부드럽게 되지 않아 절대값으로 처리
        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }
    function initAfterLoadImages() {
		if (
			currentScene !== 2 &&
			sceneInfo[0].objs.videoImages[0]
		) {
			sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
		}

		// 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
		let tempYOffset = yOffset;
		let tempScrollCount = 0;
		if (tempYOffset > 0) {
			let siId = setInterval(() => {
				scrollTo(0, tempYOffset);
				tempYOffset += 5;

				if (tempScrollCount > 20) {
					clearInterval(siId);
				}
				tempScrollCount++;
			}, 20);
		}
	}

   // window.addEventListener('DOMContentLoaded', setLayout); // html 구조 객체가 로드된 후 실행
  
	window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded!');
    setLayout(); // 중간에 새로고침 시, 콘텐츠 양에 따라 높이 계산에 오차가 발생하는 경우를 방지하기 위해 before-load 클래스 제거 전에도 확실하게 높이를 세팅하도록 한번 더 실행
    document.body.classList.remove('before_load');
    setLayout();

    // Scene 3 이미지블렌드 캔버스에 쓰는 이미지 세팅
    let imgElem;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
        imgElem = new Image();
        imgElem.src = sceneInfo[3].objs.imagesPath[i];
        sceneInfo[3].objs.images.push(imgElem);
    }

    console.log('loadImages 호출');
    if (currentScene !== 2) {
        // 0번, 첫번째 씬의 이미지를 로드
        loadImagesOfScene0();
    } else {
        // 2번, 세번째 씬의 이미지를 로드
        loadImagesOfScene2();
    }

        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
            checkMenu();
    
            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        window.addEventListener('resize', () => {
            if(window.innerWidth > 900){
                // setLayout();
                // sceneInfo[3].values.rectStartY = 0;
                // // 스크롤 된 값으로 이미 위치를 가져왔기 때문에 리사이즈시 에러발생
                // // 강제로 리로드 할 수도 있음
                window.location.reload();
            }
        });

        document.querySelector('.loading').addEventListener('transitionend',(e) => {
            document.body.removeChild(e.currentTarget);
            // 화살표 함수를 사용했기 때문에 this를 사용할 수 없다.
            // 화살표 함수 안의 this는 전역객체를 가리킨다
        });// 애니메이션이 끝난 후에 호출

        window.addEventListener('orientationchange', () => {
            // setTimeout(setLayout, 500); // 아이폰 버벅거림 발생으로 딜레이 후 동작
            scrollTo(0,0);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }); //화면 회전 할 때 

        document.querySelector('.loading').addEventListener('transitionend', (e) => {
			if (e.currentTarget.parentNode === document.body) {
				document.body.removeChild(e.currentTarget);
			}
		});
    }); // 모든 리소스(이미지까지)가 로드 된 후 실행

})();
