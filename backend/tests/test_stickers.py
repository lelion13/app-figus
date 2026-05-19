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


def test_me_missing(client):
    response = client.post(
        "/api/auth/register",
        json={
            "nickname": "figus_missing",
            "email": "figus_missing@example.com",
            "password": "secreta",
        },
    )
    assert response.status_code == 200
    headers = {"Authorization": f"Bearer {response.json()['access_token']}"}
    catalog = client.get("/api/stickers", headers=headers).json()
    first_sticker_id = catalog["teams"][0]["stickers"][0]["id"]
    first_code = catalog["teams"][0]["stickers"][0]["code"]
    first_team = catalog["teams"][0]["team"]

    missing_before = client.get("/api/me/missing", headers=headers)
    assert missing_before.status_code == 200
    data_before = missing_before.json()
    assert data_before["total_missing"] > 0
    team_group = next(g for g in data_before["teams"] if g["team"] == first_team)
    assert first_code in team_group["codes"]

    client.patch(
        f"/api/me/stickers/{first_sticker_id}",
        headers=headers,
        json={},
    )

    missing_after = client.get("/api/me/missing", headers=headers).json()
    assert missing_after["total_missing"] == data_before["total_missing"] - 1
    team_after = next(
        (g for g in missing_after["teams"] if g["team"] == first_team), None
    )
    if team_after is not None:
        assert first_code not in team_after["codes"]
