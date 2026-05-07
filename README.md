# Campus Park Tracker

A small real-time parking availability system for a campus. Drivers see which lots are open, gate events update the occupancy live, and an admin page lets staff fix wrong events.

## What it does

- Driver dashboard with live lot status (available / near full / full), free spaces, and a chart of the last hour.
- "Car in" and "Car out" buttons that act as the gate hardware. The server blocks entering a full lot or leaving an empty one.
- Admin page with the full event log and a delete button. Because occupancy is computed from the events, deleting a bad event fixes the count automatically.
- Auto-generated Swagger docs at `/docs`.

## Stack

- Python 3.13, FastAPI, SQLite (just `sqlite3`, no ORM)
- Vanilla HTML/CSS/JS, Chart.js for the chart
- No build step

## How it is structured

Three layers:

- `app.py` is the HTTP layer (FastAPI routes).
- `occupancy.py` holds the domain rules. It does not import FastAPI or sqlite3. It just takes numbers and decides whether an event is allowed or what label a lot should show.
- `db.py` is the persistence layer (SQLite, the schema, and the queries).

The thing I like about this split is that I can unit-test the rules in `occupancy.py` without spinning up a server or a database. See `tests/test_occupancy.py`.

### Event sourcing for occupancy

There is no `occupancy` column on the `lots` table. The current count of cars is computed every time from the events:

```sql
SELECT
  SUM(CASE WHEN event_type = 'in'  THEN 1 ELSE 0 END) -
  SUM(CASE WHEN event_type = 'out' THEN 1 ELSE 0 END) AS occupancy
FROM events WHERE lot_id = ?
```

So when an admin deletes a wrong event, the count updates by itself on the next read. No recompute step needed. At larger scale this query would get slow and you would want a stored counter or a snapshot table, but at campus scale it is fine.

## Run it

Needs Python 3.10+.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

python -m uvicorn app:app --reload
```

Then:

- Driver: http://127.0.0.1:8000/
- Admin:  http://127.0.0.1:8000/admin
- Docs:   http://127.0.0.1:8000/docs

The first run creates `campus_park.db` and seeds Lot A (20 spaces) and Lot B (15 spaces).

## API

| Method | Path                              | What it does                          |
|--------|-----------------------------------|---------------------------------------|
| GET    | `/api/lots`                       | List lots with current occupancy      |
| POST   | `/api/events`                     | Record a "Car in" or "Car out" event  |
| GET    | `/api/events?limit=N`             | Recent events for the admin log       |
| DELETE | `/api/events/{id}`                | Remove an event                       |
| GET    | `/api/lots/{id}/history?minutes=N`| Points for the chart                  |

POST body:

```json
{ "lot_id": 1, "type": "in" }
```

Returns 409 if the event is not allowed (full lot on "in", empty lot on "out").

## Tests

```powershell
pip install -r requirements-dev.txt
python -m pytest -v
```

14 tests for `validate_event` and `status_label`.

## Layout

```
.
├── app.py
├── occupancy.py
├── db.py
├── requirements.txt
├── requirements-dev.txt
├── tests/
│   └── test_occupancy.py
└── static/
    ├── index.html
    ├── app.js
    ├── admin.html
    ├── admin.js
    └── styles.css
```

## License

MIT
