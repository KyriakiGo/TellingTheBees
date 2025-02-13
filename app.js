// Load OpenCV
cv['onRuntimeInitialized'] = () => {
    console.log("OpenCV loaded!");
    startFaceDetection();
};

function startFaceDetection() {
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', ''); // Required for mobile Safari
    video.style.display = 'none';
    document.body.appendChild(video);

    // Use the front-facing camera
    const constraints = {
        video: {
            facingMode: 'user' // 'user' means front camera
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
            video.play();
            processVideo(video);
        })
        .catch((err) => {
            console.error("Error accessing camera: ", err);
        });

    // Play background sound
    const sound = document.getElementById('background-sound');
    sound.play().catch((err) => {
        console.error("Autoplay blocked. Please interact with the page to play sound.");
    });
}

function processVideo(video) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    document.body.appendChild(canvas);

    const faceCascade = new cv.CascadeClassifier();
    faceCascade.load('haarcascade_frontalface_default.xml'); // Make sure this file is in your project

    function detectFaces() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img = cv.imread(canvas);
        const gray = new cv.Mat();
        cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY, 0);
        const faces = new cv.RectVector();
        faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0);
        for (let i = 0; i < faces.size(); i++) {
            const face = faces.get(i);
            const mask = document.getElementById('face-mask');
            mask.setAttribute('position', `${face.x} ${face.y} -1`);
            mask.setAttribute('scale', `${face.width} ${face.height} 0.1`);
        }
        requestAnimationFrame(detectFaces);
    }
    detectFaces();
}