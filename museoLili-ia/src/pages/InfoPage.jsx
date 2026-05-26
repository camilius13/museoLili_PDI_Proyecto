import { useLocation, useNavigate } from "react-router-dom";
import "../styles/InfoPage.css"; 

function InfoPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const objeto = location.state;

    if (!objeto) {
        return (
            <div className="museum-details-container empty-state">
                <div className="details-glass-card">
                    <h1 className="error-title">No hay información disponible</h1>
                    <button className="btn btn-secondary" onClick={() => navigate("/")}>
                        ← Volver al escáner
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="museum-details-container">
           
            <div className="navigation-wrapper">
                <button className="btn-back-link" onClick={() => navigate(-1)}>
                    <span className="arrow">←</span> Volver a la detección
                </button>
            </div>

           
            <article className="details-glass-card">
                
               
                {objeto.imagen && (
                    <div className="details-image-wrapper">
                        <img 
                            src={objeto.imagen} 
                            alt={`Render o fotografía de ${objeto.class}`} 
                            className="object-featured-image"
                        />
                        <div className="image-overlay-shadow"></div>
                    </div>
                )}
                
              
                <div className="details-content-padding">
                   
                    <header className="details-header">
                        <h1 className="object-main-title">{objeto.class}</h1>
                        <div className="cultural-pill">Pieza Arqueológica Certificada</div>
                    </header>

                   
                    <div className="details-meta-grid">
                        <div className="meta-box">
                            <span className="meta-label">ÉPOCA</span>
                            <p className="meta-value">{objeto.epoca}</p>
                        </div>
                        <div className="meta-box">
                            <span className="meta-label">ORIGEN</span>
                            <p className="meta-value">{objeto.origen}</p>
                        </div>
                    </div>

                  
                    <div className="details-body-content">
                        <span className="meta-label">CONTEXTO HISTÓRICO</span>
                        <p className="description-paragraph">{objeto.descripcion}</p>
                    </div>

                   
                    <footer className="details-footer">
                        <button className="btn btn-action-return" onClick={() => navigate(-1)}>
                            Escanear otro objeto
                        </button>
                    </footer>
                </div>

            </article>
        </div>
    );
}

export default InfoPage;