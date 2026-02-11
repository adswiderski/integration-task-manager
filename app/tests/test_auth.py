from fastapi.testclient import TestClient

def test_register_user(client: TestClient):
    """Test user registration"""
    response = client.post(
        "/register",
        json={"email": "test@test.com", "password": "testpass123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@test.com"
    assert "id" in data

def test_register_duplicate_email(client: TestClient):
    """Test registering with duplicate email fails"""
    client.post("/register", json={"email": "test@test.com", "password": "pass"})
    response = client.post("/register", json={"email": "test@test.com", "password": "pass"})
    assert response.status_code == 400

def test_login_success(client: TestClient):
    """Test successful login"""
    client.post("/register", json={"email": "test1@test.com", "password": "test1pass"})
    response = client.post("/login", json={"email": "test1@test.com", "password": "test1pass"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_wrong_password(client: TestClient):
    """Test login with wrong password fails"""
    client.post("/register", json={"email": "test@test.com", "password": "correct"})
    response = client.post("/login", json={"email": "test@test.com", "password": "wrong"})
    assert response.status_code == 401