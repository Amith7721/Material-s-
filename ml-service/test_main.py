from fastapi.testclient import TestClient
from main import app
import io

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_chat_ai():
    payload = {
        "prompt": "Tell me about carbon nanotubes",
        "history": []
    }
    response = client.post("/ml/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "processed" in data["message"]
    assert "confidence" in data

def test_recommend_material():
    payload = {
        "constraints": {"minDensity": 1.5}
    }
    response = client.post("/ml/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    assert data["recommendations"][0]["material"] == "Graphene"

def test_extract_properties():
    file_content = b"Simulated paper content on graphene density."
    file = io.BytesIO(file_content)
    
    response = client.post(
        "/ml/extract-properties",
        files={"file": ("test_paper.pdf", file, "application/pdf")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test_paper.pdf"
    assert "extractedData" in data
    assert data["extractedData"]["materialName"] == "Simulated Extractium"
