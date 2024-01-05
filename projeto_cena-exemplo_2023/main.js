import { OrbitControls } from 'three/addons/controls/OrbitControls.js' 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //novo
import * as THREE from 'three'; 

/* cena... */
const cena = new THREE.Scene()



// Configurando o canvas(retangulo)
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
//document.body.appendChild(canvas);
let meuCanvas = document.getElementById( 'meuCanvas' );
let renderer = new THREE.WebGLRenderer( { canvas: meuCanvas } );


// Configurando a câmera
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
camera.position.set(4, 3, 2);

// Adicionando o OrbitControls
const controls = new OrbitControls(camera, meuCanvas);
/* geometria...  (novo)*/
let carregador = new GLTFLoader()
carregador.load(
    'model/vintageDesk.gltf', 
    function ( gltf ) {
        cena.add( gltf.scene )
    }
)
/* renderer... */

renderer.setSize( 800, 600 )

renderer.shadowMap.enabled=true;
let grelha = new THREE.GridHelper()
cena.add( grelha )

let eixos = new THREE.AxesHelper(3)
cena.add( eixos )





// Renderizar e animar
let delta = 0;			  // tempo desde a última atualização
let relogio = new THREE.Clock(); // componente que obtém o delta
let latencia_minima = 1 / 60;    // tempo mínimo entre cada atualização
function animar() {
    requestAnimationFrame(animar);  // agendar animar para o próximo animation frame
    delta += relogio.getDelta();    // acumula tempo que passou desde a ultima chamada de getDelta

    if (delta  < latencia_minima)   // não exceder a taxa de atualização máxima definida
        return;                     
        
    renderer.render( cena, camera )
    
    delta = delta % latencia_minima;// atualizar delta com o excedente
}

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
animar()