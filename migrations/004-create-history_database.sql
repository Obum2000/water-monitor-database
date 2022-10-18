create table history (
    id integer primary key AUTOINCREMENT,
    ph real,
    temperature real,
    turbidity real,
    hardness real,
    valve_pressure real,
    day_of_week real,
    time real,
    flow_rate real,
    water_pressure real,
    leak_detector text,
    quality_detector text
);