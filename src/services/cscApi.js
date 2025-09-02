export const fetchCountries = async () => {
  const res = await fetch("https://countriesnow.space/api/v0.1/countries");
  const data = await res.json();
  return data.data.map((c) => ({ name: c.country, iso2: c.iso2 }));
};

export const fetchStates = async (country) => {
  const res = await fetch(
    "https://countriesnow.space/api/v0.1/countries/states",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    }
  );
  const data = await res.json();
  return data.data.states.map((s) => ({ name: s.name }));
};

export const fetchCities = async (country, state) => {
  const res = await fetch(
    "https://countriesnow.space/api/v0.1/countries/state/cities",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country, state }),
    }
  );
  const data = await res.json();
  return data.data; // ← array de strings con nombres de ciudades
};
