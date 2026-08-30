# RAG-Based Offline Multi-Model Vision Chatbot with Decentralized Data

![first_screen](https://github.com/jot-s-bindra/Vision-Decentralized-Offline-Chatbot/assets/112833146/a2a65527-dfcc-4a6a-a037-8e7f75d48291)
![inference](https://github.com/jot-s-bindra/Vision-Decentralized-Offline-Chatbot/assets/112833146/20866aa0-2c67-4426-8f8c-8b6bcab0ed05)

## Overview

This project hosts a fully offline multi-model chatbot built on the Retrieval-Augmented Generation (RAG) model that runs entirely on CPU. It incorporates IPFS (Pinata) technology for decentralized data storage, enabling secure and private interactions. The bot accepts text prompts and images, utilizing a multimodal architecture to enhance language understanding.

A key feature is that instead of a heavy vision LLM, we used multiple smaller models which allows us to process image tasks with a standard text LLM. We used thresholding to guide and manage these multiple models.

## Multi-Model Architecture
![chatbot](https://github.com/jot-s-bindra/Vision-Decentralized-Offline-Chatbot/assets/112833146/19271f00-8d8a-437f-b967-9ebc02b83625)

## Features

- **Offline Chatbot**: Utilizes the RAG architecture for conversational AI.
- **Blockchain Data Storage**: Ensures decentralized and secure data handling via IPFS.
- **Vision Integration**: Accepts images as prompts. Uses a multi-model approach to map images into the prompt.
- **Fine-Tuning Efficiency**: It's easier and computationally inexpensive to fine-tune the VGG model for specific tasks rather than fine-tuning the entire LLM.
- **Lower Parameters**: Despite using multiple models, total parameters are lower than a standard 7.6B model.
- **Streamlit Hosted**: Deployed locally using Streamlit for an easy-to-use interface.

## Architecture

The chatbot employs a multimodal architecture, harnessing the capabilities of various models:
- **LLama2-7b-chat-ggml**: Enhances language understanding.
- **VGG16 Fine-tuned on RAG Data**: Enables vision-based interactions.
- **Salesforce/blip-image-captioning-large**: Facilitates image captioning.
- **CLIP-ViT-L-14**: Encoder used to map both images and text to the same vector space.

---

## Core Implementation Files

### `app.py`
The main entry point for the Streamlit UI, handling text and image inputs.
```python
import streamlit as st
from llm_model import text_generate
from PIL import Image

def main():
    st.title("Chatbot with Image Upload")

    text = st.text_input("Enter your text here:")
    uploaded_image = st.file_uploader("Upload an image")

    if uploaded_image is not None:
        image = Image.open(uploaded_image)
        output_string = text_generate(text, image)

        st.write("Output:")
        st.write(output_string)
    else:
        st.write("Please upload an image.")

if __name__ == "__main__":
    main()
```

### `llm_model.py`
Handles generating text by orchestrating the RAG pipeline, FAISS vector search, and multimodal inputs.
```python
from PIL import Image
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import CTransformers
from sentence_transformers import SentenceTransformer, util
from imgchecker import if_valid
from img2txt import img2txt

DB_FAISS_PATH = 'vectorstore/db_faiss'

embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/clip-ViT-L-14', model_kwargs={'device': 'cpu'})
db = FAISS.load_local(DB_FAISS_PATH, embeddings)
model = SentenceTransformer('clip-ViT-L-14')

config = {"max_new_tokens": 512, "repetition_penalty": 1.1, "top_k": 30, "top_p": 0.90}
llm = CTransformers(
    model="models/llama-2-7b-chat.ggmlv3.q8_0.bin", model_type="llama", config=config
)

def text_generate(text, image):
    label = if_valid(image)
    img_txt = img2txt(image)
    text_emb = model.encode(text + label)
    image_emb = model.encode(image)
    imgtxt_emb = model.encode(img_txt)

    text_similar = db.similarity_search_by_vector(text_emb)
    image_similar = db.similarity_search_by_vector(image_emb)
    image_text_similar = db.similarity_search_by_vector(imgtxt_emb)

    prompt_for_llm = f"""'{text}'
    The image shows {img_txt} and {label}
    The context from the image from the document of interest: '{image_similar[0].page_content} and {image_text_similar[0].page_content}'
    The context from the text from the document of interest: '{text_similar[0].page_content}'"""

    output_string = llm(prompt_for_llm)
    return output_string
```

### `ingest.py`
Builds the FAISS vector database from local PDF files.
```python
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter 

DATA_PATH = 'data/'
DB_FAISS_PATH = 'vectorstore/db_faiss'

def create_vector_db():
    loader = DirectoryLoader(DATA_PATH, glob='*.pdf', loader_cls=PyPDFLoader)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=5)
    texts = text_splitter.split_documents(documents)

    embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/clip-ViT-L-14', model_kwargs={'device': 'cpu'})
    db = FAISS.from_documents(texts, embeddings)
    db.save_local(DB_FAISS_PATH)

if __name__ == "__main__":
    create_vector_db()
```

### `imgchecker.py` & `vgg16pred.py`
These files run similarity thresholding and predictive classification logic to ensure the input images map correctly to contextual bounds before querying the LLM.

```python
# imgchecker.py excerpt
def if_valid(image):
    img_caption = img2txt(image)
    vgg_label = predictive_label(image)
    value = sim_score_img_vgg(image)
    if value > 0.55:
        return vgg_label
    else:
        return None
```

```python
# vgg16pred.py excerpt
def predictive_label(image):
    val = predict(image)
    high_confidence_class = get_high_confidence_class(val, threshold=0.9)
    return reverse_encoding(high_confidence_class)
```

## IPFS Working and Deduplication
![ipfs_chunker_4](https://github.com/jot-s-bindra/Vision-Decentralized-Offline-Chatbot/assets/112833146/17b099dd-e63d-4665-b998-4ba9e31c7001)

By decentralizing data storage through IPFS, this project effectively manages data deduplication, chunking, and block exchange protocols offline and securely.
