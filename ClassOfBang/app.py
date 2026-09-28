from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel

app = FastAPI(title="Class of Bang RAG Chatbox API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Sedang memproses PDF...")
loader = PyPDFLoader("game information.pdf")
docs = loader.load()

# Split PDF into small sections 
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = text_splitter.split_documents(docs)

# Vector Databasw 
embeddings = OllamaEmbeddings(model="nomic-embed-text")
vector_store = Chroma.from_documents(chunks, embeddings)
retriever = vector_store.as_retriever(search_kwargs={"k": 5}) # Selecting the 3 most suitable text excerpts 

# Setting AI Ollama & Prompt 
llm = OllamaLLM(model="llama3.2")

system_prompt = (
    "You are an assistant for the Class of Bang game community website.\n\n"
    
    "IMPORTANT RULES:\n"
    "1. Answer the user's question ONLY using the information in the Context below.\n"
    "2. Read the Context carefully and include specific details such as names, roles, dates, numbers, and other relevant information when they are available.\n"
    "3. If the Context contains the answer, DO NOT say that the information is missing.\n"
    "4. Pay close attention to headings and lists in the Context.\n Never replace specific information with a vague answer. For example, if the Context lists people's names, mention their names.\n"
    "5. If the answer is truly not available in the Context, reply exactly:\n 'Sorry, I cannot provide the answer for this question.'\n"
    "6. Do not generate answers outside the file provided\n"
    "7. When the user asks who created, founded, or started the project, provide the names listed under 'Founders' and their roles if available\n\n"

    "Context:\n{context}"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}"),
])

# Create RAG Chain 
question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)
print("Sistem RAG siap digunakan!")

# API Request
class ChatRequest(BaseModel):
    message: str

# EndPoint
@app.get("/")
def root():
    return{"Hello":"World"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        return {"reply": "Please enter a message."}

    # Handle greetings
    greetings = [
        "hello",
        "hi",
        "halo",
        "hai",
        "hey",
        "hello there",
        "hi there"
    ]

    if message.lower() in greetings:
        return {
            "reply": "Hello! How can I help you?"
        }

    documents = retriever.invoke(message)

    print("\n===== RETRIEVED DOCUMENTS =====")

    for i, doc in enumerate(documents):
        print(f"\n--- CHUNK {i+1} ---")
        print(doc.page_content)

    response = rag_chain.invoke({
        "input": message
    })

    return {
        "reply": response["answer"]
    }