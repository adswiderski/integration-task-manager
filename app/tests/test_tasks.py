from fastapi.testclient import TestClient

def test_create_task_requires_auth(client: TestClient):
    """Test creating task without auth fails"""
    response = client.post("/tasks/", json={"title": "Test", "description": "Test"})
    assert response.status_code == 401

def test_create_task_success(client: TestClient):
    """Test creating task with auth succeeds"""
    client.post("/register", json={"email": "test@test.com", "password": "pass"})
    login = client.post("/login", json={"email": "test@test.com", "password": "pass"})

    print(f"Login status: {login.status_code}")
    print(f"Login response: {login.json()}")
    token = login.json()["access_token"]
    
    response = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "My task", "description": "Test task"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "My task"
    assert data["owner_id"] is not None

def test_get_tasks_only_own(client: TestClient):
    """Test user sees only their own tasks"""
    client.post("/register", json={"email": "a@test.com", "password": "pass"})
    login_a = client.post("/login", json={"email": "a@test.com", "password": "pass"})
    token_a = login_a.json()["access_token"]
    
    client.post("/register", json={"email": "b@test.com", "password": "pass"})
    login_b = client.post("/login", json={"email": "b@test.com", "password": "pass"})
    token_b = login_b.json()["access_token"]
    
    client.post("/tasks/", headers={"Authorization": f"Bearer {token_a}"}, json={"title": "A task"})
    
    response = client.get("/tasks/", headers={"Authorization": f"Bearer {token_b}"})
    assert response.status_code == 200
    assert len(response.json()) == 0

def test_update_task(client: TestClient):
    """Test updating task"""
    client.post("/register", json={"email": "test@test.com", "password": "pass"})
    login = client.post("/login", json={"email": "test@test.com", "password": "pass"})
    token = login.json()["access_token"]
    
    create_resp = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Original", "description": "Desc"}
    )
    task_id = create_resp.json()["id"]
    
    update_resp = client.put(
        f"/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Updated"}
    )
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Updated"

def test_delete_task(client: TestClient):
    """Test deleting task"""
    client.post("/register", json={"email": "test@test.com", "password": "pass"})
    login = client.post("/login", json={"email": "test@test.com", "password": "pass"})
    token = login.json()["access_token"]
    
    create_resp = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "To delete"}
    )
    task_id = create_resp.json()["id"]
    
    delete_resp = client.delete(f"/tasks/{task_id}", headers={"Authorization": f"Bearer {token}"})
    assert delete_resp.status_code == 200
    
    get_resp = client.get("/tasks/", headers={"Authorization": f"Bearer {token}"})
    assert len(get_resp.json()) == 0

def test_update_task_status(client: TestClient):
    client.post("/register", json={"email": "test@test.com", "password": "pass"})
    login = client.post("/login", json={"email": "test@test.com", "password": "pass"})
    token = login.json()["access_token"]
    
    task = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Test", "description": "Test"}
    ).json()
    
    response = client.put(
        f"/tasks/{task['id']}",
        headers={"Authorization": f"Bearer {token}"},
        json={"status": "in_progress"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"
    assert response.json()["title"] == "Test"

def test_cannot_update_other_users_task(client: TestClient):
    client.post("/register", json={"email": "alice@test.com", "password": "pass"})
    login_a = client.post("/login", json={"email": "alice@test.com", "password": "pass"})
    token_a = login_a.json()["access_token"]
    
    client.post("/register", json={"email": "bob@test.com", "password": "pass"})
    login_b = client.post("/login", json={"email": "bob@test.com", "password": "pass"})
    token_b = login_b.json()["access_token"]
    
    task = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"title": "Alice task"}
    ).json()
    
    response = client.put(
        f"/tasks/{task['id']}",
        headers={"Authorization": f"Bearer {token_b}"},
        json={"title": "Hacked!"}
    )
    assert response.status_code == 404

def test_cannot_delete_other_users_task(client: TestClient):
    client.post("/register", json={"email": "jaca@test.com", "password": "pass"})
    login_a = client.post("/login", json={"email": "jaca@test.com", "password": "pass"})
    token_a = login_a.json()["access_token"]
    
    client.post("/register", json={"email": "baca@test.com", "password": "pass"})
    login_b = client.post("/login", json={"email": "baca@test.com", "password": "pass"})
    token_b = login_b.json()["access_token"]

    task = client.post(
        "/tasks/",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"title": "Jaca task"}
    ).json()

    response = client.delete(
        f"/tasks/{task['id']}",
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert response.status_code == 404