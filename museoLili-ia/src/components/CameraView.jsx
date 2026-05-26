import { useRef, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import "../styles/CameraView.css";

function CameraView() {

    const navigate=useNavigate();


    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    

    const [resultado,setResultado] = useState(null);
    const [procesando, setProcesando] = useState(false);

    const [imagenCapturada,setImagenCapturada]=useState(null);

    const [deteccionRealizada,
    setDeteccionRealizada]=useState(false);

   const iniciarCamara = () => {
        navigator.mediaDevices
        .getUserMedia({
            
            video: {
                facingMode: { exact: "environment" }
            }
        })
        .then((stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        })
        .catch((error) => {
            console.log("Error con cámara exacta, intentando fallback...", error);
            
            
            navigator.mediaDevices
            .getUserMedia({
                video: { facingMode: "environment" }
            })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((err) => {
                console.log("Error definitivo al iniciar la cámara:", err);
            });
        });
    }


    useEffect(()=>{

        iniciarCamara();

    },[]);

    



    const dibujarMascara=(mask)=>{

        if(
            !mask ||
            mask.length===0
        ) return;


        const canvas = overlayRef.current;
        const ctx = canvas.getContext("2d");

        const video = videoRef.current;

        
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const anchoMascara = mask[0].length;
        const altoMascara = mask.length;

        const imageData = ctx.createImageData(
            anchoMascara,
            altoMascara
        );

        for(let y=0;y<altoMascara;y++){

            for(let x=0;x<anchoMascara;x++){

                const valor = mask[y][x];

                const indice=(y*anchoMascara+x)*4;

                if(valor>0.5){

                    imageData.data[indice]=0;
                    imageData.data[indice+1]=255;
                    imageData.data[indice+2]=0;
                    imageData.data[indice+3]=100;

                }

            }

        }

        const tempCanvas=document.createElement("canvas");

        tempCanvas.width=anchoMascara;
        tempCanvas.height=altoMascara;

        const tempCtx=tempCanvas.getContext("2d");

        tempCtx.putImageData(
            imageData,
            0,
            0
        );

        ctx.drawImage(
            tempCanvas,
            0,
            0,
            canvas.width,
            canvas.height
        );

    }


    const dibujarCaja=(box,nombre)=>{

        if(!box) return;


        const canvas=overlayRef.current;

        const ctx=canvas.getContext("2d");

        const [x1,y1,x2,y2]=box;

        const escalaX=
        canvas.width/640;

        const escalaY=
        canvas.height/480;

        ctx.strokeStyle="red";

        ctx.lineWidth=3;

        ctx.strokeRect(
            x1*escalaX,
            y1*escalaY,
            (x2-x1)*escalaX,
            (y2-y1)*escalaY
        );

        ctx.font="20px Arial";

        ctx.fillStyle="red";

        ctx.fillText(
            nombre,
            x1*escalaX,
            y1*escalaY-10
        );

    }



    const capturarImagen = async () => {

        if(procesando) return;

        setProcesando(true);

        const canvas = canvasRef.current;
        const video = videoRef.current;

        try{

            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            context.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const imagen = canvas.toDataURL(
                "image/jpeg",
                0.6
            );

            setImagenCapturada(imagen);

            const respuesta = await fetch(
                "http://localhost:8000/predict",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        image:imagen
                    })
                }
            );

            const datos = await respuesta.json();

            setDeteccionRealizada(true);

            setResultado(datos);

            if(datos.mask){

                dibujarMascara(
                    datos.mask
                );

            }

            /*if(datos.box){

                dibujarCaja(
                    datos.box,
                    datos.class
                );

            }*/

            

        }
        catch(error){

            console.log(error);

        }
        finally{

            setProcesando(false);

        }
    };

    const reiniciarDeteccion=()=>{

        setResultado(null);

        setImagenCapturada(null);

        setDeteccionRealizada(false);

        const canvas=overlayRef.current;

        const ctx=canvas.getContext("2d");

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        setTimeout(()=>{

            iniciarCamara();

        },100);

    }


    return (
        <div className="museum-container">
            
            <header className="museum-header">
                <h1>MUSEO Lili <span>UAO</span></h1>
                <p>
                    Explora el museo Lili mediante visión artificial e inteligencia artificial.
                    Descubre la historia, origen y contexto cultural de cada pieza.
                </p>
            </header>

            
            <div className="museum-content">
                
                
                <div className="museum-viewport-card">
                    <div className="viewport-stream-wrapper">
                        {!deteccionRealizada ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="viewport-element"
                            />
                        ) : (
                            <img
                                src={imagenCapturada}
                                alt="Muestra arqueológica"
                                className="viewport-element"
                            />
                        )}

                        
                        <canvas
                            ref={overlayRef}
                            className="viewport-overlay"
                        />
                    </div>
                </div>

                
                <div className="museum-info-card">
                    
                    {resultado ? (
                        <div className="analysis-result">
                            <h2 className="object-title">{resultado.class}</h2>
                            
                            <div className="accuracy-badge">
                                {Math.round(resultado.score * 100)}% de coincidencia
                            </div>

                            <div className="metadata-group">
                                <span className="metadata-label">DESCRIPCIÓN</span>
                                <p className="metadata-text">{resultado.descripcion}</p>
                            </div>

                            <div className="metadata-group">
                                <span className="metadata-label">ÉPOCA</span>
                                <p className="metadata-text">{resultado.epoca}</p>
                            </div>

                            <div className="metadata-group">
                                <span className="metadata-label">ORIGEN</span>
                                <p className="metadata-text">{resultado.origen}</p>
                            </div>

                            {resultado.class !== "No encontrado" && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate("/info", { state: resultado })}
                                >
                                    Ver información detallada
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="analysis-empty">
                            <div className="ui-decoration-icon">⊙</div>
                            <p>
                                Apunta la cámara de tu dispositivo hacia una pieza y presiona el botón para iniciar la detección con Inteligencia Artificial.
                            </p>
                        </div>
                    )}

                    
                    <div className="analysis-actions">
                        {!deteccionRealizada ? (
                            <button
                                className="btn btn-action-trigger"
                                onClick={capturarImagen}
                                disabled={procesando}
                            >
                                {procesando ? "detectando..." : "Detectar objeto"}
                            </button>
                        ) : (
                            <button
                                className="btn btn-secondary"
                                onClick={reiniciarDeteccion}
                            >
                                Nueva lectura
                            </button>
                        )}
                    </div>

                </div>
            </div>

            
            <canvas
                ref={canvasRef}
                style={{ display: "none" }}
            />
        </div>
    );
    }

export default CameraView;