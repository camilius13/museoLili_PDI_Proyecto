# Museo Lili UAO - Reconocimiento de Obras de Arte con Mask R-CNN
### Autores: Camilo Pinzón Mosquera - Diego Rodriguez Meza - Jacobo Díaz 


Este proyecto es una aplicación web interactiva diseñada para escanear y reconocer piezas históricas mediante visión por computadora utilizando la arquitectura **Mask R-CNN** y Deep Learning. Permite capturar imágenes desde la cámara trasera nativa del celular y procesarlas en tiempo real para obtener su contexto histórico.

El proyecto toma lugar en el curso de **Procesamiento Digital de Imágenes (PDI)** de la Universidad Autónoma de Occidente (UAO).

---

## Arquitectura del Proyecto

El proyecto está estructurado en 2 partes:

* **Frontend:** Desarrollado en **React (Vite)**.
* **Backend:** Desarrollado en **FastAPI (Python)**, que es el se encarga de recibir los datos de las fotos y ejecutar las predicciones del modelo de MaskRCNN.
---


## Guía de Ejecución Local

Los siguientes pasos son para ejecutar el aplicativo web de forma local. Se debe tener instalado **Node.js (v18+)** y **Python (3.10+)**.

### 1. Servidor Backend (FastAPI)

1. Navega a la carpeta del servidor:
   ```bash
   cd backend
   ```

2. Crear un entorno virtual e instalar las dependencias:
   ```bash
   python -m venv .venv
   #activa el entorno virtial
   .venv\Scripts\activate
   
   pip install -r requirements.txt
   ```

3. Ejecutar el servidor:
   ```bash
   python -m uvicorn app:app --reload
   ```


### 2. Cliente Frontend (React)

1. Abre una nueva terminal en la carpeta del proyecto "museoLili-ia"

2. Instala los módulos de Node:
   ```bash
   npm install
   ```
3. Inicia la aplicación web:
   ```bash
   npm run dev
   ```
### Conexión y Pruebas en Dispositivos Móviles

El aplicativo esta diseñado para utilizarse en dispositivo movil, para ello la forma más fácil y rapida para realizar pruebas en celular es construir un túnel seguro utilizando herramientas como Ngrok o LocalTunnel.

---
## Guia de usuario

1. Ingresar a la URL de nuestra web, en este caso al estar ejecutando de forma local sera algo como: localhost:5173.
   En el caso de estar utilizando herramientas como Ngrok para realizar pruebas desde el celular, ingresar al enlace provisto por Ngrok.

2. Conceder los permisos de camara.

3. A continuación, enfocaremos el objeto del museo el cual queremos consultar y presionaremos el botón "Detectar objeto".

   <img width="324" height="671" alt="image" src="https://github.com/user-attachments/assets/74f4e929-9144-490c-9697-9c60ae0ab81e" /> <img width="316" height="432" alt="image" src="https://github.com/user-attachments/assets/806e4899-4198-4d0b-ac97-0f76763b4d35" />


5. Al esperar un par de segundos, la web nos mostrara la imagen con una mascar dibujada en el objeto, en la parte inferior leeremos la información de la pieza del museo la cual escaneamos y podremos ampliar la información presionando el botón de "Ver información detallada".
 
   <img width="326" height="608" alt="image" src="https://github.com/user-attachments/assets/9b992301-bea3-4df4-b700-462f42e332a9" /> <img width="318" height="667" alt="image" src="https://github.com/user-attachments/assets/af2a814e-cd64-4046-b5f9-b72d36b43930" />

---
## Nota importante sobre el uso del aplicativo web
Este aplicativo no está diseñado para funcionar mostrando fotos de las piezas desde la pantalla de otra computadora, impresiones caseras o imágenes de referencia web.

El modelo de Deep Learning Mask R-CNN ha sido entrenado de forma específica bajo las condiciones de iluminación, profundidad, texturas y ángulos reales correspondientes al Museo Lili de la Universidad Autónoma de Occidente (UAO). Por lo tanto, su uso eficiente, correcto y óptimo está restringido al entorno físico del museo de la institución, interactuando directamente con las piezas arqueológicas reales en sus respectivas exhibiciones.


---
## Modelo Mask R-CNN y dataset
A continuación se proporciona el archivo .ipynb de Google Colab, donde se realizó el entrenamiento de la arquitectura Mask R-CNN.
[PDI_Proyecto_Segmentacion.ipynb](https://github.com/user-attachments/files/28248838/PDI_Proyecto_Segmentacion.ipynb)

De igual manera, se comparte el fragmento de código en Python que permite descargar el Dataset con el que se entreno la Mask R-CNN. Este dataset es completamente propio, capturado y etiquetado por los autores del proyecto:

``` bash
!pip install roboflow

from roboflow import Roboflow
rf = Roboflow(api_key="39YmVeOnVHJB6O3B6OM2")
project = rf.workspace("diegos-workspace-zjhd6").project("pdi_proyecto")
version = project.version(2)
dataset = version.download("coco-segmentation")

```
