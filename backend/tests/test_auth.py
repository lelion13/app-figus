def test_register_and_login(client):
    register = client.post(
        "/api/auth/register",
        json={
            "nickname": "juan_test",
            "email": "juan@example.com",
            "password": "secreta",
        },
    )
    assert register.status_code == 200
    assert "access_token" in register.json()

    login = client.post(
        "/api/auth/login",
        json={"email": "juan@example.com", "password": "secreta"},
    )
    assert login.status_code == 200
    assert login.json()["token_type"] == "bearer"


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "no@example.com", "password": "wrong"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciales inválidas"


def test_protected_route_without_token(client):
    response = client.get("/api/stickers")
    assert response.status_code == 401
