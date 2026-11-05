// Demo Users — UI demonstration only. NOT secure authentication.
export const DEMO_USERS = [
  {
    id: 'u-001',
    name: 'Alex Customer',
    email: 'customer@parkwise.demo',
    // Plain text only for client-side demo comparison. Never do this in production.
    password: 'Parkwise123!',
    role: 'customer',
    vehicle: {
      make: 'Tesla',
      model: 'Model 3',
      plate: 'CA 7XYZ89',
      type: 'EV',
      color: 'White',
    },
    joinedDate: '2024-08-15',
    avatar: 'AC',
  },
  {
    id: 'u-admin-001',
    name: 'Alex Mercer',
    email: 'admin@parkwise.demo',
    password: 'Parkwise123!',
    role: 'admin',
    title: 'Operations Director',
    vehicle: null,
    joinedDate: '2023-01-10',
    avatar: 'AM',
  },
];

