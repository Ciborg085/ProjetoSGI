import { OrbitControls } from 'three/addons/controls/OrbitControls.js' 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //novo
import * as THREE from 'three'; 

const cena = new THREE.Scene();

const meuCanvas = document.getElementById( 'meuCanvas' )
const renderer = new THREE.WebGLRenderer( { canvas: meuCanvas } )
const width = 800
const height = 600

//document.body.appendChild( renderer.domElement ); 
renderer.setSize(width, height)

renderer.shadowMap.enabled = true

// criar uma camara... 
const camara = new THREE.PerspectiveCamera( 70, width / height, 0.01, 1000 ); 
const controlos = new OrbitControls( camara, renderer.domElement);
camara.position.set(1.5,2,5);
camara.lookAt(0,0,0);
controlos.update();



const clickableObjects = ['Porta_L','Porta_R','Gaveta_L','Gaveta_R']
var objects = []
let playedAnimation = [false,false,false,false]

let raycaster = new THREE.Raycaster()
let rato = new THREE.Vector2()


// let eixos = new THREE.AxesHelper()
// cena.add(eixos)

// let grelha = new THREE.GridHelper();
// cena.add(grelha);
 

let misturador = new THREE.AnimationMixer(cena);

let acaoPortaDir = null;
let acaoPortaEsq = null;
let acaoGavetaDir = null;
let acaoGavetaEsq = null;
let carregador = new GLTFLoader();
carregador.load(
    'vintageDesk.gltf',
    ( gltf ) => {
        cena.add(gltf.scene)

        let clipe1 = THREE.AnimationClip.findByName( gltf.animations, 'PortaDirAbrir.001' ) 
        console.log(clipe1)
        acaoPortaDir = misturador.clipAction( clipe1 ) 
        acaoPortaDir.clampWhenFinished = true;

        let clipe2 = THREE.AnimationClip.findByName( gltf.animations, 'PortaEsqAbrir.001' ) 
        console.log(clipe2)
        acaoPortaEsq = misturador.clipAction( clipe2 ) 

        let clipe3 = THREE.AnimationClip.findByName( gltf.animations, 'GavetaDirAbrir.001' ) 
        console.log(clipe3)
        acaoGavetaDir = misturador.clipAction( clipe3 ) 

        let clipe4 = THREE.AnimationClip.findByName( gltf.animations, 'GavetaEsqAbrir.001' ) 
        console.log(clipe4)
        acaoGavetaEsq = misturador.clipAction( clipe4 ) 

        cena.traverse((x) => {
            if (x.isMesh) {
                x.castShadow = true
                x.receiveShadow = true
            }

            if (clickableObjects.includes(x.name)) {
                objects.push(x);
            }
        })
        console.log(objects)
        
    }
)
let delta = 0;
let relogio = new THREE.Clock();
const  latencia_minima = 1 / 60;

function animar() {
    requestAnimationFrame(animar);

    // delta += relogio.getDelta();    // acumula tempo que passou desde a ultima chamada de getDelta

    // if (delta  < latencia_minima)   // não exceder a taxa de atualização máxima definida
    //     return;                     

    controlos.update();
    renderer.render(cena,camara);

    misturador.update( relogio.getDelta() ) 
    // delta = delta % latencia_minima;// atualizar delta com o excedente
}

animar();


function luzes(cena) {
    /* luzes... */
    const luzAmbiente = new THREE.AmbientLight( "lightgreen" )
    cena.add(luzAmbiente)
    
    /* point light */
    const luzPonto = new THREE.PointLight( "white" )
    luzPonto.position.set( 0, 2, 2)
    luzPonto.intensity= 15 		
    cena.add( luzPonto )

    // auxiliar visual
    /*const lightHelper1 = new THREE.PointLightHelper( luzPonto, 0.2 )
    cena.add( lightHelper1 )

    /* directional light*/
    const luzDirecional = new THREE.DirectionalLight( "white" );
    luzDirecional.position.set( 3, 2, 0 ); //aponta na direção de (0, 0, 0)
    luzDirecional.intensity= 30
    cena.add( luzDirecional );

    // auxiliar visual
    const lightHelper2 = new THREE.DirectionalLightHelper( luzDirecional, 0.2 )
    cena.add( lightHelper2 )
}

luzes(cena)

function pegarObjeto(objects) {
    raycaster.setFromCamera(rato, camara)

    let intersetados = raycaster.intersectObjects(objects);

    if (intersetados.length > 0) {
        // alvo.material.color = intersetados[0].object.material.color;
        // playAnimation(intersetados[0].name)
        console.log("alvo : \n")
        if (intersetados[0].object.parent.name !== undefined) {
            console.log(intersetados[0].object.parent.name)
            return intersetados[0].object.parent.name;
        }

    }
}

