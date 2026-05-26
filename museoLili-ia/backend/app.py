from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from clases import CLASES
from museo_data import MUSEO_DATA

from model_loader import cargar_modelo
from inference import predecir

app=FastAPI()

model=cargar_modelo()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageRequest(BaseModel):
    image:str


@app.post("/predict")
def predict(data: ImageRequest):

    prediction = predecir(
        model,
        data.image
    )

    masks = prediction["masks"]
    boxes = prediction["boxes"]
    scores = prediction["scores"]
    labels = prediction["labels"]

    if len(scores)==0:

        return {

            "class":"No encontrado",
            "score":0

        }


    mejor_indice = torch.argmax(
        scores
    ).item()


    clase_id = labels[mejor_indice].item()

    score = scores[mejor_indice].item()

    nombre_clase = CLASES.get(
        clase_id,
        "Desconocido"
    )

    info = MUSEO_DATA.get(
        nombre_clase,
        {
            "descripcion":"Sin información",
            "epoca":"Desconocida",
            "origen":"Desconocido",
            "imagen":"imagen no encontrada"
        }
    )


    mask = masks[
        mejor_indice
    ].squeeze().cpu().numpy()

    mask = mask.tolist()

    box = boxes[
        mejor_indice
    ].cpu().numpy().tolist()


    return {

        "class":nombre_clase,

        "score":round(score,2),

        "descripcion":
        info["descripcion"],

        "epoca":
        info["epoca"],

        "origen":
        info["origen"],

        "imagen":
        info["imagen"],

        "mask":mask,
        "box":box

    }