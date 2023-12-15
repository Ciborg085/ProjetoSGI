var cena = new THREE.Scene();

// criar uma camara... 
var camara = new THREE.PerspectiveCamera( 70, 800 / 600, 0.01, 1000 ); 
camara.position.set(6,4,7);
camara.lookAt(0,0,0)

var meuCanvas = document.getElementById( 'meuCanvas' )
var renderer = new THREE.WebGLRenderer( { canvas: meuCanvas } )
var width = 800
var height = 600
//document.body.appendChild( renderer.domElement ); 
renderer.setSize(width, height)

renderer.shadowMap.enabled = true

const clickableObjects = ['Porta_L','Porta_R','Gaveta_L','Gaveta_R']
var objects = []
let playedAnimation = [false,false,false,false]

var raycaster = new THREE.Raycaster()
var rato = new THREE.Vector2()

var luz = new THREE.PointLight( "white" )
luz.position.set(5,3,5)
luz.castShadow =true
cena.add(luz)

var eixos = new THREE.AxesHelper()
cena.add(eixos)

var grelha = new THREE.GridHelper()
cena.add(grelha)
 
var controlos = new THREE.OrbitControls( camara, renderer.domElement)

var relogio = new THREE.Clock()

var misturador = new THREE.AnimationMixer(cena)

var acaoPortaDir, acaoPortaEsq;
var carregador = new THREE.GLTFLoader()
carregador.load(
    'vintageDesk.gltf',
    function ( gltf ) {
        cena.add(gltf.scene)

        clipe1 = THREE.AnimationClip.findByName( gltf.animations, 'PortaDirAbrir.001' ) 
        console.log(clipe1)
        acaoPortaDir = misturador.clipAction( clipe1 ) 
        acaoPortaDir.clampWhenFinished = true

        clipe2 = THREE.AnimationClip.findByName( gltf.animations, 'PortaEsqAbrir.001' ) 
        console.log(clipe2)
        acaoPortaEsq = misturador.clipAction( clipe2 ) 
        acaoPortaEsq.clampWhenFinished = true

        clipe3 = THREE.AnimationClip.findByName( gltf.animations, 'GavetaDirAbrir.001' ) 
        console.log(clipe3)
        acaoGavetaDir = misturador.clipAction( clipe3 ) 
        acaoGavetaDir.clampWhenFinished = true

        clipe4 = THREE.AnimationClip.findByName( gltf.animations, 'GavetaEsqAbrir.001' ) 
        console.log(clipe4)
        acaoGavetaEsq = misturador.clipAction( clipe4 ) 
        acaoGavetaEsq.clampWhenFinished = true

        cena.traverse(function(x) {
            // if (x.isMesh) {
            //     x.castShadow = true
            //     x.receiveShadow = true

            //     if (clickableObjects.includes(x.name))
            //         alvo = x
            // }

            if (clickableObjects.includes(x.name)) {
                objects.push(x);
            }
        })
        
    }
)

function animar() {
    requestAnimationFrame(animar);
    // mostrar ...
    renderer.render(cena,camara);
    misturador.update( relogio.getDelta() ) 
}

animar();

function pegarObjeto() {
    raycaster.setFromCamera(rato, camara)

    var intersetados = raycaster.intersectObjects(objects);

    if (intersetados.length > 0) {
        // alvo.material.color = intersetados[0].object.material.color;
        // playAnimation(intersetados[0].name)
        console.log("alvo : \n")
        console.log(intersetados[0].name)

    }
}

function playAnimation(name) {
    switch (name) {
        case 'Porta_L':
            if (playedAnimation[0] === false) {
                acaoPortaEsq.play();
                playedAnimation[0] = true;
            } else {
                acaoPortaEsq.play();
                playedAnimation[0] = false;
            }
            break;

        case 'Porta_D':
            if (playedAnimation[1] === false) {
                acaoPortaDir.play();
                playedAnimation[1] = true;
            } else {
                acaoPortaDir.play();
                playedAnimation[1] = false;
            }
            break;

        case 'Gaveta_L':
            if (playedAnimation[2] === false) {
                acaoGavetaEsq.play();
                playedAnimation[2] = true;
            } else {
                acaoGavetaEsq.play();
                playedAnimation[2] = false;
            }
            break;

        case 'Gaveta_D':
            if (playedAnimation[3] === false) {
                acaoGavetaDir.play();
                playedAnimation[3] = true;
            } else {
                acaoGavetaDir.play();
                playedAnimation[3] = false;
            }
            break;
    }
    
    
}

var botaoPlay = document.getElementById("btn_play");
var botaoPause = document.getElementById("btn_pause");
var botaoStop = document.getElementById("btn_stop");
var botaoReverse = document.getElementById("btn_reverse");
var menu_loop = document.getElementById("menu_loop");

// botaoPlay.addEventListener("click",function() { 
//     switch (menu_loop) {
//         case 1:
//             acao.setLoop(THREE.LoopOnce)
//             acao.play() 
//             break;
//         case 2:
//             acao.setLoop(THREE.LoopRepeat)
//             acao.play() 
//             break;
//         case 3:
//             acao.setLoop(THREE.LoopPingPong)
//             acao.play() 
//             break;
//         default:
//             break;
//     }
// });


menu_loop.addEventListener("change", function() { 
    // alert(menu_loop.value);
    switch(menu_loop.value) {
        case "1":
            // alert("once");
            acao.clampWhenFinished = -acao.clampWhenFinished;
            acaoPortaDir.setLoop(THREE.LoopOnce);

            acao.clampWhenFinished = -acao.clampWhenFinished;
            acaoPortaEsq.setLoop(THREE.LoopOnce);
            break;
        case "2":
            // alert("repeat");
            acaoPortaDir.setLoop(THREE.LoopRepeat);
            acaoPortaEsq.setLoop(THREE.LoopRepeat);
            break;
        case "3":
            // alert("ping");
            acaoPortaDir.setLoop(THREE.LoopPingPong);
            acaoPortaEsq.setLoop(THREE.LoopPingPong);
            break;
    }
},false);


botaoPlay.addEventListener("click",function() { acaoPortaDir.play(); acaoPortaEsq.play() });

botaoStop.addEventListener("click",function() { acaoPortaDir.stop(); acaoPortaEsq.stop() });

botaoPause.addEventListener("click",function() {
    acaoPortaDir.paused = !acaoPortaDir.paused;
    acaoPortaEsq.paused = !acaoPortaEsq.paused;
});

botaoReverse.addEventListener("click",function() {
    acaoPortaDir.timeScale = -acaoPortaDir.timeScale 
    acaoPortaEsq.timeScale = -acaoPortaEsq.timeScale 
});


window.onclick = function(evento) {
    rato.x = (evento.clientX / width) * 2 - 1
    rato.y = -(evento.clientY / height) * 2 + 1
    pegarObjeto();
}