function playAnimation(name) {
    console.log("Nome: " + name);
    switch (name) {
        case 'Porta_L':
            if (playedAnimation[0] === false) {
                acaoPortaEsq.clampWhenFinished = true;
                acaoPortaEsq.timeScale = 1;
                acaoPortaEsq.setLoop(THREE.LoopOnce)
                acaoPortaEsq.play();
                acaoPortaEsq.paused = false;
                console.log(acaoPortaEsq.clampWhenFinished)
                playedAnimation[0] = true;
            } else {
                acaoPortaEsq.timeScale = -1;
                acaoPortaEsq.paused = false;
                playedAnimation[0] = false;
            }
            break;

        case 'Porta_R':
            if (playedAnimation[1] === false) {
                acaoPortaDir.clampWhenFinished = true;
                acaoPortaDir.timeScale = 1;
                acaoPortaDir.setLoop(THREE.LoopOnce)
                acaoPortaDir.play();
                acaoPortaDir.paused = false;
                console.log(acaoPortaDir.clampWhenFinished)
                playedAnimation[1] = true;
            } else {
                acaoPortaDir.timeScale = -1;
                acaoPortaDir.paused = false;
                playedAnimation[1] = false;
            }
            break;

        case 'Gaveta_L':
            if (playedAnimation[2] === false) {
                acaoGaveta_L.clampWhenFinished = true;
                acaoGaveta_L.timeScale = 1;
                acaoGaveta_L.setLoop(THREE.LoopOnce)
                acaoGaveta_L.play();
                acaoGaveta_L.paused = false;
                console.log(acaoGaveta_L.clampWhenFinished)
                playedAnimation[2] = true;
            } else {
                acaoGaveta_L.timeScale = -1;
                acaoGaveta_L.paused = false;
                playedAnimation[2] = false;
            }
            break;

        case 'Gaveta_R':
            if (playedAnimation[3] === false) {
                acaoGaveta_R.clampWhenFinished = true;
                acaoGaveta_R.timeScale = 1;
                acaoGaveta_R.setLoop(THREE.LoopOnce)
                acaoGaveta_R.play();
                acaoGaveta_R.paused = false;
                console.log(acaoGaveta_R.clampWhenFinished)
                playedAnimation[3] = true;
            } else {
                acaoGaveta_R.timeScale = -1;
                acaoGaveta_R.paused = false;
                playedAnimation[3] = false;
            }
            break;
        default:
            console.log("default case");
            break;
    }
    console.log("Played Animations");
    console.log(playedAnimation);
    
    
}

let botaoPlay = document.getElementById("btn_play");
let botaoPause = document.getElementById("btn_pause");
let botaoStop = document.getElementById("btn_stop");
let botaoReverse = document.getElementById("btn_reverse");
let menu_loop = document.getElementById("menu_loop");

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


menu_loop.addEventListener("change", () => { 
    // alert(menu_loop.value);
    switch(menu_loop.value) {
        case "1":
            // alert("once");
            acaoPortaDir.clampWhenFinished = -acao.clampWhenFinished;
            acaoPortaDir.setLoop(THREE.LoopOnce);
            acaoPortaEsq.setLoop(THREE.LoopOnce);

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



botaoPlay.addEventListener("click",() => {
    acaoPortaDir.play(); 
    acaoPortaEsq.play();
    acaoGavetaDir.play();
    acaoGavetaEsq.play();
});

botaoStop.addEventListener("click",() => {
    acaoPortaDir.stop();
    acaoPortaEsq.stop();
    acaoGavetaDir.stop();
    acaoGavetaEsq.stop();

});

botaoPause.addEventListener("click",() => {
    acaoPortaDir.paused = !acaoPortaDir.paused;
    acaoPortaEsq.paused = !acaoPortaEsq.paused;
});

botaoReverse.addEventListener("click",() => {
    acaoPortaDir.timeScale = -acaoPortaDir.timeScale 
    acaoPortaEsq.timeScale = -acaoPortaEsq.timeScale 
});


meuCanvas.addEventListener("click", (evento) => {
    let limites = evento.target.getBoundingClientRect();

    // rato.x = (evento.clientX / width) * 2 - 1
    // rato.y = -(evento.clientY / height) * 2 + 1
    rato.x = 2 * (evento.clientX - limites.left) / parseInt(meuCanvas.style.width) - 1;
    rato.y = 1 - 2 * (evento.clientY - limites.top) / parseInt(meuCanvas.style.height);
    console.log("x: " + rato.x + "\n" + "y: " + rato.y + "\n");
    let nomeObjeto = pegarObjeto(objects);
    playAnimation(nomeObjeto)

    // raycaster.setFromCamera(rato, camara)

    // const intersetados = raycaster.intersectObjects(objects);
    // console.log("Objects:");
    // console.log(objects);

    // if (intersetados.length > 0) {
    //     // alvo.material.color = intersetados[0].object.material.color;
    //     // playAnimation(intersetados[0].name)
    //     console.log("alvo : \n")
    //     console.log(intersetados[0].object.parent.name)

    // }
});
