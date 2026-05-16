def _auth_headers(client) -> dict[str, str]:
    response = client.post(
        "/api/auth/register",
        json={
            "nickname": "figus_user",
            "email": "figus@example.com",
            "password": "secreta",
        },
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_list_stickers_and_toggle(client):
    headers = _auth_headers(client)
    catalog = client.get("/api/stickers", headers=headers)
    assert catalog.status_code == 200
    teams = catalog.json()["teams"]
    assert len(teams) > 0
    first_sticker_id = teams[0]["stickers"][0]["id"]

    progress_before = client.get("/api/me/progress", headers=headers).json()
    assert progress_before["obtained"] == 0

    toggle = client.patch(
        f"/api/me/stickers/{first_sticker_id}",
        headers=headers,
        json={},
    )
    assert toggle.status_code == 200
    assert toggle.json()["owned"] is True

    progress_after = client.get("/api/me/progress", headers=headers).json()
    assert progress_after["obtained"] == 1
    assert progress_after["missing"] == progress_after["total"] - 1
