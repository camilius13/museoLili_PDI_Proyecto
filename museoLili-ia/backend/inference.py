import base64
import io

from PIL import Image
import numpy as np
import torch
from torchvision import transforms


def predecir(model, imagen_base64):

   

    imagen_base64 = imagen_base64.split(",")[1]

    # decodificar
    imagen_bytes = base64.b64decode(
        imagen_base64
    )

    imagen = Image.open(
        io.BytesIO(imagen_bytes)
    )

    imagen = imagen.convert("RGB")


    transform = transforms.ToTensor()

    tensor = transform(imagen)

    with torch.no_grad():

        prediction = model([tensor])

    return prediction[0]