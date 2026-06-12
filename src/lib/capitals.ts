export interface Capital {
  state: string;
  stateCode: string;
  capital: string;
  latitude: number;
  longitude: number;
  region: 'Northeast' | 'Midwest' | 'South' | 'West';
}

export const capitals: Capital[] = [
  // ── Northeast ──
  { state: 'Maine', stateCode: 'ME', capital: 'Augusta', latitude: 44.323535, longitude: -69.765261, region: 'Northeast' },
  { state: 'New Hampshire', stateCode: 'NH', capital: 'Concord', latitude: 43.206898, longitude: -71.537994, region: 'Northeast' },
  { state: 'Vermont', stateCode: 'VT', capital: 'Montpelier', latitude: 44.26639, longitude: -72.57194, region: 'Northeast' },
  { state: 'Massachusetts', stateCode: 'MA', capital: 'Boston', latitude: 42.358431, longitude: -71.059773, region: 'Northeast' },
  { state: 'Rhode Island', stateCode: 'RI', capital: 'Providence', latitude: 41.82355, longitude: -71.422132, region: 'Northeast' },
  { state: 'Connecticut', stateCode: 'CT', capital: 'Hartford', latitude: 41.767, longitude: -72.677, region: 'Northeast' },
  { state: 'New York', stateCode: 'NY', capital: 'Albany', latitude: 42.659829, longitude: -73.781339, region: 'Northeast' },
  { state: 'New Jersey', stateCode: 'NJ', capital: 'Trenton', latitude: 40.2171, longitude: -74.7429, region: 'Northeast' },
  { state: 'Pennsylvania', stateCode: 'PA', capital: 'Harrisburg', latitude: 40.269789, longitude: -76.875613, region: 'Northeast' },

  // ── Midwest ──
  { state: 'Ohio', stateCode: 'OH', capital: 'Columbus', latitude: 39.962245, longitude: -83.000647, region: 'Midwest' },
  { state: 'Michigan', stateCode: 'MI', capital: 'Lansing', latitude: 42.7335, longitude: -84.5467, region: 'Midwest' },
  { state: 'Indiana', stateCode: 'IN', capital: 'Indianapolis', latitude: 39.768403, longitude: -86.158068, region: 'Midwest' },
  { state: 'Illinois', stateCode: 'IL', capital: 'Springfield', latitude: 39.783250, longitude: -89.650373, region: 'Midwest' },
  { state: 'Wisconsin', stateCode: 'WI', capital: 'Madison', latitude: 43.074722, longitude: -89.384444, region: 'Midwest' },
  { state: 'Minnesota', stateCode: 'MN', capital: 'Saint Paul', latitude: 44.95, longitude: -93.094, region: 'Midwest' },
  { state: 'Iowa', stateCode: 'IA', capital: 'Des Moines', latitude: 41.590939, longitude: -93.620866, region: 'Midwest' },
  { state: 'Missouri', stateCode: 'MO', capital: 'Jefferson City', latitude: 38.572954, longitude: -92.189283, region: 'Midwest' },
  { state: 'North Dakota', stateCode: 'ND', capital: 'Bismarck', latitude: 46.808333, longitude: -100.783333, region: 'Midwest' },
  { state: 'South Dakota', stateCode: 'SD', capital: 'Pierre', latitude: 44.367966, longitude: -100.346413, region: 'Midwest' },
  { state: 'Nebraska', stateCode: 'NE', capital: 'Lincoln', latitude: 40.809868, longitude: -96.675345, region: 'Midwest' },
  { state: 'Kansas', stateCode: 'KS', capital: 'Topeka', latitude: 39.048922, longitude: -95.679365, region: 'Midwest' },

  // ── South ──
  { state: 'Delaware', stateCode: 'DE', capital: 'Dover', latitude: 39.161921, longitude: -75.526755, region: 'South' },
  { state: 'Maryland', stateCode: 'MD', capital: 'Annapolis', latitude: 38.972945, longitude: -76.501157, region: 'South' },
  { state: 'Virginia', stateCode: 'VA', capital: 'Richmond', latitude: 37.5407, longitude: -77.4360, region: 'South' },
  { state: 'West Virginia', stateCode: 'WV', capital: 'Charleston', latitude: 38.349497, longitude: -81.633294, region: 'South' },
  { state: 'Kentucky', stateCode: 'KY', capital: 'Frankfort', latitude: 38.197274, longitude: -84.863111, region: 'South' },
  { state: 'North Carolina', stateCode: 'NC', capital: 'Raleigh', latitude: 35.771, longitude: -78.638, region: 'South' },
  { state: 'South Carolina', stateCode: 'SC', capital: 'Columbia', latitude: 34.0007, longitude: -81.0348, region: 'South' },
  { state: 'Tennessee', stateCode: 'TN', capital: 'Nashville', latitude: 36.165, longitude: -86.784, region: 'South' },
  { state: 'Georgia', stateCode: 'GA', capital: 'Atlanta', latitude: 33.7403, longitude: -84.3897, region: 'South' },
  { state: 'Florida', stateCode: 'FL', capital: 'Tallahassee', latitude: 30.438256, longitude: -84.280733, region: 'South' },
  { state: 'Alabama', stateCode: 'AL', capital: 'Montgomery', latitude: 32.361538, longitude: -86.279118, region: 'South' },
  { state: 'Mississippi', stateCode: 'MS', capital: 'Jackson', latitude: 32.320, longitude: -90.207, region: 'South' },
  { state: 'Arkansas', stateCode: 'AR', capital: 'Little Rock', latitude: 34.736009, longitude: -92.331122, region: 'South' },
  { state: 'Louisiana', stateCode: 'LA', capital: 'Baton Rouge', latitude: 30.4515, longitude: -91.1871, region: 'South' },
  { state: 'Texas', stateCode: 'TX', capital: 'Austin', latitude: 30.266667, longitude: -97.75, region: 'South' },
  { state: 'Oklahoma', stateCode: 'OK', capital: 'Oklahoma City', latitude: 35.482309, longitude: -97.534994, region: 'South' },

  // ── West ──
  { state: 'Montana', stateCode: 'MT', capital: 'Helena', latitude: 46.5857, longitude: -112.027, region: 'West' },
  { state: 'Wyoming', stateCode: 'WY', capital: 'Cheyenne', latitude: 41.145548, longitude: -104.802042, region: 'West' },
  { state: 'Colorado', stateCode: 'CO', capital: 'Denver', latitude: 39.7391667, longitude: -104.984167, region: 'West' },
  { state: 'New Mexico', stateCode: 'NM', capital: 'Santa Fe', latitude: 35.667231, longitude: -105.964575, region: 'West' },
  { state: 'Arizona', stateCode: 'AZ', capital: 'Phoenix', latitude: 33.448457, longitude: -112.073844, region: 'West' },
  { state: 'Utah', stateCode: 'UT', capital: 'Salt Lake City', latitude: 40.760779, longitude: -111.891047, region: 'West' },
  { state: 'Idaho', stateCode: 'ID', capital: 'Boise', latitude: 43.613739, longitude: -116.237651, region: 'West' },
  { state: 'Washington', stateCode: 'WA', capital: 'Olympia', latitude: 47.042418, longitude: -122.893077, region: 'West' },
  { state: 'Oregon', stateCode: 'OR', capital: 'Salem', latitude: 44.9429, longitude: -123.0351, region: 'West' },
  { state: 'Nevada', stateCode: 'NV', capital: 'Carson City', latitude: 39.160949, longitude: -119.753877, region: 'West' },
  { state: 'California', stateCode: 'CA', capital: 'Sacramento', latitude: 38.555605, longitude: -121.468926, region: 'West' },
  { state: 'Alaska', stateCode: 'AK', capital: 'Juneau', latitude: 58.301935, longitude: -134.419740, region: 'West' },
  { state: 'Hawaii', stateCode: 'HI', capital: 'Honolulu', latitude: 21.30895, longitude: -157.826182, region: 'West' },
];